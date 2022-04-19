import { assets, unitToCurrency } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import { withInterval } from '../../../store/actions/performNextAction/utils';
import { createSwapProvider } from '../../../store/factory/swapProvider';
import { getNativeAsset, isERC20 } from '../../../utils/asset';
import { prettyBalance } from '../../../utils/coinFormatter';
import { AstroportSwapProvider } from '../../astroport/AstroportSwapProvider';
import { LiqualitySwapProvider } from '../../liquality/LiqualitySwapProvider';
import { OneinchSwapProvider } from '../../oneinch/OneinchSwapProvider';
import { SovrynSwapProvider } from '../../sovryn/SovrynSwapProvider';
import { SwapProvider } from '../../SwapProvider';
import { LiqualityBoostSwapProviderConfig, SwapStatus } from '../../types';

const slippagePercentage = 3;

class LiqualityBoostERC20toNative extends SwapProvider {
  private liqualitySwapProvider: LiqualitySwapProvider;
  private sovrynSwapProvider: SovrynSwapProvider;
  private oneinchSwapProvider: OneinchSwapProvider;
  private astroportSwapProvider: AstroportSwapProvider;

  private lspEndStates = ['REFUNDED', 'SUCCESS', 'QUOTE_EXPIRED'];

  config: LiqualityBoostSwapProviderConfig;

  // TODO: types
  bridgeAssetToAutomatedMarketMaker: any;
  supportedBridgeAssets: any;

