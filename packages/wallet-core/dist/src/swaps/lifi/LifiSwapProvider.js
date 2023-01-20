"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifiSwapProvider = void 0;
const tslib_1 = require("tslib");
const client_1 = require("@chainify/client");
const types_1 = require("@chainify/types");
const sdk_1 = tslib_1.__importStar(require("@lifi/sdk"));
const cryptoassets_1 = require("@liquality/cryptoassets");
const error_parser_1 = require("@liquality/error-parser");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const ethers_1 = require("ethers");
const uuid_1 = require("uuid");
const utils_1 = require("../../store/actions/performNextAction/utils");
const coinFormatter_1 = require("../../utils/coinFormatter");
const cryptoassets_2 = tslib_1.__importDefault(require("../../utils/cryptoassets"));
const EvmSwapProvider_1 = require("../EvmSwapProvider");
class LifiSwapProvider extends EvmSwapProvider_1.EvmSwapProvider {
    constructor(config) {
        var _a, _b;
        super(config);
        this.nativeAssetAddress = ethers_1.ethers.constants.AddressZero;
        const lifiConfig = {
            defaultRouteOptions: {
                slippage: (_a = config.slippage) !== null && _a !== void 0 ? _a : 0.05,
                order: (_b = config.order) !== null && _b !== void 0 ? _b : sdk_1.Orders[0],
                integrator: 'Liquality Wallet',
                bridges: {
                    deny: ['connext'],
                },
            },
        };
        this._httpClient = new client_1.HttpClient({ baseURL: this.config.apiURL });
        this._lifiClient = new sdk_1.default(lifiConfig);
    }
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    getQuote({ network, from, to, amount, fromAccountId, toAccountId, walletId }) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fromInfo = cryptoassets_2.default[from];
            const toInfo = cryptoassets_2.default[to];
            const fromAmountInUnit = (0, cryptoassets_1.currencyToUnit)(fromInfo, new bignumber_js_1.default(amount)).toString(10);
            const fromChainId = (0, cryptoassets_1.getChain)(network, fromInfo.chain).network.chainId;
            const toChainId = (0, cryptoassets_1.getChain)(network, toInfo.chain).network.chainId;
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, from, fromAccountId);
            const toAddressRaw = yield this.getSwapAddress(network, walletId, to, toAccountId);
            const quoteRequest = {
                fromChain: fromChainId,
                fromAmount: fromAmountInUnit,
                fromToken: (_a = fromInfo.contractAddress) !== null && _a !== void 0 ? _a : this.nativeAssetAddress,
                toChain: toChainId,
                toToken: (_b = toInfo.contractAddress) !== null && _b !== void 0 ? _b : this.nativeAssetAddress,
                fromAddress: (0, cryptoassets_1.getChain)(network, fromInfo.chain).formatAddress(fromAddressRaw),
                toAddress: (0, cryptoassets_1.getChain)(network, toInfo.chain).formatAddress(toAddressRaw),
                order: this._lifiClient.getConfig().defaultRouteOptions.order,
                slippage: this._lifiClient.getConfig().defaultRouteOptions.slippage,
                integrator: this._lifiClient.getConfig().defaultRouteOptions.integrator,
                denyBridges: (_c = this._lifiClient.getConfig().defaultRouteOptions.bridges) === null || _c === void 0 ? void 0 : _c.deny,
            };
            try {
                const parser = (0, error_parser_1.getErrorParser)(error_parser_1.LifiQuoteErrorParser);
                const lifiRoute = (yield parser.wrapAsync(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield this._lifiClient.getQuote(quoteRequest); }), {
                    fromToken: quoteRequest.fromToken,
                    toToken: quoteRequest.toToken,
                    fromAmount: quoteRequest.fromAmount,
                }));
                return { from, to, fromAmount: fromAmountInUnit, toAmount: lifiRoute.estimate.toAmount, lifiRoute };
            }
            catch (e) {
                return null;
            }
        });
    }
    newSwap(swap) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const route = this.getRoute(swap.quote);
            const approvalAddress = route.estimate.approvalAddress;
            const approveTx = yield this.approve(swap, false, approvalAddress);
            let updates;
            if (approveTx) {
                updates = approveTx;
            }
            else {
                updates = yield this.initiateSwap(swap);
            }
            return Object.assign({ id: (0, uuid_1.v4)() }, updates);
        });
    }
    initiateSwap({ network, walletId, quote }) {
        const _super = Object.create(null, {
            getClient: { get: () => super.getClient }
        });
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const route = this.getRoute(quote);
            const client = _super.getClient.call(this, network, walletId, quote.from, quote.fromAccountId);
            const txData = route.transactionRequest;
            let gasLimit = txData.gasLimit;
            const chainName = (_a = cryptoassets_2.default[quote.from]) === null || _a === void 0 ? void 0 : _a.chain;
            if (chainName === cryptoassets_1.ChainId.Arbitrum && (0, bignumber_js_1.default)(gasLimit || 0).lt(9000000)) {
                gasLimit = 9000000;
            }
            const fromFundTx = yield client.wallet.sendTransaction({
                data: txData.data,
                to: txData.to,
                value: txData.value,
                gasLimit,
                fee: quote.fee,
            });
            return {
                status: 'WAITING_FOR_INITIATION_CONFIRMATIONS',
                fromFundTx,
                fromFundHash: fromFundTx.hash,
            };
        });
    }
    estimateFees(feeRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const route = this.getRoute(feeRequest.quote);
            if (feeRequest.txType in this._txTypes()) {
                const fees = {};
                const client = this.getClient(feeRequest.network, feeRequest.walletId, feeRequest.quote.from, feeRequest.quote.fromAccountId);
                const approvalData = yield this.buildApprovalTx(feeRequest, false, route.estimate.approvalAddress);
                let approvalGas = 0;
                if (approvalData) {
                    approvalGas = (yield client.chain.getProvider().estimateGas(Object.assign(Object.assign({}, approvalData), { fee: feeRequest.quote.fee }))).toNumber();
                }
                const txData = route.transactionRequest;
                let txGas = 0;
                try {
                    txGas = (yield client.chain.getProvider().estimateGas({
                        data: txData === null || txData === void 0 ? void 0 : txData.data,
                        to: txData === null || txData === void 0 ? void 0 : txData.to,
                        from: txData === null || txData === void 0 ? void 0 : txData.from,
                        value: txData === null || txData === void 0 ? void 0 : txData.value,
                        fee: feeRequest.quote.fee,
                    })).toNumber();
                }
                catch (_a) {
                    txGas = txData === null || txData === void 0 ? void 0 : txData.gasLimit;
                }
                const nativeAsset = (0, cryptoassets_1.getChain)(feeRequest.network, cryptoassets_2.default[feeRequest.quote.from].chain).nativeAsset[0];
                for (const feePrice of feeRequest.feePrices) {
                    const gasPrice = new bignumber_js_1.default(feePrice).times(1e9);
                    const fee = new bignumber_js_1.default(approvalGas).plus(txGas).times(1.1).times(gasPrice);
                    fees[feePrice] = (0, cryptoassets_1.unitToCurrency)(nativeAsset, fee);
                }
                return fees;
            }
            return null;
        });
    }
    getMin(_quoteRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new bignumber_js_1.default(0);
        });
    }
    getCrossChainSwapStatus(quote) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const route = this.getRoute(quote);
            const result = yield this._httpClient.nodeGet('/status', {
                bridge: route.tool,
                fromChain: this.getChainNameByChainID(route.action.fromChainId),
                toChain: this.getChainNameByChainID(route.action.toChainId),
                txHash: quote.fromFundHash,
            });
            return result;
        });
    }
    getChainNameByChainID(id) {
        const indexOfChainId = Object.values(sdk_1.ChainId).indexOf(id);
        return Object.keys(sdk_1.ChainId)[indexOfChainId];
    }
    isCrossSwap(swap) {
        const route = this.getRoute(swap);
        switch (route.type) {
            case 'swap':
                return false;
            case 'cross':
                return true;
            case 'lifi':
                return route.includedSteps.reduce((acc, action) => action.type === 'cross' || acc, false);
        }
    }
    getRoute(quote) {
        if (!quote.lifiRoute) {
            throw new Error(`LiFiSwapProvider: best route doesn't exist`);
        }
        return quote.lifiRoute;
    }
    waitForInitiationConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.fromFundHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    const { status } = tx;
                    this.updateBalances(network, walletId, [swap.fromAccountId]);
                    if (status === types_1.TxStatus.Success && this.isCrossSwap(swap)) {
                        return {
                            endTime: Date.now(),
                            status: 'WAITING_FOR_RECEIVE_CONFIRMATIONS',
                        };
                    }
                    return {
                        endTime: Date.now(),
                        status: status === types_1.TxStatus.Success ? 'SUCCESS' : 'FAILED',
                    };
                }
            }
            catch (e) {
                if (e.name === 'TxNotFoundError') {
                    console.warn(e);
                }
                else {
                    throw e;
                }
            }
        });
    }
    waitForReceiveConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.getCrossChainSwapStatus(swap);
                if (result.status === 'DONE' || result.status === 'FAILED') {
                    this.updateBalances(network, walletId, [swap.toAccountId]);
                    return {
                        endTime: Date.now(),
                        status: result.status === 'DONE' ? 'SUCCESS' : 'FAILED',
                    };
                }
            }
            catch (e) {
                console.warn('LifiSwapProvider: ', e);
            }
        });
    }
    performNextSwapAction(store, { network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (swap.status) {
                case 'WAITING_FOR_APPROVE_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForApproveConfirmations({ swap, network, walletId }); }));
                case 'APPROVE_CONFIRMED':
                    return (0, utils_1.withLock)(store, { item: swap, network, walletId, asset: swap.from }, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.initiateSwap({ quote: swap, network, walletId }); }));
                case 'WAITING_FOR_INITIATION_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForInitiationConfirmations({ swap, network, walletId }); }));
                case 'WAITING_FOR_RECEIVE_CONFIRMATIONS':
                    return yield (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForReceiveConfirmations({ swap, network, walletId }); }));
            }
        });
    }
    _getStatuses() {
        return Object.assign(Object.assign({}, super._getStatuses()), { WAITING_FOR_INITIATION_CONFIRMATIONS: {
                step: 1,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Engaging LiFi',
                    };
                },
            }, WAITING_FOR_RECEIVE_CONFIRMATIONS: {
                step: 2,
                label: 'Swapping {to}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Engaging LiFi',
                    };
                },
            }, SUCCESS: {
                step: 3,
                label: 'Completed',
                filterStatus: 'COMPLETED',
                notification(swap) {
                    return {
                        message: `Swap completed, ${(0, coinFormatter_1.prettyBalance)(swap.toAmount, swap.to)} ${swap.to} ready to use`,
                    };
                },
            }, FAILED: {
                step: 3,
                label: 'Swap Failed',
                filterStatus: 'REFUNDED',
                notification() {
                    return {
                        message: 'Swap failed',
                    };
                },
            } });
    }
    _txTypes() {
        return {
            SWAP: 'SWAP',
        };
    }
    _fromTxType() {
        return this._txTypes().SWAP;
    }
    _toTxType() {
        return null;
    }
    _timelineDiagramSteps() {
        return ['APPROVE', 'INITIATION', 'RECEIVE'];
    }
    _totalSteps() {
        return 4;
    }
}
exports.LifiSwapProvider = LifiSwapProvider;
//# sourceMappingURL=LifiSwapProvider.js.map