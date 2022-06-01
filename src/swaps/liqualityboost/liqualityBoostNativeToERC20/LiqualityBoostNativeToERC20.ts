import { assets, unitToCurrency } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import { getSwapProvider } from '../../../factory/swapProvider';
import { ActionContext } from '../../../store';
import { withInterval } from '../../../store/actions/performNextAction/utils';
import { Asset, Network, SwapHistoryItem, WalletId } from '../../../store/types';
import { getNativeAsset, isERC20 } from '../../../utils/asset';
import { prettyBalance } from '../../../utils/coinFormatter';
import { AstroportSwapProvider } from '../../astroport/AstroportSwapProvider';
import {
  LiqualitySwapHistoryItem,
  LiqualitySwapProvider,
  LiqualityTxTypes,
} from '../../liquality/LiqualitySwapProvider';
import { OneinchSwapProvider } from '../../oneinch/OneinchSwapProvider';
import { SovrynSwapProvider } from '../../sovryn/SovrynSwapProvider';
import { SwapProvider } from '../../SwapProvider';
import {
  EstimateFeeRequest,
  EstimateFeeResponse,
  LiqualityBoostSwapProviderConfig,
  NextSwapActionRequest,
  QuoteRequest,
  SwapQuote,
  SwapRequest,
  SwapStatus,
} from '../../types';
import { BoostHistoryItem, BoostNextSwapActionRequest } from '../types';

export interface BoostNativeToERC20SwapQuote extends SwapQuote {
  fromTokenAddress: string;
}

const slippagePercentage = 3;
class LiqualityBoostNativeToERC20 extends SwapProvider {
  private liqualitySwapProvider: LiqualitySwapProvider;
  private sovrynSwapProvider: SovrynSwapProvider;
  private oneinchSwapProvider: OneinchSwapProvider;
  private astroportSwapProvider: AstroportSwapProvider;

  config: LiqualityBoostSwapProviderConfig;
  bridgeAssetToAutomatedMarketMaker: { [key: string]: SwapProvider };
  supportedBridgeAssets: Asset[];

  constructor(config: LiqualityBoostSwapProviderConfig) {
    super(config);

    this.liqualitySwapProvider = getSwapProvider(this.config.network, 'liquality') as LiqualitySwapProvider;
    this.sovrynSwapProvider = getSwapProvider(this.config.network, 'sovryn') as SovrynSwapProvider;
    this.supportedBridgeAssets = this.config.supportedBridgeAssets;

    if (this.config.network === 'mainnet') {
      this.oneinchSwapProvider = getSwapProvider(this.config.network, 'oneinchV4') as OneinchSwapProvider;
      this.astroportSwapProvider = getSwapProvider(this.config.network, 'astroport') as AstroportSwapProvider;
      this.bridgeAssetToAutomatedMarketMaker = {
        MATIC: this.oneinchSwapProvider,
        ETH: this.oneinchSwapProvider,
        BNB: this.oneinchSwapProvider,
        RBTC: this.sovrynSwapProvider,
        AVAX: this.oneinchSwapProvider,
        UST: this.astroportSwapProvider,
        LUNA: this.astroportSwapProvider,
      };
    } else if (this.config.network === 'testnet') {
      this.bridgeAssetToAutomatedMarketMaker = {
        RBTC: this.sovrynSwapProvider,
      };
    }
  }

  async getSupportedPairs() {
    return [];
  }

  async getQuote({ network, from, to, amount }: QuoteRequest) {
    if (isERC20(from) || !isERC20(to) || amount.lte(0)) {
      return null;
    }

    const bridgeAsset = getNativeAsset(to);

    if (!this.supportedBridgeAssets.includes(bridgeAsset)) {
      return null;
    }

    const quote = await this.liqualitySwapProvider.getQuote({
      network,
      from,
      to: bridgeAsset,
      amount,
    });

    if (!quote) {
      return null;
    }

    const bridgeAssetQuantity = unitToCurrency(assets[bridgeAsset], new BN(quote.toAmount));

    const finalQuote = (await this.bridgeAssetToAutomatedMarketMaker[bridgeAsset].getQuote({
      network,
      from: bridgeAsset,
      to,
      amount: bridgeAssetQuantity,
    })) as BoostNativeToERC20SwapQuote;

    if (!finalQuote) {
      return null;
    }

    return {
      from,
      to,
      fromAmount: quote.fromAmount,
      toAmount: finalQuote.toAmount,
      min: quote.min,
      max: quote.max,
      bridgeAsset,
      bridgeAssetAmount: quote.toAmount,
      path: finalQuote.path,
      fromTokenAddress: finalQuote.fromTokenAddress, // for Terra ERC20
    };
  }

  async newSwap({ network, walletId, quote: _quote }: SwapRequest<BoostHistoryItem>) {
    const result = await this.liqualitySwapProvider.newSwap({
      network,
      walletId,
      quote: this.swapLiqualityFormat(_quote),
    });

    return {
      ...result,
      ..._quote,
      slippage: slippagePercentage * 100,
      bridgeAssetAmount: result.toAmount,
    };
  }

  async updateOrder(order: BoostHistoryItem) {
    return await this.liqualitySwapProvider.updateOrder(order);
  }

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
      const liqualityFees = await this.liqualitySwapProvider.estimateFees({
        ...input,
        txType: this.liqualitySwapProvider.fromTxType as LiqualityTxTypes,
        quote: this.swapLiqualityFormat(quote),
      });

