"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeBridgeSwapProvider = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const bignumber_js_1 = tslib_1.__importStar(require("bignumber.js"));
const SwapProvider_1 = require("../SwapProvider");
const uuid_1 = require("uuid");
const cryptoassets_1 = require("@liquality/cryptoassets");
const utils_1 = require("../../store/actions/performNextAction/utils");
const coinFormatter_1 = require("../../utils/coinFormatter");
const ethers = tslib_1.__importStar(require("ethers"));
const ERC20_json_1 = tslib_1.__importDefault(require("@uniswap/v2-core/build/ERC20.json"));
const SignatureVerifier_json_1 = tslib_1.__importDefault(require("./abi/SignatureVerifier.json"));
const DeBridgeGate_json_1 = tslib_1.__importDefault(require("./abi/DeBridgeGate.json"));
const cryptoassets_2 = tslib_1.__importDefault(require("../../utils/cryptoassets"));
const asset_1 = require("../../utils/asset");
const error_parser_1 = require("@liquality/error-parser");
const error_parser_2 = require("@liquality/error-parser");
const isTransactionNotFoundError_1 = require("../../utils/isTransactionNotFoundError");
const zeroAddress = '0x0000000000000000000000000000000000000000';
const slippagePercentage = 3;
const slippageBps = slippagePercentage * 100;
const chainIds = [1, 56, 137, 42161, 43114];
class DeBridgeSwapProvider extends SwapProvider_1.SwapProvider {
    constructor(config) {
        super(config);
        this.debridgeApiErrorParser = (0, error_parser_1.getErrorParser)(error_parser_2.DebridgeAPIErrorParser);
    }
    getQuote({ network, from, to, amount }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(0, asset_1.isChainEvmCompatible)(from, network) || !(0, asset_1.isChainEvmCompatible)(to, network) || new bignumber_js_1.BigNumber(amount).lte(0)) {
                return null;
            }
            const chainIdFrom = (0, cryptoassets_1.getChain)(network, cryptoassets_2.default[from].chain).network.chainId;
            const chainIdTo = (0, cryptoassets_1.getChain)(network, cryptoassets_2.default[to].chain).network.chainId;
            if (chainIdTo === chainIdFrom) {
                return null;
            }
            if (!chainIds.includes(chainIdFrom) || !chainIds.includes(chainIdTo)) {
                return null;
            }
            const fromAmountInUnit = new bignumber_js_1.default((0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[from], new bignumber_js_1.default(amount)));
            try {
                const fromToken = cryptoassets_2.default[from].contractAddress || zeroAddress;
                const toToken = cryptoassets_2.default[to].contractAddress || zeroAddress;
                const trade = (yield this.debridgeApiErrorParser.wrapAsync(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return yield (0, axios_1.default)({
                        url: this.config.url + 'estimation',
                        method: 'get',
                        params: {
                            srcChainId: chainIdFrom,
                            srcChainTokenIn: fromToken,
                            srcChainTokenInAmount: fromAmountInUnit.toFixed(),
                            slippage: slippagePercentage,
                            dstChainId: chainIdTo,
                            dstChainTokenOut: toToken,
                        },
                    });
                }), null));
                return {
                    from,
                    to,
                    fromAmount: fromAmountInUnit.toFixed(),
                    toAmount: (0, bignumber_js_1.default)(trade.data.estimation.dstChainTokenOut.amount).toFixed(),
                };
            }
            catch (e) {
                return null;
            }
        });
    }
    estimateFees({ network, walletId, asset, quote, feePrices }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const nativeAsset = (0, cryptoassets_1.getChain)(network, cryptoassets_2.default[asset].chain).nativeAsset;
                const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
                let gasLimit = 0;
                if (yield this.requiresApproval({ network, walletId, quote })) {
                    const approvalTx = yield this.buildApprovalTx({
                        network,
                        walletId,
                        quote,
                    });
                    const rawApprovalTx = {
                        from: approvalTx.from,
                        to: approvalTx.to,
                        data: approvalTx.data,
                        value: '0x' + approvalTx.value.toString(16),
                    };
                    gasLimit += (yield client.chain.getProvider().estimateGas(rawApprovalTx)).toNumber();
                }
                const swapTx = yield this.loadSwapTx({ network, walletId, quote });
                const toChain = cryptoassets_2.default[quote.to].chain;
                const fromChain = cryptoassets_2.default[quote.from].chain;
                if (toChain === fromChain)
                    return null;
                const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
                const fromAddress = (0, cryptoassets_1.getChain)(network, toChain).formatAddress(fromAddressRaw);
                const rawSwapTx = {
                    from: fromAddress,
                    to: swapTx.to,
                    value: '0x' + Number(swapTx.value).toString(16),
                    data: swapTx.data,
                };
                try {
                    gasLimit += (yield client.chain.getProvider().estimateGas(rawSwapTx)).toNumber();
                }
                catch (e) {
                    const estimateGas = yield this.getGasLimit(network, quote.from, cryptoassets_2.default[quote.from].contractAddress || zeroAddress);
                    gasLimit += estimateGas;
                }
                let globalFee = (0, bignumber_js_1.default)(0);
                const fromToken = cryptoassets_2.default[quote.from].contractAddress || zeroAddress;
                if (fromToken === zeroAddress) {
                    const provider = client.chain.getProvider();
                    const chainIdFrom = (0, cryptoassets_1.getChain)(network, cryptoassets_2.default[quote.from].chain).network.chainId;
                    const debridgeGate = new ethers.Contract(this.config.chains[chainIdFrom].deBridgeGateAddress, DeBridgeGate_json_1.default.abi, provider);
                    globalFee = (yield debridgeGate.globalFixedNativeFee()) || 0;
                }
                const fees = {};
                for (const feePrice of feePrices) {
                    const gasPrice = (0, bignumber_js_1.default)(feePrice).times(1e9);
                    const fee = (0, bignumber_js_1.default)(gasLimit).times(1.3).times(gasPrice).plus(globalFee.toString());
                    fees[feePrice] = (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[nativeAsset[0].code], fee);
                }
                return fees;
            }
            catch (e) {
                console.warn(e);
            }
            return null;
        });
    }
    newSwap({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const approvalRequired = (0, asset_1.isERC20)(quote.from);
            const updates = approvalRequired
                ? yield this.approveTokens({ network, walletId, quote })
                : yield this.sendSwap({ network, walletId, quote });
            return Object.assign({ id: (0, uuid_1.v4)(), fee: quote.fee, slippage: slippageBps }, updates);
        });
    }
    performNextSwapAction(store, { network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let updates;
            switch (swap.status) {
                case 'WAITING_FOR_APPROVE_CONFIRMATIONS':
                    updates = yield (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForApproveConfirmations({ swap, network, walletId }); }));
                    break;
                case 'APPROVE_CONFIRMED':
                    updates = yield (0, utils_1.withLock)(store, { item: swap, network, walletId, asset: swap.from }, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.sendSwap({ quote: swap, network, walletId }); }));
                    break;
                case 'WAITING_FOR_SEND_SWAP_CONFIRMATIONS':
                    updates = yield (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForSwapConfirmations({ swap, network, walletId }); }));
                    break;
                case 'WAITING_FOR_RECEIVE_SWAP_CONFIRMATIONS':
                    updates = yield (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForSwapExecution({ swap, network, walletId }); }));
                    break;
            }
            return updates;
        });
    }
    waitForSwapConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.fromFundHash);
                const chainIdFrom = (0, cryptoassets_1.getChain)(network, cryptoassets_2.default[swap.from].chain).network.chainId;
                if (chainIdFrom &&
                    tx &&
                    tx.confirmations &&
                    tx.confirmations > this.config.chains[chainIdFrom].minBlockConfirmation) {
                    const { status } = yield client.chain.getProvider().getTransactionReceipt(swap.fromFundHash);
                    this.updateBalances(network, walletId, [swap.fromAccountId]);
                    if (Number(status) === 1) {
                        const provider = client.chain.getProvider();
                        const signatureVerifier = new ethers.Contract(this.config.chains[chainIdFrom].signatureVerifier, SignatureVerifier_json_1.default.abi, provider);
                        const minConfirmations = yield signatureVerifier.minConfirmations();
                        const count = yield this.getConfirmationsCount(swap.fromFundHash);
                        if (count >= minConfirmations) {
                            return {
                                endTime: Date.now(),
                                status: 'WAITING_FOR_RECEIVE_SWAP_CONFIRMATIONS',
                            };
                        }
                    }
                    else {
                        return {
                            endTime: Date.now(),
                            status: 'FAILED',
                        };
                    }
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
    getConfirmationsCount(swapTxHash) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const submissionId = yield this.getSubmissionId(swapTxHash);
                if (submissionId) {
                    const result = yield (0, axios_1.default)({
                        url: this.config.api + 'SubmissionConfirmations/getForSubmission',
                        method: 'get',
                        params: {
                            submissionId: submissionId,
                        },
                    });
                    if (Array.isArray(result === null || result === void 0 ? void 0 : result.data)) {
                        return result.data.length;
                    }
                }
            }
            catch (e) {
                console.warn(e);
            }
            return 0;
        });
    }
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    getMin(_quoteRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new bignumber_js_1.default(0);
        });
    }
    getClient(network, walletId, asset, accountId) {
        return super.getClient(network, walletId, asset, accountId);
    }
    buildApprovalTx({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const provider = client.chain.getProvider();
            cryptoassets_2.default[quote.from].contractAddress;
            const erc20 = new ethers.Contract(cryptoassets_2.default[quote.from].contractAddress, ERC20_json_1.default.abi, provider);
            const inputAmount = ethers.BigNumber.from((0, bignumber_js_1.default)(quote.fromAmount).toFixed());
            const inputAmountHex = inputAmount.toHexString();
            const encodedData = erc20.interface.encodeFunctionData('approve', [this.config.routerAddress, inputAmountHex]);
            const fromChain = cryptoassets_2.default[quote.from].chain;
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
            const fromAddress = (0, cryptoassets_1.getChain)(network, fromChain).formatAddress(fromAddressRaw);
            return {
                from: fromAddress,
                to: cryptoassets_2.default[quote.from].contractAddress,
                value: new bignumber_js_1.BigNumber(0).toFixed(),
                data: encodedData,
                fee: quote.fee,
            };
        });
    }
    requiresApproval({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(0, asset_1.isERC20)(quote.from))
                return false;
            const fromChain = cryptoassets_2.default[quote.from].chain;
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const provider = client.chain.getProvider();
            const erc20 = new ethers.Contract(cryptoassets_2.default[quote.from].contractAddress, ERC20_json_1.default.abi, provider);
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
            const fromAddress = (0, cryptoassets_1.getChain)(network, fromChain).formatAddress(fromAddressRaw);
            const allowance = yield erc20.allowance(fromAddress, this.config.routerAddress);
            const inputAmount = ethers.BigNumber.from((0, bignumber_js_1.default)(quote.fromAmount).toFixed());
            return !allowance.gte(inputAmount);
        });
    }
    approveTokens({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(yield this.requiresApproval({ network, walletId, quote }))) {
                return {
                    status: 'APPROVE_CONFIRMED',
                };
            }
            const txData = yield this.buildApprovalTx({ network, walletId, quote });
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const approveTx = yield client.wallet.sendTransaction(txData);
            return {
                status: 'WAITING_FOR_APPROVE_CONFIRMATIONS',
                approveTx,
                approveTxHash: approveTx.hash,
            };
        });
    }
    loadSwapTx({ network, walletId, quote }) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const toChain = cryptoassets_2.default[quote.to].chain;
            const fromChain = cryptoassets_2.default[quote.from].chain;
            if (toChain === fromChain)
                return null;
            const toAddress = yield this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);
            const chainIdFrom = (0, cryptoassets_1.getChain)(network, cryptoassets_2.default[quote.from].chain).network.chainId;
            const chainIdTo = (0, cryptoassets_1.getChain)(network, cryptoassets_2.default[quote.to].chain).network.chainId;
            const fromToken = cryptoassets_2.default[quote.from].contractAddress || zeroAddress;
            const toToken = cryptoassets_2.default[quote.to].contractAddress || zeroAddress;
            const result = (yield this.debridgeApiErrorParser.wrapAsync(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield (0, axios_1.default)({
                    url: this.config.url + 'transaction',
                    method: 'get',
                    params: {
                        srcChainId: chainIdFrom,
                        srcChainTokenIn: fromToken,
                        srcChainTokenInAmount: quote.fromAmount,
                        slippage: slippagePercentage,
                        dstChainId: chainIdTo,
                        dstChainTokenOut: toToken,
                        dstChainTokenOutRecipient: toAddress,
                        dstChainFallbackAddress: toAddress,
                    },
                });
            }), null));
            if ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.tx) {
                const estimation = (_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.estimation;
                const txInfo = Object.assign(Object.assign({}, result.data.tx), { amount: estimation === null || estimation === void 0 ? void 0 : estimation.dstChainTokenOut.amount });
                if ((estimation === null || estimation === void 0 ? void 0 : estimation.srcChainTokenIn) && (estimation === null || estimation === void 0 ? void 0 : estimation.srcChainTokenOut)) {
                    txInfo.preSwap = {
                        toAddress: estimation === null || estimation === void 0 ? void 0 : estimation.srcChainTokenOut.address,
                        fromAddress: estimation === null || estimation === void 0 ? void 0 : estimation.srcChainTokenIn.address,
                    };
                }
                return txInfo;
            }
            return null;
        });
    }
    sendSwap({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const trade = yield this.loadSwapTx({ network, walletId, quote });
            if ((0, bignumber_js_1.default)(quote.toAmount)
                .times(1 - slippagePercentage / 100)
                .gt(trade.amount)) {
                throw new error_parser_1.SlippageTooHighError({
                    expectedAmount: quote.toAmount,
                    actualAmount: trade.amount,
                    currency: quote.to,
                });
            }
            yield this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
            try {
                const fromFundTx = yield client.wallet.sendTransaction({
                    to: trade.to,
                    value: trade.value,
                    data: trade.data,
                    fee: quote.fee,
                });
                return {
                    status: 'WAITING_FOR_SEND_SWAP_CONFIRMATIONS',
                    fromFundTx,
                    fromFundHash: fromFundTx.hash,
                };
            }
            catch (e) {
                console.warn(e);
                if (e.reason) {
                    throw new Error(e.reason);
                }
                throw e;
            }
        });
    }
    waitForApproveConfirmations({ swap, network, walletId, }) {
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
    waitForSwapExecution({ swap, network, walletId }) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const submissionInfo = yield this.getFullSubmissionInfo(swap.fromFundHash);
                if (((_a = submissionInfo === null || submissionInfo === void 0 ? void 0 : submissionInfo.send) === null || _a === void 0 ? void 0 : _a.isExecuted) && (submissionInfo === null || submissionInfo === void 0 ? void 0 : submissionInfo.claim)) {
                    const client = this.getClient(network, walletId, swap.to, swap.toAccountId);
                    const tx = yield client.chain.getTransactionByHash(submissionInfo === null || submissionInfo === void 0 ? void 0 : submissionInfo.claim.transactionHash);
                    this.updateBalances(network, walletId, [swap.fromAccountId]);
                    return {
                        receiveTxHash: tx.hash,
                        receiveTx: tx,
                        endTime: Date.now(),
                        status: tx.status,
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
    getFullSubmissionInfo(swapTxHash) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, axios_1.default)({
                    url: this.config.api + 'Transactions/GetFullSubmissionInfo',
                    method: 'get',
                    params: {
                        filter: swapTxHash,
                        filterType: 1,
                    },
                });
                return (result === null || result === void 0 ? void 0 : result.data) || null;
            }
            catch (e) {
                console.warn(e);
                return null;
            }
        });
    }
    getSubmissionId(swapTxHash) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, axios_1.default)({
                    url: this.config.api + 'Transactions/GetFullSubmissionInfo',
                    method: 'get',
                    params: {
                        filter: swapTxHash,
                        filterType: 1,
                    },
                });
                return ((_b = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.send) === null || _b === void 0 ? void 0 : _b.submissionId) || null;
            }
            catch (e) {
                console.warn(e);
                return null;
            }
        });
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
    _totalSteps() {
        return 4;
    }
    _timelineDiagramSteps() {
        return ['APPROVE', 'INITIATION', 'RECEIVE'];
    }
    _getStatuses() {
        return {
            WAITING_FOR_APPROVE_CONFIRMATIONS: {
                step: 0,
                label: 'Approving {from} http',
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
            WAITING_FOR_SEND_SWAP_CONFIRMATIONS: {
                step: 1,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Engaging deBridge',
                    };
                },
            },
            WAITING_FOR_RECEIVE_SWAP_CONFIRMATIONS: {
                step: 2,
                label: 'Swapping {to}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Awaiting Execution',
                    };
                },
            },
            SUCCESS: {
                step: 3,
                label: 'Completed',
                filterStatus: 'COMPLETED',
                notification(swap) {
                    return {
                        message: `Swap completed, ${(0, coinFormatter_1.prettyBalance)(swap.toAmount, swap.to)} ${swap.to} ready to use`,
                    };
                },
            },
            FAILED: {
                step: 3,
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
    getGasLimit(network, from, toAddress) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const chainIdFrom = (0, cryptoassets_1.getChain)(network, cryptoassets_2.default[from].chain).network.chainId;
            try {
                const result = yield (0, axios_1.default)({
                    url: this.config.url + 'srcTxOptimisticGasConsumption',
                    method: 'get',
                    params: {
                        srcChainId: chainIdFrom,
                        srcChainTokenIn: toAddress,
                    },
                });
                return ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.srcTxOptimisticGasConsumption) || 0;
            }
            catch (e) {
                return 0;
            }
        });
    }
}
exports.DeBridgeSwapProvider = DeBridgeSwapProvider;
//# sourceMappingURL=DeBridgeSwapProvider.js.map