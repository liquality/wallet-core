import { HttpClient } from '@chainify/client';
import { EvmTypes } from '@chainify/evm';
import { Transaction, TransactionRequest, TxStatus } from '@chainify/types';
import LiFi, {
  ChainId,
  LifiStep,
  Order,
  Orders,
  QuoteRequest as LifiQuoteRequest,
  Step,
  ToolConfiguration,
} from '@lifi/sdk';
import { chains, currencyToUnit, unitToCurrency } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { ActionContext } from '../../store';
import { withInterval, withLock } from '../../store/actions/performNextAction/utils';
import { prettyBalance } from '../../utils/coinFormatter';
import cryptoassets from '../../utils/cryptoassets';
import { ChainNetworks } from '../../utils/networks';
import { EvmSwapHistoryItem, EvmSwapProvider, EvmSwapProviderConfig } from '../EvmSwapProvider';
import {
  EstimateFeeRequest,
  EstimateFeeResponse,
  NextSwapActionRequest,
  QuoteRequest,
  SwapProviderError,
  SwapProviderErrorTypes,
  SwapRequest,
  SwapStatus,
} from '../types';

export interface LifiSwapProviderConfig extends EvmSwapProviderConfig {
  apiURL: string;
  slippage?: number;
  order?: Order;
}

export interface LifiSwapHistoryItem extends EvmSwapHistoryItem {
  fromFundHash: string;
  fromFundTx: Transaction<EvmTypes.EthersTransactionResponse>;
}

interface LiFiErrorType {
  action: any;
  code: string;
  errorType: string;
  message: string;
  tool: string;
}

class LifiSwapProvider extends EvmSwapProvider {
  public readonly config: LifiSwapProviderConfig;
  public readonly nativeAssetAddress = ethers.constants.AddressZero;

  private readonly _lifiClient: LiFi;
  private readonly _httpClient: HttpClient;
  private _lifiTools: ToolConfiguration;
  private _lifiConfig: Partial<LifiQuoteRequest>;

  constructor(config: LifiSwapProviderConfig) {
    super(config);

    this._httpClient = new HttpClient({ baseURL: this.config.apiURL });
    this._lifiClient = new LiFi();
  }

  async getSupportedPairs() {
    return [];
  }

  // returns rates between tokens
  async getQuote({ network, from, to, amount, fromAccountId, toAccountId, walletId }: QuoteRequest) {
    const fromInfo = cryptoassets[from];
    const toInfo = cryptoassets[to];

    const fromAmountInUnit = currencyToUnit(fromInfo, new BN(amount)).toString(10);

    const fromChainId = ChainNetworks[fromInfo.chain][network].chainId;
    const toChainId = ChainNetworks[toInfo.chain][network].chainId;

    const fromAddressRaw = await this.getSwapAddress(network, walletId as string, from, fromAccountId as string);
    const toAddressRaw = await this.getSwapAddress(network, walletId as string, to, toAccountId as string);

    const quoteRequest = {
      fromChain: fromChainId as number,
      fromAmount: fromAmountInUnit,
      fromToken: fromInfo.contractAddress ?? this.nativeAssetAddress,
      toChain: toChainId as number,
      toToken: toInfo.contractAddress ?? this.nativeAssetAddress,
      fromAddress: chains[fromInfo.chain].formatAddress(fromAddressRaw),
      toAddress: chains[toInfo.chain].formatAddress(toAddressRaw),
      ...(await this.getConfig()),
    };

    try {
      const lifiRoute = await this._httpClient.nodeGet('/quote', quoteRequest);

      return { from, to, fromAmount: fromAmountInUnit, toAmount: lifiRoute.estimate.toAmount, lifiRoute };
    } catch (e) {
      if (!e.errors) {
        return null;
      }

      const lowAmmountErrors = e.errors.filter(
        (error: LiFiErrorType) => error.code === SwapProviderErrorTypes.AMOUNT_TOO_LOW
      );
      if (lowAmmountErrors.length > 0) {
        /*
         * message format is: 'The amount is too low or too high. The minimum is 20000000 and the maximum is 3500000000000'
         * pulling all minimum amounts and then taking the lowest one
         */
        const min = lowAmmountErrors
          .map((error: LiFiErrorType) => new BN(error.message.match(/\d+/)?.[0] as string))
          .sort((a: BN, b: BN) => a.minus(b))[0];

        return {
          from,
          to,
          fromAmount: fromAmountInUnit,
          toAmount: '0',
          swapProviderError: {
            code: SwapProviderErrorTypes.AMOUNT_TOO_LOW,
            min: unitToCurrency(toInfo, min),
          } as SwapProviderError,
        };
      }

      const feesHigherThanAmountError = e.errors.find(
        (error: LiFiErrorType) => error.code === SwapProviderErrorTypes.FEES_HIGHER_THAN_AMOUNT
      );
      if (feesHigherThanAmountError) {
        return {
          from,
          to,
          fromAmount: fromAmountInUnit,
          toAmount: '0',
          swapProviderError: { code: SwapProviderErrorTypes.FEES_HIGHER_THAN_AMOUNT } as SwapProviderError,
        };
      }

      return null;
    }
  }

