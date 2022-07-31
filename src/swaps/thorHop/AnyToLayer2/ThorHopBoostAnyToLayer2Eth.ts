import { Chain } from '@hop-protocol/sdk';
import { assets, ChainId, chains, unitToCurrency } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import { getSwapProvider } from '../../../factory';
import { ActionContext } from '../../../store';
import { Network, SwapHistoryItem, SwapProviderType } from '../../../store/types';
import { HopSwapProvider } from '../../hop/HopSwapProvider';
import {
  LiqualitySwapHistoryItem,
} from '../../liquality/LiqualitySwapProvider';
import { SwapProvider } from '../../SwapProvider';
import { ThorchainSwapProvider, ThorchainSwapProviderConfig, ThorchainSwapQuote } from '../../thorchain/ThorchainSwapProvider';
import {
  BaseSwapProviderConfig,
  EstimateFeeRequest,
  EstimateFeeResponse,
  NextSwapActionRequest,
  QuoteRequest,
  SwapQuote,
  SwapRequest,
  SwapStatus,
} from '../../types';
import { BoostHistoryItem } from '../../liqualityboost/types';

export interface ThorHopSwapProviderConfig extends ThorchainSwapProviderConfig {
  graphqlBaseURL: string;
}

export interface ThorHopBoostSwapQuote extends ThorchainSwapQuote {
  from: string;
  to: string;
  fromAmount: string;
  toAmount: string;
  hopAsset: string;
  hopChainFrom: Chain;
  hopChainTo: Chain;
  thorchainReceiveFee: string;
  hopReceiveFee: string;
  maxFeeSlippageMultiplier: number
}

const slippagePercentage = 3;

class ThorHopBoostAnyToLayer2Eth extends SwapProvider {
  //TODO(Koderholic): Remove the following 3 functions. They are added as placeholders.  Uncommenttheactual onens
  public getMin(quoteRequest: QuoteRequest): Promise<BN> {
    throw new Error('Method not implemented.');
  }
  public estimateFees(estimateFeeRequest: EstimateFeeRequest<string, SwapQuote>): Promise<EstimateFeeResponse | null> {
    throw new Error('Method not implemented.');
  }
  public performNextSwapAction(store: ActionContext, nextSwapAction: NextSwapActionRequest<SwapHistoryItem>): Promise<Partial<SwapHistoryItem> | undefined> {
    throw new Error('Method not implemented.');
  }
  private thorchainSwapProvider: ThorchainSwapProvider;
  private hopSwapProvider: HopSwapProvider;

  // private lspEndStates = ['REFUNDED', 'SUCCESS', 'QUOTE_EXPIRED'];

  config: BaseSwapProviderConfig;

  constructor(config: BaseSwapProviderConfig) {
    super(config);

    this.thorchainSwapProvider = getSwapProvider(Network.Mainnet, SwapProviderType.Thorchain) as ThorchainSwapProvider;
    this.hopSwapProvider = getSwapProvider(Network.Testnet, SwapProviderType.Hop) as HopSwapProvider;

  }

  async getSupportedPairs() {
    return [];
  }

  async getQuote({ network, from, to, amount }: QuoteRequest) {
    // Validate input
    if (network === Network.Testnet || amount.lte(0)) return null;

    const bridgeAsset = chains[ChainId.Ethereum].nativeAsset;

    // Get rate between non-Eth Native and Mainnet Eth
    const quote = (await this.thorchainSwapProvider.getQuote({
      network,
      from,
      to: bridgeAsset,
      amount,
    }));
    if (!quote) return null;

    // get rate between mainnet ETH and 'to' asset (which is Layer 2 Eth)
    const bridgeAssetQuantity = unitToCurrency(assets[bridgeAsset], new BN(quote.toAmount));
    const finalQuote = await this.hopSwapProvider.getQuote({
      network,
      from: bridgeAsset,
      to,
      amount: bridgeAssetQuantity,
    });
    if (!finalQuote) return null;

    return {
      from,
      to,
      fromAmount: quote.fromAmount,
      toAmount: finalQuote.toAmount,
      bridgeAsset,
      bridgeAssetAmount: quote.toAmount,
      hopChainFrom: finalQuote.hopChainFrom,
      hopChainTo: finalQuote.hopChainTo,
      hopReceiveFee: finalQuote.receiveFee,
      thorchainReceiveFee: quote.receiveFee,
      slippage: quote.slippage,
    };
  }

  async newSwap({ network, walletId, quote: _quote }: SwapRequest<BoostHistoryItem>) {
    // ERC20 -> Bridge asset
    const result = await this.thorchainSwapProvider.newSwap({
      network,
      walletId,
      quote: this.swapThorchainFormat(_quote),
    });

    return {
      ...result,
      ..._quote,
      slippage: slippagePercentage * 100,
    };
  }

