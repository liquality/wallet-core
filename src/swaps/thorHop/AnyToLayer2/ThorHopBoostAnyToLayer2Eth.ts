import { Chain } from '@hop-protocol/sdk';
import { assets, ChainId, chains, unitToCurrency } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import { getSwapProvider } from '../../../factory';
import { ActionContext } from '../../../store';
import { Network, SwapHistoryItem, SwapProviderType, WalletId } from '../../../store/types';
import { HopSwapHistoryItem, HopSwapProvider } from '../../hop/HopSwapProvider';
import {
  LiqualitySwapHistoryItem,
} from '../../liquality/LiqualitySwapProvider';
import { SwapProvider } from '../../SwapProvider';
import { ThorchainSwapHistoryItem, ThorchainSwapProvider, ThorchainSwapProviderConfig, ThorchainSwapQuote } from '../../thorchain/ThorchainSwapProvider';
import {
  BaseSwapProviderConfig,
  EstimateFeeRequest,
  EstimateFeeResponse,
  NextSwapActionRequest,
  QuoteRequest,
  SwapQuote,
  SwapRequest,
  SwapStatus
} from '../../types';
import { BoostHistoryItem, BoostNextSwapActionRequest } from '../types';
import { BoostStage } from '../types';
import { update } from 'lodash';
import { withInterval } from '../../../store/actions/performNextAction/utils';
import { isERC20, isEthereumNativeAsset } from '../../../utils/asset';
import cryptoassets from '../../../utils/cryptoassets';

const slippagePercentage = 3;

class ThorHopBoostAnyToLayer2EVM extends SwapProvider {

  config: BaseSwapProviderConfig;
  private thorchainSwapProvider: ThorchainSwapProvider;
  private hopSwapProvider: HopSwapProvider;


  constructor(config: BaseSwapProviderConfig) {
    super(config);

    this.thorchainSwapProvider = getSwapProvider(Network.Mainnet, SwapProviderType.Thorchain) as ThorchainSwapProvider;
    this.hopSwapProvider = getSwapProvider(Network.Testnet, SwapProviderType.Hop) as HopSwapProvider;

  }
  

