import { HttpClient } from '@chainify/client';
import { EvmTypes } from '@chainify/evm';
import { Transaction, TransactionRequest, TxStatus } from '@chainify/types';
import LiFi, { ChainId, ConfigUpdate, LifiStep, Order, Orders, RouteOptions, Step } from '@lifi/sdk';
import { getChain, currencyToUnit, unitToCurrency } from '@liquality/cryptoassets';
import { getParser, LifiQuoteErrorParser } from '@liquality/error-parser';
import BN from 'bignumber.js';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { ActionContext } from '../../store';
import { withInterval, withLock } from '../../store/actions/performNextAction/utils';
import { prettyBalance } from '../../utils/coinFormatter';
import cryptoassets from '../../utils/cryptoassets';
import { EvmSwapHistoryItem, EvmSwapProvider, EvmSwapProviderConfig } from '../EvmSwapProvider';
import {
  EstimateFeeRequest,
  EstimateFeeResponse,
  NextSwapActionRequest,
  QuoteRequest,
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

export { Action as LifiToolAction, QuoteRequest as LifiQuoteRequest } from '@lifi/sdk';

class LifiSwapProvider extends EvmSwapProvider {
  public readonly config: LifiSwapProviderConfig;
  public readonly nativeAssetAddress = ethers.constants.AddressZero;

  private readonly _lifiClient: LiFi;
  private readonly _httpClient: HttpClient;

  constructor(config: LifiSwapProviderConfig) {
    super(config);

    const lifiConfig: ConfigUpdate = {
      defaultRouteOptions: {
        /*
         * Default slippage should be in the range of 3% to 5%
         */
        slippage: config.slippage ?? 0.05, // 5 / 100 -> 5%
        /*
         * export declare const Orders: readonly ["RECOMMENDED", "FASTEST", "CHEAPEST", "SAFEST"];
         * keep the "RECOMMENDED" as a default
         */
        order: config.order ?? Orders[0], // 'RECOMMENDED'
        integrator: 'Liquality Wallet',
        /*
         * Connext adds additional 8 seconds to fetching quote time. Disable it for now.
         */
        bridges: {
          deny: ['connext'],
        },
      } as RouteOptions,
    };

    this._httpClient = new HttpClient({ baseURL: this.config.apiURL });
    this._lifiClient = new LiFi(lifiConfig);
  }

  async getSupportedPairs() {
    return [];
  }

  // returns rates between tokens
  async getQuote({ network, from, to, amount, fromAccountId, toAccountId, walletId }: QuoteRequest) {
    const fromInfo = cryptoassets[from];
    const toInfo = cryptoassets[to];

    const fromAmountInUnit = currencyToUnit(fromInfo, new BN(amount)).toString(10);

    const fromChainId = getChain(network, fromInfo.chain).network.chainId;
    const toChainId = getChain(network, toInfo.chain).network.chainId;

    const fromAddressRaw = await this.getSwapAddress(network, walletId as string, from, fromAccountId as string);
    const toAddressRaw = await this.getSwapAddress(network, walletId as string, to, toAccountId as string);

    const quoteRequest = {
      fromChain: fromChainId as number,
      fromAmount: fromAmountInUnit,
      fromToken: fromInfo.contractAddress ?? this.nativeAssetAddress,
      toChain: toChainId as number,
      toToken: toInfo.contractAddress ?? this.nativeAssetAddress,
      fromAddress: getChain(network, fromInfo.chain).formatAddress(fromAddressRaw),
      toAddress: getChain(network, toInfo.chain).formatAddress(toAddressRaw),
      order: this._lifiClient.getConfig().defaultRouteOptions.order,
      slippage: this._lifiClient.getConfig().defaultRouteOptions.slippage,
      integrator: this._lifiClient.getConfig().defaultRouteOptions.integrator,
      denyBridges: this._lifiClient.getConfig().defaultRouteOptions.bridges?.deny,
    };

    try {
      const parser = getParser(LifiQuoteErrorParser);
      const lifiRoute = (await parser.wrapAync(async () => await this._lifiClient.getQuote(quoteRequest), {
        fromToken: quoteRequest.fromToken,
        toToken: quoteRequest.toToken,
        fromAmount: quoteRequest.fromAmount,
      })) as Step;

      return { from, to, fromAmount: fromAmountInUnit, toAmount: lifiRoute.estimate.toAmount, lifiRoute };
    } catch (e) {
      console.warn('LifiSwapProvider error : ', e);
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
          await client.chain.getProvider().estimateGas({
            data: txData?.data,
            to: txData?.to,
            from: txData?.from,
            value: txData?.value,
            fee: feeRequest.quote.fee,
          })
        ).toNumber();
      } catch {
        txGas = txData?.gasLimit as number;
      }

      const nativeAsset = getChain(feeRequest.network, cryptoassets[feeRequest.quote.from].chain).nativeAsset[0];

      // have only one fee and it cannot be changed by user
      for (const feePrice of feeRequest.feePrices) {
        const gasPrice = new BN(feePrice).times(1e9); // ETH fee price is in gwei
        const fee = new BN(approvalGas).plus(txGas).times(1.1).times(gasPrice);
        fees[feePrice] = unitToCurrency(nativeAsset, fee);
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