      return liqualityFees;
    } else if (txType === this.toTxType) {
      // swap claim fee
      const liqualityFees = await this.liqualitySwapProvider.estimateFees({
        ...input,
        asset: quote.bridgeAsset,
        txType: this.liqualitySwapProvider.toTxType as LiqualityTxTypes,
        quote: this.swapLiqualityFormat(quote),
      });

      // amm fee
      const automatedMarketMakerFees = await this.bridgeAssetToAutomatedMarketMaker[quote.bridgeAsset].estimateFees({
        ...input,
        asset: quote.bridgeAsset,
        // all AMMs have the same fromTxType
        txType: this.sovrynSwapProvider.fromTxType as string,
        quote: this.swapAutomatedMarketMakerFormat(quote),
      });

      const combinedFees: EstimateFeeResponse = {};
      for (const key in automatedMarketMakerFees) {
        combinedFees[Number(key)] = new BN(automatedMarketMakerFees[Number(key)]).plus(liqualityFees[Number(key)]);
      }

      return combinedFees;
    } else {
      // unknown tx type
      return null;
    }
  }

  async finalizeLiqualitySwapAndStartAutomatedMarketMaker({ swapLSP, network, walletId }: BoostNextSwapActionRequest) {
    const result = await this.liqualitySwapProvider.waitForClaimConfirmations({
      swap: swapLSP,
      network: network as Network,
      walletId: walletId as WalletId,
    });
    if (result?.status === 'SUCCESS') {
      return { endTime: Date.now(), status: 'APPROVE_CONFIRMED' };
    }
  }

  async performNextSwapAction(
    store: ActionContext,
    { network, walletId, swap }: NextSwapActionRequest<BoostHistoryItem>
  ) {
    let updates: Partial<SwapHistoryItem> | undefined;

    if (swap.status === 'WAITING_FOR_CLAIM_CONFIRMATIONS') {
      updates = await withInterval(async () =>
        this.finalizeLiqualitySwapAndStartAutomatedMarketMaker({
          swapLSP: this.swapLiqualityFormat(swap),
          network,
          walletId,
        })
      );
    } else {
      updates = await this.liqualitySwapProvider.performNextSwapAction(store, {
        network,
        walletId,
        swap: this.swapLiqualityFormat(swap),
      });
    }

    if (!updates) {
      updates = await this.bridgeAssetToAutomatedMarketMaker[swap.bridgeAsset].performNextSwapAction(store, {
        network,
        walletId,
        swap: this.swapAutomatedMarketMakerFormat(swap),
      });
    }

    return updates;
  }

  protected _getStatuses(): Record<string, SwapStatus> {
    return {
      ...this.liqualitySwapProvider.statuses,
      ...this.oneinchSwapProvider.statuses,
      FUNDED: {
        ...this.liqualitySwapProvider.statuses.FUNDED,
        label: 'Locking {bridgeAsset}',
      },
      CONFIRM_COUNTER_PARTY_INITIATION: {
        ...this.liqualitySwapProvider.statuses.CONFIRM_COUNTER_PARTY_INITIATION,
        label: 'Locking {bridgeAsset}',
        notification(swap: any) {
          return {
            message: `Counterparty sent ${prettyBalance(swap.bridgeAssetAmount, swap.bridgeAsset)} ${
              swap.bridgeAsset
            } to escrow`,
          };
        },
      },
      READY_TO_CLAIM: {
        ...this.liqualitySwapProvider.statuses.READY_TO_CLAIM,
        label: 'Claiming {bridgeAsset}',
      },
      WAITING_FOR_CLAIM_CONFIRMATIONS: {
        ...this.liqualitySwapProvider.statuses.WAITING_FOR_CLAIM_CONFIRMATIONS,
        label: 'Claiming {bridgeAsset}',
      },
      APPROVE_CONFIRMED: {
        ...this.oneinchSwapProvider.statuses.APPROVE_CONFIRMED,
        step: 3,
        label: 'Swapping {bridgeAsset} for {to}',
      },
      WAITING_FOR_SWAP_CONFIRMATIONS: {
        ...this.oneinchSwapProvider.statuses.WAITING_FOR_SWAP_CONFIRMATIONS,
        notification() {
          return {
            message: 'Engaging Automated Market Maker',
          };
        },
        step: 3,
      },
      SUCCESS: {
        ...this.liqualitySwapProvider.statuses.SUCCESS,
        step: 4,
      },
      FAILED: {
        ...this.oneinchSwapProvider.statuses.FAILED,
        step: 4,
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
    return ['INITIATION', 'AGENT_INITIATION', 'CLAIM_OR_REFUND', 'SWAP'];
  }

  protected _totalSteps(): number {
    return 5;
  }

  private swapLiqualityFormat(swap: any): LiqualitySwapHistoryItem {
    return {
      ...swap,
      to: swap.bridgeAsset,
      toAmount: swap.bridgeAssetAmount,
      slippagePercentage,
    };
  }

  private swapAutomatedMarketMakerFormat(swap: any) {
    return {
      ...swap,
      from: swap.bridgeAsset,
      fromAmount: swap.bridgeAssetAmount,
      fromAccountId: swap.toAccountId, // AMM swaps happen on the same account
      slippagePercentage,
      fee: swap.claimFee,
    };
  }
}

export { LiqualityBoostNativeToERC20 };
