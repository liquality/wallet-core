"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiqualityBoostERC20toNative = void 0;
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
class LiqualityBoostERC20toNative extends SwapProvider_1.SwapProvider {
    constructor(config) {
        super(config);
        this.lspEndStates = ['REFUNDED', 'SUCCESS', 'QUOTE_EXPIRED'];
        this.liqualitySwapProvider = (0, factory_1.getSwapProvider)(this.config.network, types_1.SwapProviderType.Liquality);
        this.sovrynSwapProvider = (0, factory_1.getSwapProvider)(this.config.network, types_1.SwapProviderType.Sovryn);
        this.supportedBridgeAssets = this.config.supportedBridgeAssets;
        if (this.config.network === types_1.Network.Mainnet) {
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
        else if (this.config.network === types_1.Network.Testnet) {
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
            if (!(0, asset_1.isERC20)(from) || (0, asset_1.isERC20)(to) || amount.lte(0))
                return null;
            const bridgeAsset = (0, asset_1.getNativeAsset)(from);
            if (!this.supportedBridgeAssets.includes(bridgeAsset))
                return null;
            const quote = (yield this.bridgeAssetToAutomatedMarketMaker[bridgeAsset].getQuote({
                network,
                from,
                to: bridgeAsset,
                amount,
            }));
            if (!quote)
                return null;
            const bridgeAssetQuantity = (0, cryptoassets_1.unitToCurrency)((0, cryptoassets_1.getAsset)(network, bridgeAsset), new bignumber_js_1.default(quote.toAmount));
            const finalQuote = yield this.liqualitySwapProvider.getQuote({
                network,
                from: bridgeAsset,
                to,
                amount: bridgeAssetQuantity,
            });
            if (!finalQuote)
                return null;
            const min = finalQuote.min.times(1.05);
            return {
                from,
                to,
                fromAmount: quote.fromAmount,
                toAmount: finalQuote.toAmount,
                minInBridgeAsset: min,
                maxInBridgeAsset: finalQuote.max,
                bridgeAsset,
                bridgeAssetAmount: quote.toAmount,
                path: quote.path,
                fromTokenAddress: quote.fromTokenAddress,
            };
        });
    }
    newSwap({ network, walletId, quote: _quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.bridgeAssetToAutomatedMarketMaker[_quote.bridgeAsset].newSwap({
                network,
                walletId,
                quote: this.swapAutomatedMarketMakerFormat(_quote),
            });
            return Object.assign(Object.assign(Object.assign({}, result), _quote), { slippage: slippagePercentage * 100 });
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
                const liqualityFees = yield this.liqualitySwapProvider.estimateFees(Object.assign(Object.assign({}, input), { asset: quote.bridgeAsset, txType: this.liqualitySwapProvider.fromTxType, quote: this.swapLiqualityFormat(quote) }));
                const automatedMarketMakerFees = yield this.bridgeAssetToAutomatedMarketMaker[quote.bridgeAsset].estimateFees(Object.assign(Object.assign({}, input), { txType: this.sovrynSwapProvider.fromTxType, quote: this.swapAutomatedMarketMakerFormat(quote) }));
                const combinedFees = {};
                for (const key in automatedMarketMakerFees) {
                    combinedFees[Number(key)] = new bignumber_js_1.default(automatedMarketMakerFees[Number(key)]).plus(liqualityFees[Number(key)]);
                }
                return combinedFees;
            }
            else if (txType === this.toTxType) {
                const liqualityFees = yield this.liqualitySwapProvider.estimateFees(Object.assign(Object.assign({}, input), { txType: this.liqualitySwapProvider.toTxType, quote: this.swapLiqualityFormat(quote) }));
                return liqualityFees;
            }
            else {
                return null;
            }
        });
    }
    getMin(quoteRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const amountInNative = yield this.liqualitySwapProvider.getMin(Object.assign(Object.assign({}, quoteRequest), { from: (0, asset_1.getNativeAsset)(quoteRequest.from) }));
                const quote = (yield this.bridgeAssetToAutomatedMarketMaker[(0, asset_1.getNativeAsset)(quoteRequest.from)].getQuote({
                    network: quoteRequest.network,
                    from: (0, asset_1.getNativeAsset)(quoteRequest.from),
                    to: quoteRequest.from,
                    amount: new bignumber_js_1.default(amountInNative),
                }));
                const fromMinAmount = (0, cryptoassets_1.unitToCurrency)((0, cryptoassets_1.getAsset)(quoteRequest.network, quoteRequest.from), new bignumber_js_1.default(quote.toAmount));
                return new bignumber_js_1.default(fromMinAmount).times(1.5);
            }
            catch (err) {
                console.warn(err);
                return new bignumber_js_1.default(0);
            }
        });
    }
    finalizeAutomatedMarketMakerAndStartLiqualitySwap({ swapLSP, swapAMM, network, walletId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const _network = network;
            const _walletId = walletId;
            const resultAMM = yield this.bridgeAssetToAutomatedMarketMaker[swapAMM === null || swapAMM === void 0 ? void 0 : swapAMM.bridgeAsset].waitForSwapConfirmations({
                swap: swapAMM,
                network: _network,
                walletId: _walletId,
            });
            if ((resultAMM === null || resultAMM === void 0 ? void 0 : resultAMM.status) === 'SUCCESS') {
                const resultLSP = yield this.liqualitySwapProvider.newSwap({
                    network: _network,
                    walletId: _walletId,
                    quote: swapLSP,
                });
                return Object.assign(Object.assign(Object.assign({}, resultLSP), swapLSP), { toAmount: resultLSP.toAmount, status: resultLSP.status });
            }
        });
    }
    performNextSwapAction(store, { network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let updates;
            if (swap.status === 'WAITING_FOR_SWAP_CONFIRMATIONS') {
                updates = yield (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return this.finalizeAutomatedMarketMakerAndStartLiqualitySwap({
                        swapLSP: this.swapLiqualityFormat(swap),
                        swapAMM: this.swapAutomatedMarketMakerFormat(swap),
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
            if (!updates && !this.lspEndStates.includes(swap.status)) {
                updates = yield this.bridgeAssetToAutomatedMarketMaker[swap.bridgeAsset].performNextSwapAction(store, {
                    network,
                    walletId,
                    swap: this.swapAutomatedMarketMakerFormat(swap),
                });
            }
            if (!updates)
                return;
            return Object.assign(Object.assign({}, updates), { from: swap.from, fromAmount: swap.fromAmount, to: swap.to, toAmount: updates.status === 'INITIATED' ? updates.toAmount : swap.toAmount });
        });
    }
    _getStatuses() {
        return Object.assign(Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses), this.sovrynSwapProvider.statuses), { APPROVE_CONFIRMED: Object.assign(Object.assign({}, this.sovrynSwapProvider.statuses.APPROVE_CONFIRMED), { label: 'Swapping {from} for {bridgeAsset}' }), WAITING_FOR_SWAP_CONFIRMATIONS: Object.assign(Object.assign({}, this.sovrynSwapProvider.statuses.WAITING_FOR_SWAP_CONFIRMATIONS), { label: 'Swapping {from} for {bridgeAsset}', notification() {
                    return {
                        message: 'Engaging Automated Market Maker',
                    };
                } }), APPROVE_CONFIRMED_LSP: {
                step: 1,
                label: 'Locking {from}',
                filterStatus: 'PENDING',
            }, INITIATED: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.INITIATED), { step: 2, label: 'Locking {bridgeAsset}' }), INITIATION_REPORTED: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.INITIATION_REPORTED), { step: 2, label: 'Locking {bridgeAsset}' }), INITIATION_CONFIRMED: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.INITIATION_CONFIRMED), { step: 2, label: 'Locking {bridgeAsset}' }), CONFIRM_COUNTER_PARTY_INITIATION: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.CONFIRM_COUNTER_PARTY_INITIATION), { label: 'Locking {bridgeAsset}', notification(swap) {
                    return {
                        message: `Counterparty sent ${(0, coinFormatter_1.prettyBalance)(Number(swap.bridgeAssetAmount), swap.bridgeAsset)} ${swap.bridgeAsset} to escrow`,
                    };
                }, step: 3 }), READY_TO_CLAIM: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.READY_TO_CLAIM), { step: 4 }), WAITING_FOR_CLAIM_CONFIRMATIONS: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.WAITING_FOR_CLAIM_CONFIRMATIONS), { step: 4 }), WAITING_FOR_REFUND: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.WAITING_FOR_REFUND), { step: 4 }), GET_REFUND: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.GET_REFUND), { label: 'Refunding {bridgeAsset}', step: 4 }), WAITING_FOR_REFUND_CONFIRMATIONS: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.WAITING_FOR_REFUND_CONFIRMATIONS), { label: 'Refunding {bridgeAsset}', step: 4 }), REFUNDED: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.REFUNDED), { step: 5 }), SUCCESS: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.SUCCESS), { step: 5 }), QUOTE_EXPIRED: Object.assign(Object.assign({}, this.liqualitySwapProvider.statuses.QUOTE_EXPIRED), { step: 5 }), FAILED: Object.assign(Object.assign({}, this.sovrynSwapProvider.statuses.FAILED), { step: 5 }) });
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
        const lspTimeline = this.liqualitySwapProvider.timelineDiagramSteps;
        if (lspTimeline[0] === 'APPROVE') {
            lspTimeline.shift();
        }
        return this.sovrynSwapProvider.timelineDiagramSteps.concat(lspTimeline);
    }
    _totalSteps() {
        let lspSteps = this.liqualitySwapProvider.totalSteps;
        if (this.liqualitySwapProvider.timelineDiagramSteps[0] === 'APPROVE') {
            lspSteps -= 1;
        }
        return this.sovrynSwapProvider.totalSteps + lspSteps;
    }
    swapLiqualityFormat(swap) {
        return Object.assign(Object.assign({}, swap), { from: swap.bridgeAsset, fromAmount: swap.bridgeAssetAmount, slippagePercentage });
    }
    swapAutomatedMarketMakerFormat(swap) {
        return Object.assign(Object.assign({}, swap), { to: swap.bridgeAsset, toAmount: swap.bridgeAssetAmount, toAccountId: swap.fromAccountId, slippagePercentage });
    }
}
exports.LiqualityBoostERC20toNative = LiqualityBoostERC20toNative;
//# sourceMappingURL=LiqualityBoostERC20toNative.js.map