  // On FROM_CHAIN calculate fees from AMM swap and `swap initiation` on LSP
  // On TO_CHAIN calculate fees from `swap claim` in LSP
  // async estimateFees({
  //   network,
  //   walletId,
  //   asset,
  //   txType,
  //   quote,
  //   feePrices,
  //   max,
  // }: EstimateFeeRequest<string, BoostHistoryItem>) {
  //   const input = { network, walletId, asset, txType, quote, feePrices, max };

  //   if (txType === this.fromTxType) {
  //     // swap initiation fee
  //     const liqualityFees = await this.thorchainSwapProvider.estimateFees({
  //       ...input,
  //       asset: quote.bridgeAsset,
  //       txType: this.thorchainSwapProvider.fromTxType as LiqualityTxTypes,
  //       quote: this.swapLiqualityFormat(quote),
  //     });

  //     // amm fee
  //     const automatedMarketMakerFees = await this.bridgeAssetToAutomatedMarketMaker[quote.bridgeAsset].estimateFees({
  //       ...input,
  //       // all AMMs have the same fromTxType
  //       txType: this.hopSwapProvider.fromTxType as string,
  //       quote: this.swapThorchainFormat(quote),
  //     });

  //     const combinedFees: EstimateFeeResponse = {};
  //     for (const key in automatedMarketMakerFees) {
  //       combinedFees[Number(key)] = new BN(automatedMarketMakerFees[Number(key)]).plus(liqualityFees[Number(key)]);
  //     }

  //     return combinedFees;
  //   } else if (txType === this.toTxType) {
  //     // swap claim fee
  //     const liqualityFees = await this.thorchainSwapProvider.estimateFees({
  //       ...input,
  //       txType: this.thorchainSwapProvider.toTxType as LiqualityTxTypes,
  //       quote: this.swapLiqualityFormat(quote),
  //     });

  //     return liqualityFees;
  //   } else {
  //     // unknown tx type
  //     return null;
  //   }
  // }

  // async getMin(quoteRequest: QuoteRequest) {
  //   try {
  //     const amountInNative = await this.thorchainSwapProvider.getMin({
  //       ...quoteRequest,
  //       from: getNativeAsset(quoteRequest.from),
  //     });
  //     const quote = (await this.bridgeAssetToAutomatedMarketMaker[getNativeAsset(quoteRequest.from)].getQuote({
  //       network: quoteRequest.network,
  //       from: getNativeAsset(quoteRequest.from),
  //       to: quoteRequest.from,
  //       amount: new BN(amountInNative),
  //     })) as ThorHopBoostSwapQuote;
  //     const fromMinAmount = unitToCurrency(assets[quoteRequest.from], new BN(quote.toAmount));
  //     // increase minimum amount with 5% to minimize calculation
  //     // error and price fluctuation
  //     return new BN(fromMinAmount).times(1.05);
  //   } catch (err) {
  //     console.warn(err);
  //     return new BN(0);
  //   }
  // }

  // async finalizeAutomatedMarketMakerAndStartLiqualitySwap({
  //   swapLSP,
  //   swapAMM,
  //   network,
  //   walletId,
  // }: BoostNextSwapActionRequest) {
  //   const _network = network as Network;
  //   const _walletId = walletId as WalletId;

  //   const resultAMM = await this.bridgeAssetToAutomatedMarketMaker[
  //     swapAMM?.bridgeAsset as Asset
  //   ].waitForSwapConfirmations({
  //     swap: swapAMM as SwapHistoryItem,
  //     network: _network,
  //     walletId: _walletId,
  //   });

  //   if (resultAMM?.status === 'SUCCESS') {
  //     const resultLSP = await this.thorchainSwapProvider.newSwap({
  //       network: _network,
  //       walletId: _walletId,
  //       quote: swapLSP,
  //     });

  //     return {
  //       ...resultLSP,
  //       ...swapLSP,
  //       toAmount: resultLSP.toAmount,
  //       status: resultLSP.status,
  //     };
  //   }
  // }

  // async performNextSwapAction(
  //   store: ActionContext,
  //   { network, walletId, swap }: NextSwapActionRequest<BoostHistoryItem>
  // ) {
  //   let updates: Partial<SwapHistoryItem> | undefined;

  //   if (swap.status === 'WAITING_FOR_SWAP_CONFIRMATIONS') {
  //     updates = await withInterval(async () =>
  //       this.finalizeAutomatedMarketMakerAndStartLiqualitySwap({
  //         swapLSP: this.swapLiqualityFormat(swap),
  //         swapAMM: this.swapThorchainFormat(swap),
  //         network,
  //         walletId,
  //       })
  //     );
  //   } else {
  //     updates = await this.thorchainSwapProvider.performNextSwapAction(store, {
  //       network,
  //       walletId,
  //       swap: this.swapLiqualityFormat(swap),
  //     });
  //   }

