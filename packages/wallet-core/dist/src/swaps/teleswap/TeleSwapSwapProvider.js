"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeleSwapSwapProvider = exports.TeleSwapTxTypes = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const isTransactionNotFoundError_1 = require("../../utils/isTransactionNotFoundError");
const UniswapV2Factory_json_1 = tslib_1.__importDefault(require("@uniswap/v2-core/build/UniswapV2Factory.json"));
const UniswapV2Router02_json_1 = tslib_1.__importDefault(require("@uniswap/v2-periphery/build/UniswapV2Router02.json"));
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const ethers = tslib_1.__importStar(require("ethers"));
const lodash_1 = require("lodash");
const uuid_1 = require("uuid");
const build_config_1 = tslib_1.__importDefault(require("../../build.config"));
const utils_1 = require("../../store/actions/performNextAction/utils");
const types_1 = require("../../store/types");
const coinFormatter_1 = require("../../utils/coinFormatter");
const cryptoassets_2 = tslib_1.__importDefault(require("../../utils/cryptoassets"));
const SwapProvider_1 = require("../SwapProvider");
const scripts_1 = require("@sinatdt/scripts");
const configs_1 = require("@sinatdt/configs");
const error_parser_1 = require("@liquality/error-parser");
const TRANSFER_APP_ID = 0;
const EXCHANGE_APP_ID = 1;
const SUGGESTED_DEADLINE = 100000000;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const PROTOCOL_FEE = 20;
const SLIPPAGE = 10;
const DUMMY_BYTES = '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
var TeleSwapTxTypes;
(function (TeleSwapTxTypes) {
    TeleSwapTxTypes["WRAP"] = "WRAP";
    TeleSwapTxTypes["SWAP"] = "SWAP";
})(TeleSwapTxTypes = exports.TeleSwapTxTypes || (exports.TeleSwapTxTypes = {}));
class TeleSwapSwapProvider extends SwapProvider_1.SwapProvider {
    constructor(config) {
        super(config);
        this.targetNetworkConnectionInfo = {
            web3: {
                url: "wss://polygon-mumbai.g.alchemy.com/v2/5M02lhCj_-C62MzO5TcSj53mOy-X-QPK",
            },
        };
    }
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    getQuote({ network, from, to, amount }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const api = new ethers.providers.InfuraProvider(this._getChainId(to, network), build_config_1.default.infuraApiKey);
            const percentageFee = 1;
            const amountAfterFee = (0, bignumber_js_1.default)(amount).times(10000 - Number(percentageFee) - PROTOCOL_FEE).div(10000);
            const exchangeFactory = new ethers.Contract(this.config.QuickSwapFactoryAddress, UniswapV2Factory_json_1.default.abi, api);
            const pair = yield exchangeFactory.getPair(this.getTokenAddress(to), this.getTokenAddress(from));
            if (pair == '0x0000000000000000000000000000000000000000') {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Default);
            }
            const exchangeRouter = new ethers.Contract(this.config.QuickSwapRouterAddress, UniswapV2Router02_json_1.default.abi, api);
            const fromAmountInUnit = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[from], new bignumber_js_1.default(amountAfterFee));
            console.log(fromAmountInUnit.toNumber());
            const outputAmount = yield exchangeRouter.getAmountsOut(fromAmountInUnit.toNumber(), [this.getTokenAddress(to), this.getTokenAddress(from)]);
            console.log(outputAmount);
            const toAmountInUnit = outputAmount[outputAmount.length - 1];
            console.log(toAmountInUnit);
            if (!toAmountInUnit) {
                return null;
            }
            return {
                fromAmount: fromAmountInUnit.toFixed(),
                toAmount: toAmountInUnit.toFixed()
            };
        });
    }
    sendBitcoinSwap({ quote, network, walletId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
            const to = yield this._chooseLockerAddress(Number(quote.fromAmount), network);
            const value = new bignumber_js_1.default(quote.fromAmount);
            const requestType = quote.to === "TeleBTC" ? TeleSwapTxTypes.WRAP : TeleSwapTxTypes.SWAP;
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.from, quote.toAccountId);
            const opReturnData = yield this._getOpReturnData(quote, requestType, network, fromAddressRaw);
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const fromFundTx = yield client.wallet.sendTransaction({
                to: to,
                value,
                data: opReturnData,
                fee: quote.fee,
            });
            return fromFundTx;
        });
    }
    sendSwap({ network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let bitcoinTx;
            if (swap.from === 'BTC') {
                bitcoinTx = yield this.sendBitcoinSwap({
                    quote: swap,
                    network,
                    walletId,
                });
            }
            if (!bitcoinTx) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.FailedAssert.SendTransaction);
            }
            return {
                status: 'WAITING_FOR_SEND_CONFIRMATIONS',
                swapHash: bitcoinTx.hash,
            };
        });
    }
    newSwap({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const updates = this.sendSwap({ network, walletId, swap: quote });
            return Object.assign({ id: (0, uuid_1.v4)(), fee: quote.fee }, updates);
        });
    }
    estimateFees({ network, walletId, asset, txType, quote, feePrices, max }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("we are estimateFess");
            if (txType === this._txTypes().SWAP && asset === 'BTC') {
                const client = this.getClient(network, walletId, asset, quote.fromAccountId);
                const value = max ? undefined : new bignumber_js_1.default(quote.fromAmount);
                const txs = feePrices.map((fee) => ({ to: '', value, data: DUMMY_BYTES, fee }));
                const totalFees = yield client.wallet.getTotalFees(txs, max);
                return (0, lodash_1.mapValues)(totalFees, (f) => (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[asset], f));
            }
            return null;
        });
    }
    getMin(quote) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("we are quote");
            return new bignumber_js_1.default(yield this._getTeleporterFee({ network: quote.network, from: quote.from, to: quote.to, amount: new bignumber_js_1.default(0) }));
        });
    }
    getTokenAddress(asset) {
        if (asset == 'BTC') {
            return configs_1.teleswap.tokenInfo.polygon.testnet.teleBTC;
        }
        else {
            return configs_1.teleswap.tokenInfo.polygon.testnet.link;
        }
    }
    waitForSendConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.swapTxHash);
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
    performNextSwapAction(_store, { network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (swap.status) {
                case 'WAITING_FOR_SEND_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForSendConfirmations({ swap, network, walletId }); }));
                case 'WAITING_FOR_RECEIVE':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForSendConfirmations({ swap, network, walletId }); }));
            }
        });
    }
    _getStatuses() {
        return {
            WAITING_FOR_SEND_CONFIRMATIONS: {
                step: 0,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Swap initiated',
                    };
                },
            },
            WAITING_FOR_RECEIVE: {
                step: 1,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
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
                notification(swap) {
                    let refundedTeleBTC = swap.fromAmount;
                    return {
                        message: `Swap failed, ${(0, coinFormatter_1.prettyBalance)(refundedTeleBTC, 'TeleBTC')} ${'TeleBTC'} refunded`,
                    };
                },
            },
        };
    }
    _txTypes() {
        return TeleSwapTxTypes;
    }
    _fromTxType() {
        return this._txTypes().SWAP;
    }
    _toTxType() {
        return null;
    }
    _timelineDiagramSteps() {
        return ['REQUEST', 'WAITING', 'RECEIVE'];
    }
    _totalSteps() {
        return 3;
    }
    _chooseLockerAddress(value, network) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const isMainnet = network === types_1.Network.Mainnet ? true : false;
            const lockers = yield (0, scripts_1.getLockers)({
                'amount': value,
                'type': 'transfer',
                'targetNetworkConnectionInfo': this.targetNetworkConnectionInfo,
                'testnet': isMainnet
            });
            if (!lockers.preferredLocker) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Default);
            }
            return lockers.preferredLocker.bitcoinAddress;
        });
    }
    _getChainId(asset, network) {
        const chainId = cryptoassets_2.default[asset].chain;
        const chain = (0, cryptoassets_1.getChain)(network, chainId);
        return Number(chain.network.chainId);
    }
    _getTeleporterFee(quote) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const isMainnet = quote.network === types_1.Network.Mainnet ? true : false;
            const calculatedFee = yield (0, scripts_1.calculateFee)({
                'amount': quote.amount,
                'type': 'transfer',
                'targetNetworkConnectionInfo': this.targetNetworkConnectionInfo,
                'testnet': isMainnet
            });
            return calculatedFee.lockerPercentageFee;
        });
    }
    _getOpReturnData(quote, requestType, network, recipientAddress) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const api = new ethers.providers.InfuraProvider(this._getChainId(quote.to, network), build_config_1.default.infuraApiKey);
            let isExchange;
            const chainId = 3;
            let appId;
            const speed = 0;
            let exchangeTokenAddress;
            let deadline;
            let outputAmount;
            const isFixedToken = false;
            const percentageFee = yield this._getTeleporterFee({
                network: network,
                from: quote.from,
                to: quote.to,
                amount: new bignumber_js_1.default(quote.fromAmount)
            });
            if (requestType == TeleSwapTxTypes.SWAP) {
                isExchange = true;
                appId = EXCHANGE_APP_ID;
                exchangeTokenAddress = this.getTokenAddress(quote.to);
                deadline = (yield api.getBlock('lastest')).timestamp + SUGGESTED_DEADLINE;
                outputAmount = ((_a = (yield this.getQuote({
                    network: network,
                    from: quote.from,
                    to: quote.to,
                    amount: new bignumber_js_1.default(quote.fromAmount)
                }))) === null || _a === void 0 ? void 0 : _a.toAmount) * (100 - SLIPPAGE);
            }
            else {
                isExchange = false;
                appId = TRANSFER_APP_ID;
                exchangeTokenAddress = ZERO_ADDRESS;
                deadline = 0;
                outputAmount = 0;
            }
            return this._getTransferOpReturnData(chainId, appId, recipientAddress, percentageFee, speed, isExchange, exchangeTokenAddress, outputAmount, deadline, isFixedToken);
        });
    }
    _getTransferOpReturnData(chainId, appId, recipientAddress, percentageFee, speed = 0, isExchange = false, exchangeTokenAddress = "0x0000000000000000000000000000000000000000", outputAmount = 0, deadline, isFixedToken = false) {
        let chainIdHex = Number(chainId).toString(16).padStart(2, "0");
        let appIdHex = Number(appId).toString(16).padStart(4, "0");
        let recipientAddressHex = recipientAddress.replace("0x", "").toLowerCase().padStart(40, "0");
        let percentageFeeHex = Number((percentageFee * 100).toFixed(0))
            .toString(16)
            .padStart(4, "0");
        let speedHex = speed ? "01" : "00";
        let dataHex = chainIdHex + appIdHex + recipientAddressHex + percentageFeeHex + speedHex;
        if (!isExchange) {
            if (dataHex.length !== 26 * 2)
                throw new Error("invalid data length");
            return dataHex;
        }
        let exchangeTokenAddressHex = exchangeTokenAddress
            .replace("0x", "")
            .toLowerCase()
            .padStart(40, "0");
        let outputAmountHex = Number(outputAmount).toString(16).padStart(56, "0");
        let deadlineHex = Number(deadline).toString(16).padStart(8, "0");
        let isFixedTokenHex = isFixedToken ? "01" : "00";
        dataHex = dataHex + exchangeTokenAddressHex + outputAmountHex + deadlineHex + isFixedTokenHex;
        if (dataHex.length !== 79 * 2)
            throw new Error("invalid data length");
        return dataHex;
    }
}
exports.TeleSwapSwapProvider = TeleSwapSwapProvider;
//# sourceMappingURL=TeleSwapSwapProvider.js.map