import { assets, unitToCurrency } from '@liquality/cryptoassets';
import BN, { BigNumber } from 'bignumber.js';
import { getSwapProvider } from '../../../factory';
import store, { ActionContext } from '../../../store';
import { Network, SwapProviderType, WalletId } from '../../../store/types';
import { HopSwapHistoryItem, HopSwapProvider, HopTxTypes } from '../../hop/HopSwapProvider';
import { SwapProvider } from '../../SwapProvider';
import { ThorchainSwapHistoryItem, ThorchainSwapProvider, ThorchainSwapQuote, ThorchainTxTypes } from '../../thorchain/ThorchainSwapProvider';
import {
  BaseSwapProviderConfig,
  EstimateFeeRequest,
  NextSwapActionRequest,
  QuoteRequest,
  SwapRequest,
  SwapStatus
} from '../../types';
import { BoostHistoryItem, BoostNextSwapActionRequest } from '../types';
import { BoostStage } from '../types';
import { withInterval } from '../../../store/actions/performNextAction/utils';
import { isERC20, isEthereumNativeAsset } from '../../../utils/asset';
import cryptoassets from '../../../utils/cryptoassets';

const slippagePercentage = 3;

class ThorHopBoostAnyToLayer2 extends SwapProvider {

  config: BaseSwapProviderConfig;
  private thorchainSwapProvider: ThorchainSwapProvider;
  private hopSwapProvider: HopSwapProvider;


  constructor(config: BaseSwapProviderConfig) {
    super(config);

    this.thorchainSwapProvider = getSwapProvider(Network.Mainnet, SwapProviderType.Thorchain) as ThorchainSwapProvider;
    this.hopSwapProvider = getSwapProvider(Network.Mainnet, SwapProviderType.Hop) as HopSwapProvider;

  }
  