  constructor(config: LiqualityBoostSwapProviderConfig) {
    super(config);
    this.liqualitySwapProvider = createSwapProvider(this.config.network, 'liquality') as LiqualitySwapProvider;
    this.sovrynSwapProvider = createSwapProvider(this.config.network, 'sovryn') as SovrynSwapProvider;
    this.supportedBridgeAssets = this.config.supportedBridgeAssets;

    if (this.config.network === 'mainnet') {
      this.oneinchSwapProvider = createSwapProvider(this.config.network, 'oneinchV4') as OneinchSwapProvider;
      this.astroportSwapProvider = createSwapProvider(this.config.network, 'astroport') as AstroportSwapProvider;
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

  async getQuote({ network, from, to, amount }) {
    if (!isERC20(from) || isERC20(to) || amount <= 0) return null;

    // get native asset of ERC20 network
    const bridgeAsset = getNativeAsset(from);
    if (!this.supportedBridgeAssets.includes(bridgeAsset)) return null;

    // get rate between ERC20 and it's native token (aka bridge asset)
    const quote = await this.bridgeAssetToAutomatedMarketMaker[bridgeAsset].getQuote({
      network,
      from,
      to: bridgeAsset,
      amount,
    });
    if (!quote) return null;

    // get rate between native asset and 'to' asset (which is native too)
    const bridgeAssetQuantity = unitToCurrency(assets[bridgeAsset], quote.toAmount);
    const finalQuote = await this.liqualitySwapProvider.getQuote({
      network,
      from: bridgeAsset,
      to,
      amount: bridgeAssetQuantity.toNumber(),
    });
    if (!finalQuote) return null;

    return {
      from,
      to,
      fromAmount: quote.fromAmount,
      toAmount: finalQuote.toAmount,
      bridgeAsset,
      bridgeAssetAmount: quote.toAmount,
      path: quote.path,
      fromTokenAddress: quote.fromTokenAddress, // for Terra ERC20
    };
  }

  async newSwap({ network, walletId, quote: _quote }) {
    // ERC20 -> Bridge asset
    const result = await this.bridgeAssetToAutomatedMarketMaker[_quote.bridgeAsset].newSwap({
      network,
      walletId,
      quote: this.swapAutomatedMarketMakerFormat(_quote),
    });

    return {
      ...result,
      ..._quote,
      slippage: slippagePercentage * 100,
    };
  }

  async updateOrder(order) {
    return await this.liqualitySwapProvider.updateOrder(order);
  }

  // On FROM_CHAIN calculate fees from AMM swap and `swap initiation` on LSP
  // On TO_CHAIN calculate fees from `swap claim` in LSP
  async estimateFees({ network, walletId, asset, txType, quote, feePrices, max }) {
    const input = { network, walletId, asset, txType, quote, feePrices, max };

    if (txType === this.fromTxType) {
      // swap initiation fee
      const liqualityFees = await this.liqualitySwapProvider.estimateFees({
        ...input,
        asset: quote.bridgeAsset,
        txType: this.liqualitySwapProvider.fromTxType,
        quote: this.swapLiqualityFormat(quote),
      });

      // amm fee
      const automatedMarketMakerFees = await this.bridgeAssetToAutomatedMarketMaker[quote.bridgeAsset].estimateFees({
        ...input,
        // all AMMs have the same fromTxType
        txType: this.sovrynSwapProvider.fromTxType,
        quote: this.swapAutomatedMarketMakerFormat(quote),
      });

      const combinedFees = {};
      for (const key in automatedMarketMakerFees) {
        combinedFees[key] = new BN(automatedMarketMakerFees[key]).plus(liqualityFees[key]);
      }

      return combinedFees;
    } else if (txType === this.toTxType) {
      // swap claim fee
      const liqualityFees = await this.liqualitySwapProvider.estimateFees({
        ...input,
        txType: this.liqualitySwapProvider.toTxType,
        quote: this.swapLiqualityFormat(quote),
      });

      return liqualityFees;
    } else {
      // unknown tx type
      return null;
    }
  }

  async finalizeAutomatedMarketMakerAndStartLiqualitySwap({ swapLiqualityFormat, swapAMMFormat, network, walletId }) {
    let result = await this.bridgeAssetToAutomatedMarketMaker[swapAMMFormat.bridgeAsset].waitForSwapConfirmations({
      swap: swapAMMFormat,
      network,
      walletId,
    });

    if (result?.status === 'SUCCESS') {
      result = await this.liqualitySwapProvider.newSwap({
        network,
        walletId,
        quote: swapLiqualityFormat,
      });

      return {
        ...result,
        ...swapLiqualityFormat,
        toAmount: result.toAmount,
        status: result.status,
      };
    }
  }

  async performNextSwapAction(store, { network, walletId, swap }) {
    let updates;

    if (swap.status === 'WAITING_FOR_SWAP_CONFIRMATIONS') {
      updates = await withInterval(async () =>
        this.finalizeAutomatedMarketMakerAndStartLiqualitySwap({
          swapLiqualityFormat: this.swapLiqualityFormat(swap),
          swapAMMFormat: this.swapAutomatedMarketMakerFormat(swap),
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

    if (!updates && !this.lspEndStates.includes(swap.status)) {
      updates = await this.bridgeAssetToAutomatedMarketMaker[swap.bridgeAsset].performNextSwapAction(store, {
        network,
        walletId,
        swap: this.swapAutomatedMarketMakerFormat(swap),
      });
    }

    if (!updates) return;

    return {
      ...updates,
      // reset from and to assets and values
      from: swap.from,
      fromAmount: swap.fromAmount,
      to: swap.to,
      // keep `toAmount` (from updates object) only in case swap transitioned from AMM to LSP
      toAmount: updates.status === 'INITIATED' ? updates.toAmount : swap.toAmount,
    };
  }

  protected _getStatuses(): Record<string, SwapStatus> {
    return {
      ...this.liqualitySwapProvider.statuses,
      ...this.sovrynSwapProvider.statuses,
      // AAM states
      APPROVE_CONFIRMED: {
        ...this.sovrynSwapProvider.statuses.APPROVE_CONFIRMED,
        label: 'Swapping {from} for {bridgeAsset}',
      },
      WAITING_FOR_SWAP_CONFIRMATIONS: {
        ...this.sovrynSwapProvider.statuses.WAITING_FOR_SWAP_CONFIRMATIONS,
        label: 'Swapping {from} for {bridgeAsset}',
        notification() {
          return {
            message: 'Engaging Automated Market Maker',
          };
        },
      },
      // Liquality swap states
      INITIATED: {
        ...this.liqualitySwapProvider.statuses.INITIATED,
        step: 2,
        label: 'Locking {bridgeAsset}',
      },
      INITIATION_REPORTED: {
        ...this.liqualitySwapProvider.statuses.INITIATION_REPORTED,
        step: 2,
        label: 'Locking {bridgeAsset}',
      },
      INITIATION_CONFIRMED: {
        ...this.liqualitySwapProvider.statuses.INITIATION_CONFIRMED,
        step: 2,
        label: 'Locking {bridgeAsset}',
      },
      FUNDED: {
        ...this.liqualitySwapProvider.statuses.FUNDED,
        step: 3,
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
        step: 3,
      },
      READY_TO_CLAIM: {
        ...this.liqualitySwapProvider.statuses.READY_TO_CLAIM,
        step: 4,
      },
      WAITING_FOR_CLAIM_CONFIRMATIONS: {
        ...this.liqualitySwapProvider.statuses.WAITING_FOR_CLAIM_CONFIRMATIONS,
        step: 4,
      },
      WAITING_FOR_REFUND: {
        ...this.liqualitySwapProvider.statuses.WAITING_FOR_REFUND,
        step: 4,
      },
      GET_REFUND: {
        ...this.liqualitySwapProvider.statuses.GET_REFUND,
        label: 'Refunding {bridgeAsset}',
        step: 4,
      },
      WAITING_FOR_REFUND_CONFIRMATIONS: {
        ...this.liqualitySwapProvider.statuses.WAITING_FOR_REFUND_CONFIRMATIONS,
        label: 'Refunding {bridgeAsset}',
        step: 4,
      },
      // final states
      REFUNDED: {
        ...this.liqualitySwapProvider.statuses.REFUNDED,
        step: 5,
      },
      SUCCESS: {
        ...this.liqualitySwapProvider.statuses.SUCCESS,
        step: 5,
      },
      QUOTE_EXPIRED: {
        ...this.liqualitySwapProvider.statuses.QUOTE_EXPIRED,
        step: 5,
      },
      FAILED: {
        ...this.sovrynSwapProvider.statuses.FAILED,
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
    return ['APPROVE', 'SWAP', 'INITIATION', 'AGENT_INITIATION', 'CLAIM_OR_REFUND'];
  }

  protected _totalSteps(): number {
    return 6;
  }

  private swapLiqualityFormat(swap: any) {
    return {
      ...swap,
      from: swap.bridgeAsset,
      fromAmount: swap.bridgeAssetAmount,
      slippagePercentage,
    };
  }

  private swapAutomatedMarketMakerFormat(swap: any) {
    return {
      ...swap,
      to: swap.bridgeAsset,
      toAmount: swap.bridgeAssetAmount,
      toAccountId: swap.fromAccountId, // AMM swaps happen on same account
      slippagePercentage,
    };
  }
}

export { LiqualityBoostERC20toNative };
