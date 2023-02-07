"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneinchSwapProvider = void 0;
const tslib_1 = require("tslib");
const client_1 = require("@chainify/client");
const types_1 = require("@chainify/types");
const cryptoassets_1 = require("@liquality/cryptoassets");
const isTransactionNotFoundError_1 = require("../../utils/isTransactionNotFoundError");
const ERC20_json_1 = tslib_1.__importDefault(require("@uniswap/v2-core/build/ERC20.json"));
const bignumber_js_1 = tslib_1.__importStar(require("bignumber.js"));
const ethers = tslib_1.__importStar(require("ethers"));
const uuid_1 = require("uuid");
const store_1 = tslib_1.__importDefault(require("../../store"));
const utils_1 = require("../../store/actions/performNextAction/utils");
const asset_1 = require("../../utils/asset");
const coinFormatter_1 = require("../../utils/coinFormatter");
const cryptoassets_2 = tslib_1.__importDefault(require("../../utils/cryptoassets"));
const SwapProvider_1 = require("../SwapProvider");
const error_parser_1 = require("@liquality/error-parser");
const NATIVE_ASSET_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const SLIPPAGE_PERCENTAGE = 0.5;
const supportedChains = {
    1: true,
    10: true,
    56: true,
    137: true,
    43114: true,
    42161: true,
};
const chainToGasMultiplier = {
    1: 1.5,
    10: 1.5,
    56: 1.5,
    137: 1.5,
    43114: 1.5,
    42161: 10,
};
const optimismL1GasLimits = {
    approve: 6500,
    send: 100000,
};
const oneInchSwapErrorParser = (0, error_parser_1.getErrorParser)(error_parser_1.OneInchSwapErrorParser);
const oneInchApproveErrorParser = (0, error_parser_1.getErrorParser)(error_parser_1.OneInchApproveErrorParser);
const oneInchQuoteErrorParser = (0, error_parser_1.getErrorParser)(error_parser_1.OneInchQuoteErrorParser);
class OneinchSwapProvider extends SwapProvider_1.SwapProvider {
    constructor(config) {
        super(config);
        this._httpClient = new client_1.HttpClient({ baseURL: this.config.agent });
    }
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    getClient(network, walletId, asset, accountId) {
        return super.getClient(network, walletId, asset, accountId);
    }
    getQuote({ network, from, to, amount }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(0, asset_1.isChainEvmCompatible)(from, network) || !(0, asset_1.isChainEvmCompatible)(to, network) || new bignumber_js_1.BigNumber(amount).lte(0))
                return null;
            const fromAmountInUnit = new bignumber_js_1.default((0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[from], new bignumber_js_1.default(amount)));
            const chainIdFrom = Number((0, cryptoassets_1.getChain)(network, cryptoassets_2.default[from].chain).network.chainId);
            const chainIdTo = Number((0, cryptoassets_1.getChain)(network, cryptoassets_2.default[to].chain).network.chainId);
            if (chainIdFrom !== chainIdTo || !supportedChains[chainIdFrom]) {
                return null;
            }
            const trade = yield this._getQuote(chainIdFrom, from, to, fromAmountInUnit.toNumber());
            const toAmountInUnit = new bignumber_js_1.default(trade === null || trade === void 0 ? void 0 : trade.toTokenAmount);
            return {
                fromAmount: fromAmountInUnit.toFixed(),
                toAmount: toAmountInUnit.toFixed(),
            };
        });
    }
    approveTokens({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const approvalData = yield this._buildApproval({ network, walletId, quote });
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const approveTx = yield client.wallet.sendTransaction({
                to: approvalData === null || approvalData === void 0 ? void 0 : approvalData.to,
                value: approvalData === null || approvalData === void 0 ? void 0 : approvalData.value,
                data: approvalData === null || approvalData === void 0 ? void 0 : approvalData.data,
                fee: quote.fee,
            });
            return {
                status: 'WAITING_FOR_APPROVE_CONFIRMATIONS',
                approveTx,
                approveTxHash: approveTx.hash,
            };
        });
    }
    sendSwap({ network, walletId, quote }) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const swapData = yield this._buildSwap({ network, walletId, quote });
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            yield this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
            const swapTx = yield client.wallet.sendTransaction({
                to: (_a = swapData === null || swapData === void 0 ? void 0 : swapData.tx) === null || _a === void 0 ? void 0 : _a.to,
                value: (_b = swapData === null || swapData === void 0 ? void 0 : swapData.tx) === null || _b === void 0 ? void 0 : _b.value,
                data: (_c = swapData === null || swapData === void 0 ? void 0 : swapData.tx) === null || _c === void 0 ? void 0 : _c.data,
                fee: quote.fee,
            });
            return {
                status: 'WAITING_FOR_SWAP_CONFIRMATIONS',
                swapTx,
                swapTxHash: swapTx.hash,
            };
        });
    }
    newSwap({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const approvalRequired = (0, asset_1.isERC20)(quote.from);
            const updates = approvalRequired
                ? yield this.approveTokens({ network, walletId, quote })
                : yield this.sendSwap({ network, walletId, quote });
            return Object.assign({ id: (0, uuid_1.v4)(), fee: quote.fee, slippage: 50 }, updates);
        });
    }
    estimateFees({ network, txType, quote, feePrices, feePricesL1, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const chain = cryptoassets_2.default[quote.from].chain;
            const _chain = (0, cryptoassets_1.getChain)(network, chain);
            const chainId = Number(_chain.network.chainId);
            const nativeAsset = _chain.nativeAsset[0].code;
            if (txType in this._txTypes()) {
                const fees = {};
                const tradeData = yield this._getQuote(chainId, quote.from, quote.to, new bignumber_js_1.BigNumber(quote.fromAmount).toNumber());
                const isMultiLayered = feePricesL1 && (0, cryptoassets_1.getChain)(network, chain).isMultiLayered;
                const l1GasLimit = isMultiLayered
                    ? (0, asset_1.isERC20)(quote.from)
                        ? new bignumber_js_1.default(optimismL1GasLimits.approve + optimismL1GasLimits.send)
                        : new bignumber_js_1.default(optimismL1GasLimits.send)
                    : new bignumber_js_1.default(0);
                const multiplier = chainToGasMultiplier[chainId] || 1.5;
                feePrices.forEach((feePrice, index) => {
                    let fee = new bignumber_js_1.default(0);
                    if (isMultiLayered) {
                        const gasPriceL1 = new bignumber_js_1.default(feePricesL1[index]).times(1e9);
                        fee = fee.plus(new bignumber_js_1.default(l1GasLimit).times(multiplier).times(gasPriceL1));
                    }
                    const gasPrice = new bignumber_js_1.default(feePrice).times(1e9);
                    fee = fee.plus(new bignumber_js_1.default(tradeData === null || tradeData === void 0 ? void 0 : tradeData.estimatedGas).times(multiplier).times(gasPrice));
                    fees[feePrice] = (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[nativeAsset], fee);
                });
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
    _getQuote(chainIdFrom, from, to, amount) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fromToken = cryptoassets_2.default[from].contractAddress;
            const toToken = cryptoassets_2.default[to].contractAddress;
            const referrerAddress = (_a = this.config.referrerAddress) === null || _a === void 0 ? void 0 : _a[cryptoassets_2.default[from].chain];
            const fee = referrerAddress && this.config.referrerFee;
            return yield oneInchQuoteErrorParser.wrapAsync(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield this._httpClient.nodeGet(`/${chainIdFrom}/quote`, {
                    fromTokenAddress: fromToken || NATIVE_ASSET_ADDRESS,
                    toTokenAddress: toToken || NATIVE_ASSET_ADDRESS,
                    amount,
                    fee,
                });
            }), {
                from: from,
                to: to,
                amount: (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[from], amount).toString(),
                balance: 'NA',
            });
        });
    }
    _buildApproval({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fromChain = cryptoassets_2.default[quote.from].chain;
            const toChain = cryptoassets_2.default[quote.to].chain;
            const chainId = Number((0, cryptoassets_1.getChain)(network, fromChain).network.chainId);
            if (fromChain !== toChain || !supportedChains[Number(chainId)]) {
                return null;
            }
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const provider = client.chain.getProvider();
            const erc20 = new ethers.Contract(cryptoassets_2.default[quote.from].contractAddress, ERC20_json_1.default.abi, provider);
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
            const fromAddress = (0, cryptoassets_1.getChain)(network, fromChain).formatAddress(fromAddressRaw);
            const allowance = yield erc20.allowance(fromAddress, this.config.routerAddress);
            const inputAmount = ethers.BigNumber.from(new bignumber_js_1.default(quote.fromAmount).toFixed());
            if (allowance.gte(inputAmount)) {
                return {
                    status: 'APPROVE_CONFIRMED',
                };
            }
            const callData = yield oneInchApproveErrorParser.wrapAsync(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield this._httpClient.nodeGet(`/${chainId}/approve/transaction`, {
                    tokenAddress: cryptoassets_2.default[quote.from].contractAddress,
                    amount: inputAmount.toString(),
                });
            }), null);
            return callData;
        });
    }
    _buildSwap({ network, walletId, quote }) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const toChain = cryptoassets_2.default[quote.to].chain;
            const fromChain = cryptoassets_2.default[quote.from].chain;
            const chainId = Number((0, cryptoassets_1.getChain)(network, toChain).network.chainId);
            if (toChain !== fromChain || !supportedChains[Number(chainId)]) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Unsupported.SwapRoute(fromChain, toChain));
            }
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
            const fromAddress = (0, cryptoassets_1.getChain)(network, fromChain).formatAddress(fromAddressRaw);
            const swapParams = {
                fromTokenAddress: cryptoassets_2.default[quote.from].contractAddress || NATIVE_ASSET_ADDRESS,
                toTokenAddress: cryptoassets_2.default[quote.to].contractAddress || NATIVE_ASSET_ADDRESS,
                amount: quote.fromAmount,
                fromAddress: fromAddress,
                slippage: quote.slippagePercentage ? quote.slippagePercentage : SLIPPAGE_PERCENTAGE,
            };
            const referrerAddress = (_a = this.config.referrerAddress) === null || _a === void 0 ? void 0 : _a[cryptoassets_2.default[quote.from].chain];
            if (referrerAddress) {
                swapParams.referrerAddress = referrerAddress;
                swapParams.fee = this.config.referrerFee;
            }
            const swap = yield oneInchSwapErrorParser.wrapAsync(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield this._httpClient.nodeGet(`/${chainId}/swap`, swapParams); }), {
                from: quote.from,
                to: quote.to,
                amount: (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[quote.from], new bignumber_js_1.default(quote.fromAmount)).toString(),
                balance: ((_b = store_1.default.getters.accountItem(quote.fromAccountId)) === null || _b === void 0 ? void 0 : _b.balances[quote.from]) || 'NA',
            });
            if (new bignumber_js_1.default(quote.toAmount).times(1 - swapParams.slippage / 100).gt(swap === null || swap === void 0 ? void 0 : swap.toTokenAmount)) {
                throw new error_parser_1.SlippageTooHighError({
                    expectedAmount: quote.toAmount,
                    actualAmount: swap === null || swap === void 0 ? void 0 : swap.toTokenAmount,
                    currency: quote.to,
                });
            }
            return swap;
        });
    }
    waitForApproveConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.approveTxHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    return {
                        endTime: Date.now(),
                        status: 'APPROVE_CONFIRMED',
                    };
                }
            }
            catch (e) {
                if ((0, isTransactionNotFoundError_1.isTransactionNotFoundError)(e))
                    console.warn(e);
                else
                    throw e;
            }
        });
    }
    waitForSwapConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.swapTxHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    const { status } = tx;
                    this.updateBalances(network, walletId, [swap.fromAccountId]);
                    return {
                        endTime: Date.now(),
                        status: status === types_1.TxStatus.Success ? 'SUCCESS' : 'FAILED',
                    };
                }
            }
            catch (e) {
                if ((0, isTransactionNotFoundError_1.isTransactionNotFoundError)(e))
                    console.warn(e);
                else
                    throw e;
            }
        });
    }
    performNextSwapAction(store, { network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (swap.status) {
                case 'WAITING_FOR_APPROVE_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForApproveConfirmations({ swap, network, walletId }); }));
                case 'APPROVE_CONFIRMED':
                    return (0, utils_1.withLock)(store, { item: swap, network, walletId, asset: swap.from }, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.sendSwap({ quote: swap, network, walletId }); }));
                case 'WAITING_FOR_SWAP_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForSwapConfirmations({ swap, network, walletId }); }));
            }
        });
    }
    _getStatuses() {
        return {
            WAITING_FOR_APPROVE_CONFIRMATIONS: {
                step: 0,
                label: 'Approving {from}',
                filterStatus: 'PENDING',
                notification(swap) {
                    return {
                        message: `Approving ${swap.from}`,
                    };
                },
            },
            APPROVE_CONFIRMED: {
                step: 1,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
            },
            WAITING_FOR_SWAP_CONFIRMATIONS: {
                step: 1,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Engaging oneinch',
                    };
                },
            },
            SUCCESS: {
                step: 2,
                label: 'Completed',
                filterStatus: 'COMPLETED',
                notification(swap) {
                    return {
                        message: `Swap completed, ${(0, coinFormatter_1.prettyBalance)(swap.toAmount, swap.to)} ${swap.to} ready to use`,
                    };
                },
            },
            FAILED: {
                step: 2,
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
        return ['APPROVE', 'SWAP'];
    }
    _totalSteps() {
        return 3;
    }
}
exports.OneinchSwapProvider = OneinchSwapProvider;
//# sourceMappingURL=OneinchSwapProvider.js.map