  async getQuote({ network, from, to, amount }: QuoteRequest) {
    // Validate input
    const bridgeAsset = cryptoassets[to].matchingAsset as string;
    if (network === Network.Testnet || amount.lte(0) || (!isEthereumNativeAsset(to) && !isERC20(to)) || !bridgeAsset) return null;

    // Get rate for swap from non-Eth Native or ETH / ERC20 to Mainnet Eth or ERC20
    const quote = (await this.thorchainSwapProvider.getQuote({
      network,
      from,
      to: bridgeAsset,
      amount,
    }));
    if (!quote) return null;

    // Get rate for transfer from ETH / ERC20 mainnet to ETH / ERC20 Layer2
    const toAssetQuantity = unitToCurrency(assets[bridgeAsset], new BN(quote.toAmount));
    const finalQuote = await this.hopSwapProvider.getQuote({
      network,
      from: bridgeAsset,
      to,
      amount: toAssetQuantity,
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
      slippage: quote.slippage, // Note this for tes, how slippage should be handled
    };
  }

  //Commence first leg of boost
  async newSwap({ network, walletId, quote: _quote }: SwapRequest<BoostHistoryItem>) {
    const result = await this.thorchainSwapProvider.newSwap({
      network,
      walletId,
      quote: this.swapThorchainFormat(_quote),
    });

    _quote.currentSwapLeg = BoostStage.FirstLeg

    return {
      ...result,
      ..._quote, // Note: investigate this further upon testing, how the quoye overode the result
      // slippage: slippagePercentage * 100, // Note this for tes, how slippage should be handled
    };
  }

  // Call next swap action on swapHistoryitem based on status
  async performNextSwapAction(store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<BoostHistoryItem>): Promise<Partial<BoostHistoryItem> | undefined> {
    let updates: Partial<BoostHistoryItem> | undefined;
    
    if (swap.currentSwapLeg === BoostStage.FirstLeg && swap.status === 'WAITING_FOR_RECEIVE') {
      updates = await withInterval(async () =>
        this.finalizeFirstSwapLegAndStartSecondLeg({
          swapThor: this.swapThorchainFormat(swap),
          swapHop: this.swapHopFormat(swap),
          network,
          walletId,
        })
      );
    } else {
      updates = (swap.currentSwapLeg === BoostStage.FirstLeg)?
      (await this.thorchainSwapProvider.performNextSwapAction(store, {
        network,
        walletId,
        swap: this.swapThorchainFormat(swap),
      })) : (await this.hopSwapProvider.performNextSwapAction(store, {
        network,
        walletId,
        swap: this.swapHopFormat(swap),
      }))
    }

    if (!updates) return; // reset this.currentBoostStage to empty upon swap completion

    return {
      ...updates,
      // reset from and to assets and values
      from: swap.from,
      to: swap.to,
      fromAmount: swap.fromAmount,
      // keep `toAmount` (from updates object) only in case swap transitioned from FirstLeg to SecondLeg
      toAmount: (updates.currentSwapLeg === BoostStage.FirstLeg)? swap.toAmount : updates.toAmount
    };

  }

  async finalizeFirstSwapLegAndStartSecondLeg({
    swapThor,
    swapHop,
    network,
    walletId,
  }: BoostNextSwapActionRequest) : Promise<Partial<BoostHistoryItem> | undefined>  {

    const _network = network as Network;
    const _walletId = walletId as WalletId;

    const resultThor = await this.thorchainSwapProvider.waitForReceive({
      swap: swapThor as ThorchainSwapHistoryItem,
      network: _network,
      walletId: _walletId,
    });

    if (resultThor?.status === 'SUCCESS') {
      const resultHop = await this.hopSwapProvider.newSwap({
        network: _network,
        walletId: _walletId,
        quote: swapHop as HopSwapHistoryItem,
      });

      return {
        ...resultThor,
        ...resultHop,
        toAmount: resultHop.toAmount,
        status: resultHop.status,
        currentSwapLeg: BoostStage.SecondLeg
      };
    }

  }




  // On FROM_CHAIN calculate fees from AMM swap and `swap initiation` on LSP
  // On TO_CHAIN calculate fees from `swap claim` in LSP
  async estimateFees({
    network,
    walletId,
    asset,
    txType,
    quote,
    feePrices,
    max,
  }: EstimateFeeRequest<string, BoostHistoryItem>) {
    const input = { network, walletId, asset, txType, quote, feePrices, max };

    if (txType === this.fromTxType) {
      // swap initiation fee
      const liqualityFees = await this.thorchainSwapProvider.estimateFees({
        ...input,
        asset: quote.bridgeAsset,
        txType: this.thorchainSwapProvider.fromTxType as LiqualityTxTypes,
        quote: this.swapLiqualityFormat(quote),
      });

      // amm fee
      const automatedMarketMakerFees = await this.bridgeAssetToAutomatedMarketMaker[quote.bridgeAsset].estimateFees({
        ...input,
        // all AMMs have the same fromTxType
        txType: this.hopSwapProvider.fromTxType as string,
        quote: this.swapThorchainFormat(quote),
      });

      const combinedFees: EstimateFeeResponse = {};
      for (const key in automatedMarketMakerFees) {
        combinedFees[Number(key)] = new BN(automatedMarketMakerFees[Number(key)]).plus(liqualityFees[Number(key)]);
      }

      return combinedFees;
    } else if (txType === this.toTxType) {
      // swap claim fee
      const liqualityFees = await this.thorchainSwapProvider.estimateFees({
        ...input,
        txType: this.thorchainSwapProvider.toTxType as LiqualityTxTypes,
        quote: this.swapLiqualityFormat(quote),
      });

      return liqualityFees;
    } else {
      // unknown tx type
      return null;
    }
  }

  async getMin(quoteRequest: QuoteRequest) {
    try {
      const amountInNative = await this.thorchainSwapProvider.getMin({
        ...quoteRequest,
        from: getNativeAsset(quoteRequest.from),
      });
      const quote = (await this.bridgeAssetToAutomatedMarketMaker[getNativeAsset(quoteRequest.from)].getQuote({
        network: quoteRequest.network,
        from: getNativeAsset(quoteRequest.from),
        to: quoteRequest.from,
        amount: new BN(amountInNative),
      })) as ThorHopBoostSwapQuote;
      const fromMinAmount = unitToCurrency(assets[quoteRequest.from], new BN(quote.toAmount));
      // increase minimum amount with 5% to minimize calculation
      // error and price fluctuation
      return new BN(fromMinAmount).times(1.05);
    } catch (err) {
      console.warn(err);
      return new BN(0);
    }
  }

  async getSupportedPairs() {
    return [];
  }

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

  private swapThorchainFormat(swap: any) {
    return {
      ...swap,
      to: swap.bridgeAsset,
      toAmount: swap.bridgeAssetAmount,
      toAccountId: swap.fromAccountId, // AMM swaps happen on same account
      slippagePercentage,
    };
  }

  private swapHopFormat(swap: any) {
    return {
      ...swap,
      to: swap.bridgeAsset,
      toAmount: swap.bridgeAssetAmount,
      toAccountId: swap.fromAccountId, // AMM swaps happen on same account
      slippagePercentage,
    };
  }
}

export { ThorHopBoostAnyToLayer2EVM };
