"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiqualityBoostNativeToERC20 = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const factory_1 = require("../../../factory");
const utils_1 = require("../../../store/actions/performNextAction/utils");
const types_1 = require("../../../store/types");
const asset_1 = require("../../../utils/asset");
const coinFormatter_1 = require("../../../utils/coinFormatter");
const SwapProvider_1 = require("../../SwapProvider");
const slippagePercentage = 3;
class LiqualityBoostNativeToERC20 extends SwapProvider_1.SwapProvider {
    constructor(config) {
        super(config);
        this.liqualitySwapProvider = (0, factory_1.getSwapProvider)(this.config.network, types_1.SwapProviderType.Liquality);
        this.sovrynSwapProvider = (0, factory_1.getSwapProvider)(this.config.network, types_1.SwapProviderType.Sovryn);
        this.supportedBridgeAssets = this.config.supportedBridgeAssets;
        if (this.config.network === 'mainnet') {
            this.oneinchSwapProvider = (0, factory_1.getSwapProvider)(this.config.network, types_1.SwapProviderType.OneInch);
            this.astroportSwapProvider = (0, factory_1.getSwapProvider)(this.config.network, types_1.SwapProviderType.Astroport);
            this.bridgeAssetToAutomatedMarketMaker = {
                MATIC: this.oneinchSwapProvider,
                ETH: this.oneinchSwapProvider,
                BNB: this.oneinchSwapProvider,
                RBTC: this.sovrynSwapProvider,
                AVAX: this.oneinchSwapProvider,
                UST: this.astroportSwapProvider,
                LUNA: this.astroportSwapProvider,
            };
        }
        else if (this.config.network === 'testnet') {
            this.bridgeAssetToAutomatedMarketMaker = {
                RBTC: this.sovrynSwapProvider,
            };
        }
    }
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    getQuote({ network, from, to, amount }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((0, asset_1.isERC20)(from) || !(0, asset_1.isERC20)(to) || amount.lte(0)) {
                return null;
            }
            const bridgeAsset = (0, asset_1.getNativeAsset)(to);
            if (!this.supportedBridgeAssets.includes(bridgeAsset)) {
                return null;
            }
            const quote = yield this.liqualitySwapProvider.getQuote({
                network,
                from,
                to: bridgeAsset,
                amount,
            });
            if (!quote) {
                return null;
            }
            const bridgeAssetQuantity = (0, cryptoassets_1.unitToCurrency)((0, cryptoassets_1.getAsset)(network, bridgeAsset), new bignumber_js_1.default(quote.toAmount));
            const finalQuote = (yield this.bridgeAssetToAutomatedMarketMaker[bridgeAsset].getQuote({
                network,
                from: bridgeAsset,
                to,
                amount: bridgeAssetQuantity,
            }));
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
                fromTokenAddress: finalQuote.fromTokenAddress,
            };
        });
    }
    newSwap({ network, walletId, quote: _quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.liqualitySwapProvider.newSwap({
                network,
                walletId,
                quote: this.swapLiqualityFormat(_quote),
            });
            return Object.assign(Object.assign(Object.assign({}, result), _quote), { slippage: slippagePercentage * 100, bridgeAssetAmount: result.toAmount });
        });
    }
    updateOrder(order) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.liqualitySwapProvider.updateOrder(order);
        });
    }
    estimateFees({ network, walletId, asset, txType, quote, feePrices, max, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const input = { network, walletId, asset, txType, quote, feePrices, max };
            if (txType === this.fromTxType) {
                const liqualityFees = yield this.liqualitySwapProvider.estimateFees(Object.assign(Object.assign({}, input), { txType: this.liqualitySwapProvider.fromTxType, quote: this.swapLiqualityFormat(quote) }));
                return liqualityFees;
            }
            else if (txType === this.toTxType) {
                const liqualityFees = yield this.liqualitySwapProvider.estimateFees(Object.assign(Object.assign({}, input), { asset: quote.bridgeAsset, txType: this.liqualitySwapProvider.toTxType, quote: this.swapLiqualityFormat(quote) }));
                const automatedMarketMakerFees = yield this.bridgeAssetToAutomatedMarketMaker[quote.bridgeAsset].estimateFees(Object.assign(Object.assign({}, input), { asset: quote.bridgeAsset, txType: this.sovrynSwapProvider.fromTxType, quote: this.swapAutomatedMarketMakerFormat(quote) }));
                const combinedFees = {};
                for (const key in automatedMarketMakerFees) {
                    combinedFees[Number(key)] = new bignumber_js_1.default(automatedMarketMakerFees[Number(key)]).plus(liqualityFees[Number(key)]);
                }
                return combinedFees;
            }
            else {
                return null;
            }
        });
    }
    getMin(quoteRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.liqualitySwapProvider.getMin(Object.assign(Object.assign({}, quoteRequest), { to: (0, asset_1.getNativeAsset)(quoteRequest.to) }));
        });
    }
    finalizeLiqualitySwapAndStartAutomatedMarketMaker({ swapLSP, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.liqualitySwapProvider.waitForClaimConfirmations({
                swap: swapLSP,
                network: network,
                walletId: walletId,
            });
            if ((result === null || result === void 0 ? void 0 : result.status) === 'SUCCESS') {
                return { endTime: Date.now(), status: 'APPROVE_CONFIRMED' };
            }
        });
    }
    performNextSwapAction(store, { network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let updates;
            if (swap.status === 'WAITING_FOR_CLAIM_CONFIRMATIONS') {
                updates = yield (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return this.finalizeLiqualitySwapAndStartAutomatedMarketMaker({
                        swapLSP: this.swapLiqualityFormat(swap),
                        network,
                        walletId,
                    });
                }));
            }
            else {
                updates = yield this.liqualitySwapProvider.performNextSwapAction(store, {
                    network,
                    walletId,
                    swap: this.swapLiqualityFormat(swap),
                });
            }
            if (!updates) {
                updates = yield this.bridgeAssetToAutomatedMarketMaker[swap.bridgeAsset].performNextSwapAction(store, {
                    network,
                    walletId,
                    swap: this.swapAutomatedMarketMakerFormat(swap),
                });
            }
            return updates;
        });
    }
    _getStatuses() {
        return Object.assign(Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses), this.sovrynSwapProvider.statuses), { CONFIRM_COUNTER_PARTY_INITIATION: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.CONFIRM_COUNTER_PARTY_INITIATION), { label: 'Locking {bridgeAsset}', notification(swap) {
                    return {
                        message: `Counterparty sent ${(0, coinFormatter_1.prettyBalance)(swap.bridgeAssetAmount, swap.bridgeAsset)} ${swap.bridgeAsset} to escrow`,
                    };
                } }), READY_TO_CLAIM: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.READY_TO_CLAIM), { label: 'Claiming {bridgeAsset}' }), WAITING_FOR_CLAIM_CONFIRMATIONS: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.WAITING_FOR_CLAIM_CONFIRMATIONS), { label: 'Claiming {bridgeAsset}' }), APPROVE_CONFIRMED: Object.assign(Object.assign({}, this.sovrynSwapProvider.statuses.APPROVE_CONFIRMED), { step: 4, label: 'Swapping {bridgeAsset} for {to}' }), WAITING_FOR_SWAP_CONFIRMATIONS: Object.assign(Object.assign({}, this.sovrynSwapProvider.statuses.WAITING_FOR_SWAP_CONFIRMATIONS), { notification() {
                    return {
                        message: 'Engaging Automated Market Maker',
                    };
                }, step: 4 }), SUCCESS: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.SUCCESS), { step: 5 }), FAILED: Object.assign(Object.assign({}, this.sovrynSwapProvider.statuses.FAILED), { step: 5 }) });
    }
    _txTypes() {
        return {
            FROM_CHAIN: 'FROM_CHAIN',
            TO_CHAIN: 'TO_CHAIN',
        };
    }
    _fromTxType() {
        return this._txTypes().FROM_CHAIN;
    }
    _toTxType() {
        return this._txTypes().TO_CHAIN;
    }
    _timelineDiagramSteps() {
        const ammTimeline = this.sovrynSwapProvider.timelineDiagramSteps;
        if (ammTimeline[0] === 'APPROVE') {
            ammTimeline.shift();
        }
        return this.liqualitySwapProvider.timelineDiagramSteps.concat(ammTimeline);
    }
    _totalSteps() {
        let ammSteps = this.sovrynSwapProvider.totalSteps;
        if (this.sovrynSwapProvider.timelineDiagramSteps[0] === 'APPROVE') {
            ammSteps -= 1;
        }
        return this.liqualitySwapProvider.totalSteps + ammSteps;
    }
    swapLiqualityFormat(swap) {
        return Object.assign(Object.assign({}, swap), { to: swap.bridgeAsset, toAmount: swap.bridgeAssetAmount, slippagePercentage });
    }
    swapAutomatedMarketMakerFormat(swap) {
        return Object.assign(Object.assign({}, swap), { from: swap.bridgeAsset, fromAmount: swap.bridgeAssetAmount, fromAccountId: swap.toAccountId, slippagePercentage, fee: swap.claimFee });
    }
}
exports.LiqualityBoostNativeToERC20 = LiqualityBoostNativeToERC20;
//# sourceMappingURL=LiqualityBoostNativeToERC20.js.map