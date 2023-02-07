"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThorchainSwapProvider = exports.ThorchainTxTypes = void 0;
const tslib_1 = require("tslib");
const client_1 = require("@chainify/client");
const cryptoassets_1 = require("@liquality/cryptoassets");
const error_parser_1 = require("@liquality/error-parser");
const isTransactionNotFoundError_1 = require("../../utils/isTransactionNotFoundError");
const asgardex_util_1 = require("@thorchain/asgardex-util");
const ERC20_json_1 = tslib_1.__importDefault(require("@uniswap/v2-core/build/ERC20.json"));
const xchain_util_1 = require("@xchainjs/xchain-util");
const bignumber_js_1 = tslib_1.__importStar(require("bignumber.js"));
const ethers = tslib_1.__importStar(require("ethers"));
const lodash_1 = require("lodash");
const uuid_1 = require("uuid");
const build_config_1 = tslib_1.__importDefault(require("../../build.config"));
const store_1 = tslib_1.__importDefault(require("../../store"));
const utils_1 = require("../../store/actions/performNextAction/utils");
const asset_1 = require("../../utils/asset");
const coinFormatter_1 = require("../../utils/coinFormatter");
const cryptoassets_2 = tslib_1.__importDefault(require("../../utils/cryptoassets"));
const fees_1 = require("../../utils/fees");
const SwapProvider_1 = require("../SwapProvider");
const error_parser_2 = require("@liquality/error-parser");
const THORCHAIN_DECIMAL = 8;
const SAFE_FEE_MULTIPLIER = 1.3;
const SUPPORTED_CHAINS = [cryptoassets_1.ChainId.Bitcoin, cryptoassets_1.ChainId.Ethereum];
const OUT_MEMO_TO_STATUS = {
    OUT: 'SUCCESS',
    REFUND: 'REFUNDED',
};
const toPoolBalance = (baseAmountString) => (0, xchain_util_1.baseAmount)(baseAmountString, THORCHAIN_DECIMAL);
const toThorchainAsset = (asset) => {
    return (0, asset_1.isERC20)(asset) ? `ETH.${asset}-${cryptoassets_2.default[asset].contractAddress.toUpperCase()}` : `${asset}.${asset}`;
};
const convertBaseAmountDecimal = (amount, decimal) => {
    const decimalDiff = decimal - amount.decimal;
    const amountBN = decimalDiff < 0
        ? amount
            .amount()
            .dividedBy(new bignumber_js_1.default(Math.pow(10, (decimalDiff * -1))))
            .decimalPlaces(0, bignumber_js_1.default.ROUND_DOWN)
        : amount.amount().multipliedBy(new bignumber_js_1.default(Math.pow(10, decimalDiff)));
    return (0, xchain_util_1.baseAmount)(amountBN, decimal);
};
var ThorchainTxTypes;
(function (ThorchainTxTypes) {
    ThorchainTxTypes["SWAP"] = "SWAP";
})(ThorchainTxTypes = exports.ThorchainTxTypes || (exports.ThorchainTxTypes = {}));
class ThorchainSwapProvider extends SwapProvider_1.SwapProvider {
    constructor(config) {
        super(config);
        this.feeUnits = {
            [ThorchainTxTypes.SWAP]: {
                ETH: 200000,
                BNB: 200000,
                MATIC: 200000,
                ERC20: 100000 + 200000,
            },
        };
        this._httpClient = new client_1.HttpClient({ baseURL: this.config.thornode });
        this.thorchainAPIErrorParser = (0, error_parser_1.getErrorParser)(error_parser_1.ThorchainAPIErrorParser);
    }
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    _getPools() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.thorchainAPIErrorParser.wrapAsync(() => this._httpClient.nodeGet('/thorchain/pools'), {});
        });
    }
    _getInboundAddresses() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.thorchainAPIErrorParser.wrapAsync(() => this._httpClient.nodeGet('/thorchain/inbound_addresses'), {});
        });
    }
    _getTransaction(hash) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.thorchainAPIErrorParser.wrapAsync(() => this._httpClient.nodeGet(`/thorchain/tx/${hash}`), {
                    txHash: hash,
                });
            }
            catch (e) {
                return null;
            }
        });
    }
    getInboundAddress(chain) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const inboundAddresses = yield this._getInboundAddresses();
            const inboundAddress = inboundAddresses.find((inbound) => inbound.chain === chain);
            if (!inboundAddress)
                throw (0, error_parser_2.createInternalError)(error_parser_2.CUSTOM_ERRORS.NotFound.Thorchain.InboundAddress(chain));
            return inboundAddress;
        });
    }
    getRouterAddress(chain) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const inboundAddress = yield this.getInboundAddress(chain);
            const router = inboundAddress.router;
            if (!router)
                throw (0, error_parser_2.createInternalError)(error_parser_2.CUSTOM_ERRORS.NotFound.Thorchain.RouterAddress(chain));
            return router;
        });
    }
    getOutput({ from, to, fromAmountInUnit, slippage, network, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const pools = yield this._getPools();
            const fromPoolData = pools.find((pool) => pool.asset === toThorchainAsset(from));
            const toPoolData = pools.find((pool) => pool.asset === toThorchainAsset(to));
            if (!fromPoolData || !toPoolData)
                return null;
            if (fromPoolData.status.toLowerCase() !== 'available' || toPoolData.status.toLowerCase() !== 'available')
                return null;
            const getPool = (poolData) => {
                return {
                    assetBalance: toPoolBalance(poolData.balance_asset),
                    runeBalance: toPoolBalance(poolData.balance_rune),
                };
            };
            const fromPool = getPool(fromPoolData);
            const toPool = getPool(toPoolData);
            const baseInputAmount = (0, xchain_util_1.baseAmount)(fromAmountInUnit, cryptoassets_2.default[from].decimals);
            const inputAmount = convertBaseAmountDecimal(baseInputAmount, 8);
            const swapOutput = (0, asgardex_util_1.getDoubleSwapOutput)(inputAmount, fromPool, toPool);
            const baseNetworkFee = yield this.networkFees(to, network);
            if (!baseNetworkFee)
                throw (0, error_parser_2.createInternalError)(error_parser_2.CUSTOM_ERRORS.NotFound.Thorchain.BaseNetworkFee);
            let networkFee = convertBaseAmountDecimal(baseNetworkFee, 8);
            if ((0, asset_1.isERC20)(to)) {
                const poolData = pools.find((pool) => pool.asset === 'ETH.ETH');
                if (!poolData) {
                    throw (0, error_parser_2.createInternalError)(error_parser_2.CUSTOM_ERRORS.NotFound.Thorchain.PoolData);
                }
                const ethPool = toThorchainAsset(from) !== 'ETH.ETH' ? getPool(poolData) : fromPool;
                networkFee = (0, asgardex_util_1.getValueOfAsset1InAsset2)(networkFee, ethPool, toPool);
            }
            const receiveFeeInUnit = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[to], (0, xchain_util_1.baseToAsset)(networkFee).amount()).times(SAFE_FEE_MULTIPLIER);
            const toAmountInUnit = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[to], (0, xchain_util_1.baseToAsset)(swapOutput).amount());
            const baseOutputAmount = (0, xchain_util_1.baseAmount)(toAmountInUnit.minus(receiveFeeInUnit), cryptoassets_2.default[to].decimals);
            const slippageCoefficient = new bignumber_js_1.default(1).minus(slippage);
            const minimumOutput = baseOutputAmount.amount().multipliedBy(slippageCoefficient).dp(0);
            return minimumOutput;
        });
    }
    getQuote(quoteRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { from, to, amount, network } = quoteRequest;
            if (!SUPPORTED_CHAINS.includes(cryptoassets_2.default[from].chain) || !SUPPORTED_CHAINS.includes(cryptoassets_2.default[to].chain))
                return null;
            const min = yield this.getMin(quoteRequest);
            const slippage = new bignumber_js_1.default(amount).gt(min.times(2)) ? 0.03 : 0.05;
            const fromAmountInUnit = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[from], new bignumber_js_1.default(amount));
            const toAmountInUnit = yield this.getOutput({ from, to, fromAmountInUnit, slippage, network });
            if (!toAmountInUnit) {
                return null;
            }
            return {
                fromAmount: fromAmountInUnit.toFixed(),
                toAmount: toAmountInUnit.toFixed(),
                slippage: slippage * 1000,
            };
        });
    }
    networkFees(asset, network) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const assetCode = (0, asset_1.isERC20)(asset)
                ? (0, cryptoassets_1.getChain)(network, cryptoassets_2.default[asset].chain).nativeAsset[0].code
                : cryptoassets_2.default[asset].code;
            const gasRate = (yield this.getInboundAddress(assetCode)).gas_rate;
            if ((0, asset_1.isERC20)(asset) && (0, cryptoassets_1.getChain)(network, cryptoassets_2.default[asset].chain).isEVM) {
                return (0, xchain_util_1.baseAmount)(new bignumber_js_1.default(70000).times(gasRate).times(1000000000).times(3), 18);
            }
            if (assetCode === 'ETH') {
                return (0, xchain_util_1.baseAmount)(new bignumber_js_1.default(38000).times(gasRate).times(1000000000).times(3), 18);
            }
            if (assetCode === 'BTC') {
                return (0, xchain_util_1.baseAmount)(new bignumber_js_1.default(250).times(gasRate).times(3), 8);
            }
        });
    }
    approveTokens({ network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fromChain = cryptoassets_2.default[swap.from].chain;
            const chainNetwork = (0, cryptoassets_1.getChain)(network, fromChain).network;
            const chainId = chainNetwork.chainId;
            const api = new ethers.providers.InfuraProvider(chainId, build_config_1.default.infuraApiKey);
            const erc20 = new ethers.Contract(cryptoassets_2.default[swap.from].contractAddress, ERC20_json_1.default.abi, api);
            const fromThorchainAsset = (0, xchain_util_1.assetFromString)(toThorchainAsset(swap.from));
            if (!fromThorchainAsset) {
                throw (0, error_parser_2.createInternalError)(error_parser_2.CUSTOM_ERRORS.NotFound.Thorchain.Asset);
            }
            const routerAddress = this.getRouterAddress(fromThorchainAsset.chain);
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, swap.from, swap.toAccountId);
            const fromAddress = (0, cryptoassets_1.getChain)(network, fromChain).formatAddress(fromAddressRaw);
            const allowance = yield erc20.allowance(fromAddress, routerAddress);
            const inputAmount = ethers.BigNumber.from(new bignumber_js_1.default(swap.fromAmount).toFixed());
            if (allowance.gte(inputAmount)) {
                ``;
                return {
                    status: 'APPROVE_CONFIRMED',
                };
            }
            const inputAmountHex = inputAmount.toHexString();
            const encodedData = erc20.interface.encodeFunctionData('approve', [routerAddress, inputAmountHex]);
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            const approveTx = yield client.wallet.sendTransaction({
                to: cryptoassets_2.default[swap.from].contractAddress,
                value: new bignumber_js_1.BigNumber(0),
                data: encodedData,
                fee: swap.fee,
            });
            return {
                status: 'WAITING_FOR_APPROVE_CONFIRMATIONS',
                approveTx,
                approveTxHash: approveTx.hash,
            };
        });
    }
    sendBitcoinSwap({ quote, network, walletId, memo, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
            const fromThorchainAsset = (0, xchain_util_1.assetFromString)(toThorchainAsset(quote.from));
            if (!fromThorchainAsset) {
                throw (0, error_parser_2.createInternalError)(error_parser_2.CUSTOM_ERRORS.NotFound.Thorchain.Asset);
            }
            const to = (yield this.getInboundAddress(fromThorchainAsset.chain)).address;
            const value = new bignumber_js_1.default(quote.fromAmount);
            const encodedMemo = Buffer.from(memo, 'utf-8').toString('hex');
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const fromFundTx = yield client.wallet.sendTransaction({
                to: to,
                value,
                data: encodedMemo,
                fee: quote.fee,
            });
            return fromFundTx;
        });
    }
    sendEthereumSwap({ quote, network, walletId, memo, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
            const fromThorchainAsset = (0, xchain_util_1.assetFromString)(toThorchainAsset(quote.from));
            if (!fromThorchainAsset) {
                throw (0, error_parser_2.createInternalError)(error_parser_2.CUSTOM_ERRORS.NotFound.Thorchain.Asset);
            }
            const routerAddress = yield this.getRouterAddress(fromThorchainAsset.chain);
            const chainNetwork = (0, cryptoassets_1.getChain)(network, cryptoassets_2.default[quote.from].chain).network;
            const chainId = chainNetwork.chainId;
            const api = new ethers.providers.InfuraProvider(chainId, build_config_1.default.infuraApiKey);
            const tokenAddress = (0, asset_1.isERC20)(quote.from)
                ? cryptoassets_2.default[quote.from].contractAddress
                : '0x0000000000000000000000000000000000000000';
            const thorchainRouter = new ethers.Contract(routerAddress, ['function deposit(address payable vault, address asset, uint amount, string memory memo) external payable'], api);
            const amountHex = ethers.BigNumber.from(new bignumber_js_1.default(quote.fromAmount).toFixed()).toHexString();
            const to = (yield this.getInboundAddress(fromThorchainAsset.chain)).address;
            const encodedData = thorchainRouter.interface.encodeFunctionData('deposit', [to, tokenAddress, amountHex, memo]);
            const value = (0, asset_1.isERC20)(quote.from) ? new bignumber_js_1.BigNumber(0) : new bignumber_js_1.default(quote.fromAmount);
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const fromFundTx = yield client.wallet.sendTransaction({
                to: routerAddress,
                value,
                data: encodedData,
                fee: quote.fee,
            });
            return fromFundTx;
        });
    }
    makeMemo({ network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const toChain = cryptoassets_2.default[swap.to].chain;
            const toAddressRaw = yield this.getSwapAddress(network, walletId, swap.to, swap.toAccountId);
            const toAddress = (0, cryptoassets_1.getChain)(network, toChain).formatAddress(toAddressRaw);
            const limit = convertBaseAmountDecimal((0, xchain_util_1.baseAmount)(new bignumber_js_1.default(swap.toAmount), cryptoassets_2.default[swap.to].decimals), 8);
            const thorchainAsset = (0, xchain_util_1.assetFromString)(toThorchainAsset(swap.to));
            if (!thorchainAsset) {
                throw (0, error_parser_2.createInternalError)(error_parser_2.CUSTOM_ERRORS.NotFound.Thorchain.Asset);
            }
            return (0, asgardex_util_1.getSwapMemo)({ asset: thorchainAsset, address: toAddress, limit });
        });
    }
    sendSwap({ network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const memo = yield this.makeMemo({ network, walletId, swap });
            let fromFundTx;
            if (swap.from === 'BTC') {
                fromFundTx = yield this.sendBitcoinSwap({
                    quote: swap,
                    network,
                    walletId,
                    memo,
                });
            }
            else if (swap.from === 'ETH' || (0, asset_1.isERC20)(swap.from)) {
                fromFundTx = yield this.sendEthereumSwap({
                    quote: swap,
                    network,
                    walletId,
                    memo,
                });
            }
            if (!fromFundTx) {
                throw (0, error_parser_2.createInternalError)(error_parser_2.CUSTOM_ERRORS.FailedAssert.SendTransaction);
            }
            return {
                status: 'WAITING_FOR_SEND_CONFIRMATIONS',
                fromFundTx,
                fromFundHash: fromFundTx.hash,
            };
        });
    }
    newSwap({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const approvalRequired = (0, asset_1.isERC20)(quote.from);
            const updates = approvalRequired
                ? yield this.approveTokens({ network, walletId, swap: quote })
                : yield this.sendSwap({ network, walletId, swap: quote });
            return Object.assign({ id: (0, uuid_1.v4)(), fee: quote.fee }, updates);
        });
    }
    estimateFees({ network, walletId, asset, txType, quote, feePrices, max, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (txType === this._txTypes().SWAP && asset === 'BTC') {
                const client = this.getClient(network, walletId, asset, quote.fromAccountId);
                const value = max ? undefined : new bignumber_js_1.default(quote.fromAmount);
                const memo = yield this.makeMemo({ network, walletId, swap: quote });
                const encodedMemo = Buffer.from(memo, 'utf-8').toString('hex');
                const txs = feePrices.map((fee) => ({ to: '', value, data: encodedMemo, fee }));
                const totalFees = yield client.wallet.getTotalFees(txs, max);
                return (0, lodash_1.mapValues)(totalFees, (f) => (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[asset], f));
            }
            if (txType in this.feeUnits) {
                const fees = {};
                for (const feePrice of feePrices) {
                    fees[feePrice] = (0, fees_1.getTxFee)(this.feeUnits[txType], asset, feePrice);
                }
                return fees;
            }
            return null;
        });
    }
    getMin(quote) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fiatRates = store_1.default.state.fiatRates;
            let min = new bignumber_js_1.default('0');
            if (fiatRates && fiatRates[quote.from]) {
                min = new bignumber_js_1.default((0, coinFormatter_1.fiatToCrypto)(200, fiatRates[quote.from]));
            }
            return min;
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
    waitForSendConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.fromFundHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    return {
                        endTime: Date.now(),
                        status: 'WAITING_FOR_RECEIVE',
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
    waitForReceive({ swap, network, walletId }) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const thorchainTx = yield this._getTransaction(swap.fromFundHash);
                if (thorchainTx) {
                    const receiveHash = (_a = thorchainTx.observed_tx.out_hashes) === null || _a === void 0 ? void 0 : _a[0];
                    if (receiveHash) {
                        const thorchainReceiveTx = yield this._getTransaction(receiveHash);
                        if (thorchainReceiveTx) {
                            const memo = (_c = (_b = thorchainReceiveTx.observed_tx) === null || _b === void 0 ? void 0 : _b.tx) === null || _c === void 0 ? void 0 : _c.memo;
                            const memoAction = memo.split(':')[0];
                            let asset;
                            let accountId;
                            if (memoAction === 'OUT') {
                                asset = swap.to;
                                accountId = swap.toAccountId;
                            }
                            else if (memoAction === 'REFUND') {
                                asset = swap.from;
                                accountId = swap.fromAccountId;
                            }
                            else {
                                throw (0, error_parser_2.createInternalError)(error_parser_2.CUSTOM_ERRORS.Invalid.ThorchainMemoAction(memoAction));
                            }
                            const client = this.getClient(network, walletId, asset, accountId);
                            const receiveTx = yield client.chain.getTransactionByHash(receiveHash);
                            if (receiveTx && receiveTx.confirmations && receiveTx.confirmations > 0) {
                                this.updateBalances(network, walletId, [accountId]);
                                const status = OUT_MEMO_TO_STATUS[memoAction];
                                return {
                                    receiveTxHash: receiveTx.hash,
                                    receiveTx: receiveTx,
                                    endTime: Date.now(),
                                    status,
                                };
                            }
                            else {
                                return {
                                    receiveTxHash: receiveTx.hash,
                                    receiveTx: receiveTx,
                                };
                            }
                        }
                    }
                }
            }
            catch (e) {
                console.error(`Thorchain waiting for receive failed ${swap.fromFundHash}`, e);
            }
        });
    }
    performNextSwapAction(store, { network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (swap.status) {
                case 'WAITING_FOR_APPROVE_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForApproveConfirmations({ swap, network, walletId }); }));
                case 'APPROVE_CONFIRMED':
                    return (0, utils_1.withLock)(store, { item: swap, network, walletId, asset: swap.from }, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.sendSwap({ swap, network, walletId }); }));
                case 'WAITING_FOR_SEND_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForSendConfirmations({ swap, network, walletId }); }));
                case 'WAITING_FOR_RECEIVE':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForReceive({ swap, network, walletId }); }));
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
            WAITING_FOR_SEND_CONFIRMATIONS: {
                step: 1,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Swap initiated',
                    };
                },
            },
            WAITING_FOR_RECEIVE: {
                step: 2,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
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
            REFUNDED: {
                step: 3,
                label: 'Refunded',
                filterStatus: 'REFUNDED',
                notification() {
                    return {
                        message: 'Swap refunded',
                    };
                },
            },
        };
    }
    _txTypes() {
        return ThorchainTxTypes;
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
exports.ThorchainSwapProvider = ThorchainSwapProvider;
//# sourceMappingURL=ThorchainSwapProvider.js.map