  //   if (!updates && !this.lspEndStates.includes(swap.status)) {
  //     updates = await this.bridgeAssetToAutomatedMarketMaker[swap.bridgeAsset].performNextSwapAction(store, {
  //       network,
  //       walletId,
  //       swap: this.swapThorchainFormat(swap),
  //     });
  //   }

  //   if (!updates) return;

  //   return {
  //     ...updates,
  //     // reset from and to assets and values
  //     from: swap.from,
  //     fromAmount: swap.fromAmount,
  //     to: swap.to,
  //     // keep `toAmount` (from updates object) only in case swap transitioned from AMM to LSP
  //     toAmount: updates.status === 'INITIATED' ? updates.toAmount : swap.toAmount,
  //   };
  // }

  protected _getStatuses(): Record<string, SwapStatus> {
    return {
      ...this.hopSwapProvider.statuses,
      ...this.thorchainSwapProvider.statuses,

      // Thorchain states
      APPROVE_CONFIRMED: {
        ...this.thorchainSwapProvider.statuses.APPROVE_CONFIRMED,
        label: 'Swapping {from} for {bridgeAsset}',
      },
      WAITING_FOR_SEND_CONFIRMATIONS: {
        ...this.thorchainSwapProvider.statuses.WAITING_FOR_SEND_CONFIRMATIONS,
        label: 'Swapping {from} for {bridgeAsset}',
      },
      WAITING_FOR_RECEIVE: {
        ...this.thorchainSwapProvider.statuses.WAITING_FOR_RECEIVE,
        label: 'Swapping {from} for {bridgeAsset}',
      },
      WAITING_FOR_APPROVE_CONFIRMATIONS_HOP:{
        ...this.hopSwapProvider.statuses.WAITING_FOR_APPROVE_CONFIRMATIONS,
        step: 2,
      },
      APPROVE_CONFIRMED_HOP:{
        ...this.hopSwapProvider.statuses.APPROVE_CONFIRMED,
        label: 'Swapping {bridgeAsset}',
        step: 3,
      },
      WAITING_FOR_SEND_SWAP_CONFIRMATIONS: {
        ...this.hopSwapProvider.statuses.WAITING_FOR_SEND_SWAP_CONFIRMATIONS,
        label: 'Swapping {bridgeAsset}',
        step: 3,
      },
      WAITING_FOR_RECEIVE_SWAP_CONFIRMATIONS: {
        ...this.hopSwapProvider.statuses.WAITING_FOR_RECEIVE_SWAP_CONFIRMATIONS,
        label: 'Swapping {bridgeAsset} for {to}',
        step: 4,
      },
      // final states
      REFUNDED: {
        ...this.thorchainSwapProvider.statuses.REFUNDED,
        step: 5,
      },
      SUCCESS: {
        ...this.hopSwapProvider.statuses.SUCCESS,
        step: 5,
      },
      FAILED: {
        ...this.hopSwapProvider.statuses.FAILED,
        step: 5,
      },
    };
  }

  protected _txTypes(): Record<string, string | null> {
    return {
      FROM_CHAIN: 'FROM_CHAIN',
      TO_CHAIN: 'TO_CHAIN',
    };
  }

  protected _fromTxType(): string | null {
    return this._txTypes().FROM_CHAIN;
  }

  protected _toTxType(): string | null {
    return this._txTypes().TO_CHAIN;
  }

  protected _timelineDiagramSteps(): string[] {
    // remove approval step because bridge asset is always native and doesn't need approval
    const lspTimeline = this.thorchainSwapProvider.timelineDiagramSteps;
    if (lspTimeline[0] === 'APPROVE') {
      lspTimeline.shift();
    }

    return this.hopSwapProvider.timelineDiagramSteps.concat(lspTimeline);
  }

  protected _totalSteps(): number {
    let lspSteps = this.thorchainSwapProvider.totalSteps;
    if (this.thorchainSwapProvider.timelineDiagramSteps[0] === 'APPROVE') {
      lspSteps -= 1;
    }

    return this.hopSwapProvider.totalSteps + lspSteps;
  }

  private swapLiqualityFormat(swap: any): LiqualitySwapHistoryItem {
    return {
      ...swap,
      from: swap.bridgeAsset,
      fromAmount: swap.bridgeAssetAmount,
      slippagePercentage,
    };
  }

  private swapThorchainFormat(swap: any) {
    return {
      ...swap,
      to: swap.bridgeAsset,
      toAmount: swap.bridgeAssetAmount,
      toAccountId: swap.fromAccountId, // AMM swaps happen on same account
      slippagePercentage,
    };
  }
}

export { ThorHopBoostAnyToLayer2Eth as LiqualityBoostERC20toNative };
