import { HttpClient } from '@chainify/client';
import { EvmTypes } from '@chainify/evm';
import { Transaction, TransactionRequest, TxStatus } from '@chainify/types';
import LiFi, { ChainId, GasCost, LifiStep, Orders, Step } from '@lifi/sdk';
import { chains, currencyToUnit, unitToCurrency } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
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
  SwapRequest,
  SwapStatus,
} from '../types';

export interface LifiSwapProviderConfig extends EvmSwapProviderConfig {
  rpcURL: string;
}

export interface LifiSwapHistoryItem extends EvmSwapHistoryItem {
  fromFundHash: string;
  fromFundTx: Transaction<EvmTypes.EthersTransactionResponse>;
}

class LifiSwapProvider extends EvmSwapProvider {
  readonly config: LifiSwapProviderConfig;
  readonly _lifiClient: LiFi;
  private _httpClient: HttpClient;
  readonly nativeAssetAddress: string = '0x0000000000000000000000000000000000000000';

  constructor(config: LifiSwapProviderConfig) {
    super(config);
    this._lifiClient = new LiFi();
    this._httpClient = new HttpClient({ baseURL: this.config.rpcURL });
  }

  async getSupportedPairs() {
    return [];
  }

  // returns rates between tokens
  async getQuote({ network, from, to, amount, fromAccountId, toAccountId, walletId }: QuoteRequest) {
    const fromInfo = cryptoassets[from];
    const toInfo = cryptoassets[to];

    const fromAmountInUnit = currencyToUnit(fromInfo, new BN(amount)).toFixed();

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
      ...this.getDefaultRouteOptions(),
    };

    try {
      const bestRoute = await this._lifiClient.getQuote(quoteRequest);
      return { from, to, fromAmount: fromAmountInUnit, toAmount: bestRoute.estimate.toAmount, bestRoute: bestRoute };
    } catch (e) {
      console.warn(e);
      return null;
    }
  }

  async newSwap(swap: SwapRequest<LifiSwapHistoryItem>) {
    const approvalAddress = swap.quote.bestRoute?.estimate.approvalAddress;
    const approveTx = await this.approve(swap, false, approvalAddress);
    const updates = approveTx || (await this.initiateSwap(swap));

    return { id: uuidv4(), ...updates };
  }

  private async initiateSwap({ network, walletId, quote }: SwapRequest<LifiSwapHistoryItem>) {
    const client = super.getClient(network, walletId, quote.from, quote.fromAccountId);
    const txData: TransactionRequest = quote.bestRoute?.transactionRequest as TransactionRequest;
    const fromFundTx = await client.wallet.sendTransaction(txData);

    return {
      status: 'WAITING_FOR_INITIATION_CONFIRMATIONS',
      fromFundTx,
      fromFundHash: fromFundTx.hash,
    };
  }

  //  ======== FEES ========
  // TODO: in case of bridging? and add fee of approval
  async estimateFees(feeRequest: EstimateFeeRequest<string, LifiSwapHistoryItem>) {
    if (feeRequest.txType in this._txTypes()) {
      const fees: EstimateFeeResponse = {};
      const gasCost = (feeRequest.quote.bestRoute?.estimate.gasCosts as GasCost[])[0];

      const approvalData = await this.buildApprovalTx(
        feeRequest,
        false,
        feeRequest.quote.bestRoute?.estimate.approvalAddress
      );

      let approvalGas = 0;
      if (approvalData) {
        const client = this.getClient(
          feeRequest.network,
          feeRequest.walletId,
          feeRequest.quote.from,
          feeRequest.quote.fromAccountId
        );
        approvalGas = (await client.chain.getProvider().estimateGas(approvalData)).toNumber();
      }

      const nativeAsset = chains[cryptoassets[feeRequest.quote.from].chain].nativeAsset;

      // have only one fee and it cannot be changed by user
      for (const feePrice of feeRequest.feePrices) {
        const gasPrice = new BN(feePrice).times(1e9); // ETH fee price is in gwei
        const approvalFee = new BN(approvalGas).times(gasPrice);
        fees[feePrice] = unitToCurrency(cryptoassets[nativeAsset], approvalFee.plus(gasCost.amount));
      }

      return fees;
    }

    return null;
  }

  async getMin(_quoteRequest: QuoteRequest) {
    return new BN(0);
  }

  // ======== HELPERS ========

  private getDefaultRouteOptions() {
    return {
      slippage: 5 / 100, // 5%
      order: Orders[0], // 'RECOMMENDED'
    };
  }

  // cross chain swaps info can be aquire only via Li.Fi API
  private async getCrossChainSwapStatus(quote: LifiSwapHistoryItem) {
    const result = await this._httpClient.nodeGet('/status', {
      bridge: quote.bestRoute?.tool,
      fromChain: this.getChainByID(quote.bestRoute?.action.fromChainId as number),
      toChain: this.getChainByID(quote.bestRoute?.action.toChainId as number),
      txHash: quote.fromFundHash,
    });

    return result;
  }

  private getChainByID(id: number) {
    const indexOfFromChainId = Object.values(ChainId).indexOf(id as unknown as ChainId);
    return Object.keys(ChainId)[indexOfFromChainId];
  }

  // lifi type of swaps are simillar to boost (combination of multiple single and/or cross chain swaps)
  // check if some of lifi actions contain cross chain swap
  private isCrossSwap(swap: LifiSwapHistoryItem) {
    switch (swap.bestRoute?.type) {
      case 'swap':
        return false;
      case 'cross':
        return true;
      case 'lifi':
        return (swap.bestRoute as LifiStep).includedSteps.reduce(
          (acc: boolean, action: Step) => action.type === 'cross' || acc,
          false
        );
    }
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
      console.warn(e);
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