  async newSwap(swap: SwapRequest<LifiSwapHistoryItem>) {
    const route = this.getRoute(swap.quote);

    const approvalAddress = route.estimate.approvalAddress;
    const approveTx = await this.approve(swap, false, approvalAddress);
    let updates;
    if (approveTx) {
      updates = approveTx;
    } else {
      updates = await this.initiateSwap(swap);
    }
    return { id: uuidv4(), ...updates };
  }

  private async initiateSwap({ network, walletId, quote }: SwapRequest<LifiSwapHistoryItem>) {
    const route = this.getRoute(quote);

    const client = super.getClient(network, walletId, quote.from, quote.fromAccountId);
    const txData = route.transactionRequest as TransactionRequest;

    const fromFundTx = await client.wallet.sendTransaction({
      data: txData.data,
      to: txData.to,
      value: txData.value,
      gasLimit: txData.gasLimit,
      fee: quote.fee,
    } as TransactionRequest);

    return {
      status: 'WAITING_FOR_INITIATION_CONFIRMATIONS',
      fromFundTx,
      fromFundHash: fromFundTx.hash,
    };
  }

  //  ======== FEES ========
  async estimateFees(feeRequest: EstimateFeeRequest<string, LifiSwapHistoryItem>) {
    const route = this.getRoute(feeRequest.quote);

    if (feeRequest.txType in this._txTypes()) {
      const fees: EstimateFeeResponse = {};

      const client = this.getClient(
        feeRequest.network,
        feeRequest.walletId,
        feeRequest.quote.from,
        feeRequest.quote.fromAccountId
      );

      const approvalData = await this.buildApprovalTx(feeRequest, false, route.estimate.approvalAddress);
      let approvalGas = 0;
      if (approvalData) {
        approvalGas = (
          await client.chain.getProvider().estimateGas({ ...approvalData, fee: feeRequest.quote.fee })
        ).toNumber();
      }

      const txData = route.transactionRequest;
      let txGas = 0;
      try {
        txGas = (
          await client.chain
            .getProvider()
            .estimateGas({ data: txData?.data, to: txData?.to, from: txData?.from, value: txData?.value })
        ).toNumber();
      } catch {
        txGas = txData?.gasLimit as number;
      }

      const nativeAsset = chains[cryptoassets[feeRequest.quote.from].chain].nativeAsset;

      // have only one fee and it cannot be changed by user
      for (const feePrice of feeRequest.feePrices) {
        const gasPrice = new BN(feePrice).times(1e9); // ETH fee price is in gwei
        const fee = new BN(approvalGas).plus(txGas).times(1.1).times(gasPrice);
        fees[feePrice] = unitToCurrency(cryptoassets[nativeAsset], fee);
      }

      return fees;
    }

    return null;
  }

  async getMin(_quoteRequest: QuoteRequest) {
    return new BN(0);
  }

  // ======== HELPERS ========
  // cross chain swaps info can be aquire only via Li.Fi API
  private async getCrossChainSwapStatus(quote: LifiSwapHistoryItem) {
    const route = this.getRoute(quote);

    const result = await this._httpClient.nodeGet('/status', {
      bridge: route.tool,
      fromChain: this.getChainNameByChainID(route.action.fromChainId as number),
      toChain: this.getChainNameByChainID(route.action.toChainId as number),
      txHash: quote.fromFundHash,
    });

    return result;
  }

  private getChainNameByChainID(id: number) {
    const indexOfChainId = Object.values(ChainId).indexOf(id as unknown as ChainId);
    return Object.keys(ChainId)[indexOfChainId];
  }

  /*
   * In LiFi 3 types of swaps are available:
   * 'Swap' -> single chain (for example: uniswap)
   * 'Cross' -> multi chain / bridging (for example: hop)
   * 'LiFi' -> some combination of the previous 2 types
   * (its close to Liquality Boost but more advanced
   * for example: LiFi swap can include 2 `Swap` actions and 1 `Cross` action)
   */
  private isCrossSwap(swap: LifiSwapHistoryItem) {
    const route = this.getRoute(swap);
    switch (route.type) {
      case 'swap':
        return false;
      case 'cross':
        return true;
      case 'lifi':
        return (route as LifiStep).includedSteps.reduce(
          (acc: boolean, action: Step) => action.type === 'cross' || acc,
          false
        );
    }
  }

  private getRoute(quote: LifiSwapHistoryItem) {
    if (!quote.lifiRoute) {
      throw new Error(`LiFiSwapProvider: best route doesn't exist`);
    }

    return quote.lifiRoute;
  }

  /*
   * cache tools
   */
  private async getTools() {
    if (!this._lifiTools) {
      const tools = await this._lifiClient.getTools();

      if (!tools || !tools.bridges || !tools.exchanges) {
        throw new Error('LifiSwapProvider: bridges and exchanges not available');
      }

      this._lifiTools = {
        allowBridges: tools.bridges.map((bridge) => bridge.key),
        allowExchanges: tools.exchanges.map((exchange) => exchange.key),
      };
    }

    return this._lifiTools;
  }

