import { assets, unitToCurrency } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import { withInterval } from '../../../store/actions/performNextAction/utils';
import { createSwapProvider } from '../../../store/factory/swapProvider';
import { getNativeAsset, isERC20 } from '../../../utils/asset';
import { prettyBalance } from '../../../utils/coinFormatter';
import { LiqualitySwapProvider } from '../../liquality/LiqualitySwapProvider';
import { OneinchSwapProvider } from '../../oneinch/OneinchSwapProvider';
import { SovrynSwapProvider } from '../../sovryn/SovrynSwapProvider';
import { SwapProvider } from '../../SwapProvider';
import { SwapStatus } from '../../types';

const slippagePercentage = 3;

class LiqualityBoostERC20toNative extends SwapProvider {
  private liqualitySwapProvider: LiqualitySwapProvider;
  private sovrynSwapProvider: SovrynSwapProvider;
  private oneinchSwapProvider: OneinchSwapProvider;

  private lspEndStates = ['REFUNDED', 'SUCCESS', 'QUOTE_EXPIRED'];

  // TODO: types
  bridgeAssetToAutomatedMarketMaker: any;
  supportedBridgeAssets: any;

  constructor(config) {
    super(config);
    this.liqualitySwapProvider = createSwapProvider(this.config.network, 'liquality') as LiqualitySwapProvider;
    this.sovrynSwapProvider = createSwapProvider(this.config.network, 'sovryn') as SovrynSwapProvider;
    this.supportedBridgeAssets = this.config.supportedBridgeAssets;

    if (this.config.network === 'mainnet') {
      this.oneinchSwapProvider = createSwapProvider(this.config.network, 'oneinchV4') as OneinchSwapProvider;
      this.bridgeAssetToAutomatedMarketMaker = {
        MATIC: this.oneinchSwapProvider,
        ETH: this.oneinchSwapProvider,
        BNB: this.oneinchSwapProvider,
        RBTC: this.sovrynSwapProvider,
        AVAX: this.oneinchSwapProvider,
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
    };
  }

  async newSwap({ network, walletId, quote: _quote }) {
    // ERC20 -> Bridge asset
    const result = await this.bridgeAssetToAutomatedMarketMaker[_quote.bridgeAsset].newSwap({
      network,
      walletId,
      quote: {
        ..._quote,
        to: _quote.bridgeAsset,
        toAmount: _quote.bridgeAssetAmount,
      },
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

  async estimateFees({ network, walletId, asset, txType, quote, feePrices, max }) {
    // bridge asset -> 'to' asset
    const liqualityFees = await this.liqualitySwapProvider.estimateFees({
      network,
      walletId,
      asset,
      txType: txType === this._txTypes().SWAP ? this._txTypes().SWAP_CLAIM : txType,
      quote: {
        ...quote,
        from: quote.bridgeAsset,
        toAmount: quote.bridgeAssetAmount,
        toAccountId: quote.fromAccountId,
      },
      feePrices,
      max,
    });

    // 'from' asset -> bridge asset
    if (!isERC20(asset) && txType === this._txTypes().SWAP) {
      const automatedMarketMakerFees = await this.bridgeAssetToAutomatedMarketMaker[quote.bridgeAsset].estimateFees({
        network,
        walletId,
        asset,
        txType: this._txTypes().SWAP,
        quote: {
          ...quote,
          to: quote.bridgeAsset,
          toAmount: quote.bridgeAssetAmount,
          slippagePercentage,
        },
        feePrices,
        max,
      });
      const totalFees = {};
      for (const key in automatedMarketMakerFees) {
        totalFees[key] = new BN(automatedMarketMakerFees[key]).plus(liqualityFees[key]);
      }

      return totalFees;
    }

    return liqualityFees;
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
    const swapLiqualityFormat = {
      ...swap,
      from: swap.bridgeAsset,
      fromAmount: swap.bridgeAssetAmount,
      toAccountId: swap.fromAccountId,
      slippagePercentage,
    };

    const swapAutomatedMarketMakerFormat = {
      ...swap,
      to: swap.bridgeAsset,
      toAmount: swap.bridgeAssetAmount,
      slippagePercentage,
    };

    if (swap.status === 'WAITING_FOR_SWAP_CONFIRMATIONS') {
      updates = await withInterval(async () =>
        this.finalizeAutomatedMarketMakerAndStartLiqualitySwap({
          swapLiqualityFormat,
          swapAMMFormat: swapAutomatedMarketMakerFormat,
          network,
          walletId,
        })
      );
    } else {
      updates = await this.liqualitySwapProvider.performNextSwapAction(store, {
        network,
        walletId,
        swap: swapLiqualityFormat,
      });
    }

    if (!updates && !this.lspEndStates.includes(swap.status)) {
      updates = await this.bridgeAssetToAutomatedMarketMaker[swap.bridgeAsset].performNextSwapAction(store, {
        network,
        walletId,
        swap: swapAutomatedMarketMakerFormat,
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

  protected _txTypes(): Record<string, string | null> {
    return {
      ...this.liqualitySwapProvider.txTypes,
      ...this.oneinchSwapProvider.txTypes,
    };
  }

  protected _getStatuses(): Record<string, SwapStatus> {
    return {
      ...this.liqualitySwapProvider.statuses,
      ...this.oneinchSwapProvider.statuses,
      // AAM states
      APPROVE_CONFIRMED: {
        ...this.oneinchSwapProvider.statuses.APPROVE_CONFIRMED,
        label: 'Swapping {from} for {bridgeAsset}',
      },
      WAITING_FOR_SWAP_CONFIRMATIONS: {
        ...this.oneinchSwapProvider.statuses.WAITING_FOR_SWAP_CONFIRMATIONS,
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
        ...this.oneinchSwapProvider.statuses.FAILED,
        step: 5,
      },
    };
  }

  protected _fromTxType(): string | null {
    return this._txTypes().SWAP;
  }

  protected _toTxType(): string | null {
    return this._txTypes().SWAP_CLAIM;
  }

  protected _timelineDiagramSteps(): string[] {
    return ['APPROVE', 'SWAP', 'INITIATION', 'AGENT_INITIATION', 'CLAIM_OR_REFUND'];
  }

  protected _totalSteps(): number {
    return 6;
  }
}

export { LiqualityBoostERC20toNative };