  async getQuote({ network, from, to, amount }: QuoteRequest) {

    console.log('Came here');
    // Validate input
    let bridgeAsset = cryptoassets[to].matchingAsset as string;

    // Hop won't hop WETH but it will hop ETH. line below useful if to is PWETH which matches WETH.
    bridgeAsset = bridgeAsset === 'WETH' ? 'ETH' : bridgeAsset;

    if (network === Network.Testnet || amount.lte(0) || (!isEthereumNativeAsset(to) && !isERC20(to)) || !bridgeAsset || from === bridgeAsset) return null;

    const bridgeChainId = cryptoassets[bridgeAsset].chain;

    // Get accountId based on bridgeAsset
    const bridgeAccountId = store.getters.accountsWithBalance.find((account) => account.chain === bridgeChainId)?.id;

    console.log('passed validation');

    // Get rate for swap from non-Eth Native or ETH / ERC20 to Mainnet Eth or ERC20
    const quote = (await this.thorchainSwapProvider.getQuote({
      network,
      from,
      to: bridgeAsset,
      amount,
    }));
    if (!quote) return null;
    console.log('from  ==>', from);
    console.log('bridgeAsset ==>  ',bridgeAsset);

    console.log('scaled through first leg');

    // Get rate for transfer from ETH / ERC20 mainnet to ETH / ERC20 Layer2
    console.log('ToAmount ==> ', quote.toAmount);

    // Default behaviour or toFixed without an argument happens with BN if 0 is the argument
    // toFixed was already called in thorchain on toAmount but it was in vain
    const bridgeAssetQtyInUnits = (new BN(quote.toAmount)).toFixed(0); 
    const bridgeAssetQuantity = unitToCurrency(assets[bridgeAsset], new BN(bridgeAssetQtyInUnits));
    console.log('toAssetQuantity ==> ', bridgeAssetQuantity);
    const finalQuote = await this.hopSwapProvider.getQuote({
      network,
      from: bridgeAsset,
      to,
      amount: bridgeAssetQuantity,
    });
    if (!finalQuote) return null;

    console.log('scaled through  seconnd leg');
    console.log('finalquote==> ', finalQuote);

    return {
      from,
      to,
      fromAmount: quote.fromAmount,
      toAmount: finalQuote.toAmount,
      bridgeAsset,
      bridgeAccountId,
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
      quote: this.swapThorchainFormat(_quote) as  ThorchainSwapHistoryItem,
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
          swapThor: this.swapThorchainFormat(swap) as ThorchainSwapHistoryItem,
          swapHop: this.swapHopFormat(swap) as HopSwapHistoryItem,
          network,
          walletId,
        })
      );
    } else {
      updates = (swap.currentSwapLeg === BoostStage.FirstLeg)?
      (await this.thorchainSwapProvider.performNextSwapAction(store, {
        network,
        walletId,
        swap: this.swapThorchainFormat(swap) as ThorchainSwapHistoryItem,
      })) : (await this.hopSwapProvider.performNextSwapAction(store, {
        network,
        walletId,
        swap: this.swapHopFormat(swap) as HopSwapHistoryItem,
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
      const resultHop: any = await this.hopSwapProvider.newSwap({
        network: _network,
        walletId: _walletId,
        quote: swapHop as HopSwapHistoryItem,
      });

      const approveTxOnHop = resultHop.approveTx;
      delete resultHop.approveTx;

      return {
        ...resultThor,
        ...resultHop,
        approveTxOnHop,
        toAmount: (resultHop as HopSwapHistoryItem).toAmount,
        status: resultHop.status,
        currentSwapLeg: BoostStage.SecondLeg
      };
    }

  }


  // On FROM_CHAIN calculate fees based on Thorchain swap
  // On BRIDGE_CHAIN calculate fees based on Hop swap
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
      console.log("First Leg FeeEstimate  => ", input);
      // Thorchain fee
      const thorchainFees = await this.thorchainSwapProvider.estimateFees({
        ...input,
        txType: this.thorchainSwapProvider.fromTxType as ThorchainTxTypes,
        quote: this.swapThorchainFormat(quote) as ThorchainSwapHistoryItem,
      });

      return thorchainFees;

    } else if (txType === this.toTxType) {


      // Hop fee
      const hopFees = await this.hopSwapProvider.estimateFees({
        ...input,
        txType: this.hopSwapProvider.fromTxType as HopTxTypes,
        quote: this.swapHopFormat(quote) as HopSwapHistoryItem,
      });

      return hopFees;
    } else {
      // unknown tx type
      return null;
    }
  }

  // Walk backward from toAsset -> BridgeAsset -> fromAsset to determine the minimum amount of fromAsset needed
  async getMin(quoteRequest: QuoteRequest) {
    try {
      const bridgeAsset = cryptoassets[quoteRequest.to].matchingAsset as string;
      const fromAsset = quoteRequest.from;

      const minBridgeAssetAmount = await this.hopSwapProvider.getMin({
        ...quoteRequest,
        from: bridgeAsset,
      });

      let minThorSwapAmount = await this.thorchainSwapProvider.getMin({
        ...quoteRequest,
        to: bridgeAsset
      });

      const quote = (await this.thorchainSwapProvider.getQuote({
        network: quoteRequest.network,
        from: bridgeAsset,
        to: fromAsset,
        amount: new BN(minBridgeAssetAmount),
      })) as Partial<ThorchainSwapQuote>;
      let fromMinAmount = unitToCurrency(assets[fromAsset], new BN(quote.toAmount as BigNumber.Value));
      // increase minimum amount with 5% to minimize calculation
      // error and price fluctuation
      fromMinAmount = new BN(fromMinAmount).times(1.05);
      minThorSwapAmount = new BN(minThorSwapAmount);
      return fromMinAmount.gt(minThorSwapAmount) ? fromMinAmount : minThorSwapAmount;
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
      BRIDGE_CHAIN: 'BRIDGE_CHAIN',
    };
  }

  protected _fromTxType(): string | null {
    return this._txTypes().FROM_CHAIN;
  }

  protected _toTxType(): string | null {
    return this._txTypes().BRIDGE_CHAIN;
  }

  protected _timelineDiagramSteps(): string[] {
    return this.thorchainSwapProvider.timelineDiagramSteps.concat(this.hopSwapProvider.timelineDiagramSteps);
  }

  protected _totalSteps(): number {
    return this.hopSwapProvider.totalSteps + this.thorchainSwapProvider.totalSteps;
  }

  private swapThorchainFormat(swap: BoostHistoryItem) {
    return {
      ...swap,
      to: swap.bridgeAsset,
      toAmount: swap.bridgeAssetAmount,
      slippagePercentage,

      //  No bridgeAccountId ==> 1st leg and 2nd leg are initiated on same chain so use decided to use same account
      toAccountId: swap.bridgeAccountId ? swap.bridgeAccountId : swap.fromAccountId, 
    };
  }

  private swapHopFormat(swap: BoostHistoryItem) {
    return {
      ...swap,
      from: swap.bridgeAsset,
      fromAmount: swap.bridgeAssetAmount,
      approveTx: swap.approveTxOnHop,
      slippagePercentage,
      fromAccountId: swap.bridgeAccountId ? swap.bridgeAccountId : swap.fromAccountId
    };
  }
}

export { ThorHopBoostAnyToLayer2 };