  /*
   * LiFi config
   */
  private async getConfig() {
    if (!this._lifiConfig) {
      this._lifiConfig = {
        /*
         * Default slippage should be in the range of 3% to 5%
         */
        slippage: this.config.slippage ?? 0.05, // 5 / 100 -> 5%
        /*
         * export declare const Orders: readonly ["RECOMMENDED", "FASTEST", "CHEAPEST", "SAFEST"];
         * keep the "RECOMMENDED" as a default
         */
        order: this.config.order ?? Orders[0], // 'RECOMMENDED'
        integrator: 'Liquality Wallet',
        ...(await this.getTools()),
      };
    }

    return this._lifiConfig;
  }

  // ======== STATE TRANSITIONS ========
  async waitForInitiationConfirmations({ swap, network, walletId }: NextSwapActionRequest<LifiSwapHistoryItem>) {
    const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);

    try {
      const tx = await client.chain.getTransactionByHash(swap.fromFundHash);
      if (tx && tx.confirmations && tx.confirmations > 0) {
        const { status } = tx;
        this.updateBalances(network, walletId, [swap.fromAccountId]);

        // if cross chain wait for receive confirmation
        if (status === TxStatus.Success && this.isCrossSwap(swap)) {
          return {
            endTime: Date.now(),
            status: 'WAITING_FOR_RECEIVE_CONFIRMATIONS',
          };
        }

        return {
          endTime: Date.now(),
          status: status === TxStatus.Success ? 'SUCCESS' : 'FAILED',
        };
      }
    } catch (e) {
      if (e.name === 'TxNotFoundError') {
        console.warn(e);
      } else {
        throw e;
      }
    }
  }

  async waitForReceiveConfirmations({ swap, network, walletId }: NextSwapActionRequest<LifiSwapHistoryItem>) {
    try {
      const result = await this.getCrossChainSwapStatus(swap);

      if (result.status === 'DONE' || result.status === 'FAILED') {
        this.updateBalances(network, walletId, [swap.toAccountId]);
        return {
          endTime: Date.now(),
          status: result.status === 'DONE' ? 'SUCCESS' : 'FAILED',
        };
      }
    } catch (e) {
      // TODO: timeout in case API doesn't respond
      console.warn('LifiSwapProvider: ', e);
    }
  }

  async performNextSwapAction(
    store: ActionContext,
    { network, walletId, swap }: NextSwapActionRequest<LifiSwapHistoryItem>
  ) {
    switch (swap.status) {
      case 'WAITING_FOR_APPROVE_CONFIRMATIONS':
        return withInterval(async () => this.waitForApproveConfirmations({ swap, network, walletId }));
      case 'APPROVE_CONFIRMED':
        return withLock(store, { item: swap, network, walletId, asset: swap.from }, async () =>
          this.initiateSwap({ quote: swap, network, walletId })
        );
      case 'WAITING_FOR_INITIATION_CONFIRMATIONS':
        return withInterval(async () => this.waitForInitiationConfirmations({ swap, network, walletId }));
      case 'WAITING_FOR_RECEIVE_CONFIRMATIONS':
        return await withInterval(async () => this.waitForReceiveConfirmations({ swap, network, walletId }));
    }
  }

  protected _getStatuses(): Record<string, SwapStatus> {
    return {
      ...super._getStatuses(),
      WAITING_FOR_INITIATION_CONFIRMATIONS: {
        step: 1,
        label: 'Swapping {from}',
        filterStatus: 'PENDING',
        notification() {
          return {
            message: 'Engaging LiFi',
          };
        },
      },
      WAITING_FOR_RECEIVE_CONFIRMATIONS: {
        step: 2,
        label: 'Swapping {to}',
        filterStatus: 'PENDING',
        notification() {
          return {
            message: 'Engaging LiFi',
          };
        },
      },
      SUCCESS: {
        step: 3,
        label: 'Completed',
        filterStatus: 'COMPLETED',
        notification(swap: any) {
          return {
            message: `Swap completed, ${prettyBalance(swap.toAmount, swap.to)} ${swap.to} ready to use`,
          };
        },
      },
      FAILED: {
        step: 3,
        label: 'Swap Failed',
        filterStatus: 'REFUNDED',
        notification() {
          return {
            message: 'Swap failed',
          };
        },
      },
    };
  }

  protected _txTypes() {
    return {
      SWAP: 'SWAP',
    };
  }

  protected _fromTxType(): string | null {
    return this._txTypes().SWAP;
  }

  protected _toTxType(): string | null {
    return null;
  }

  protected _timelineDiagramSteps(): string[] {
    return ['APPROVE', 'INITIATION', 'RECEIVE'];
  }

  protected _totalSteps(): number {
    return 4;
  }
}

export { LifiSwapProvider };
