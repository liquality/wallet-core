"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeleSwapSwapProvider = exports.TeleSwapTxTypes = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const isTransactionNotFoundError_1 = require("../../utils/isTransactionNotFoundError");
const ERC20_json_1 = tslib_1.__importDefault(require("@uniswap/v2-core/build/ERC20.json"));
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
const scripts_1 = require("@teleportdao/scripts");
const configs_1 = require("@teleportdao/configs");
const bitcoin_1 = require("@teleportdao/bitcoin");
const error_parser_1 = require("@liquality/error-parser");
const SUPPORTED_CHAINS = [
    [cryptoassets_1.ChainId.Bitcoin, cryptoassets_1.ChainId.Polygon, 'testnet'],
    [cryptoassets_1.ChainId.Polygon, cryptoassets_1.ChainId.Bitcoin, 'testnet'],
    [cryptoassets_1.ChainId.Bitcoin, cryptoassets_1.ChainId.Polygon, 'mainnet'],
    [cryptoassets_1.ChainId.Polygon, cryptoassets_1.ChainId.Bitcoin, 'mainnet'],
];
const addressTypesNumber = { p2pk: 0, p2pkh: 1, p2sh: 2, p2wpkh: 3 };
const TRANSFER_APP_ID = 1;
const EXCHANGE_APP_ID = 10;
const SUGGESTED_DEADLINE = 7200;
const RELAY_FINALIZATION_PARAMETER = 5;
const ZERO_ADDRESS = '0x' + '0'.repeat(20 * 2);
const SLIPPAGE = 5;
const DUMMY_BYTES = '0x' + '0'.repeat(79 * 2);
var TeleSwapTxTypes;
(function (TeleSwapTxTypes) {
    TeleSwapTxTypes["WRAP"] = "WRAP";
    TeleSwapTxTypes["SWAP"] = "SWAP";
})(TeleSwapTxTypes = exports.TeleSwapTxTypes || (exports.TeleSwapTxTypes = {}));
class TeleSwapSwapProvider extends SwapProvider_1.SwapProvider {
    constructor(config) {
        super(config);
        this.changeEndianness = (input) => {
            const result = [];
            let len = input.length - 2;
            while (len >= 0) {
                result.push(input.substr(len, 2));
                len -= 2;
            }
            return result.join('');
        };
    }
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    isSwapSupported(from, to, network) {
        const fromChain = cryptoassets_2.default[from].chain;
        const toChain = cryptoassets_2.default[to].chain;
        const _SUPPORTED_CHAINS = SUPPORTED_CHAINS.map((item) => JSON.stringify(item));
        return _SUPPORTED_CHAINS.includes(JSON.stringify([fromChain, toChain, network]));
    }
    getQuote({ network, from, to, amount }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let fees;
            let amountAfterFee;
            let amountAfterFeeInUnit;
            const fromAmountInUnit = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[from], new bignumber_js_1.default(amount));
            if (this.isSwapSupported(from, to, network) == false) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Unsupported.Chain);
            }
            if (from == 'BTC') {
                fees = yield this.getFees({ network, from, to, amount });
                amountAfterFee = (0, bignumber_js_1.default)(amount).minus(fees.totalFeeInBTC);
                amountAfterFeeInUnit = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[from], amountAfterFee);
                let toAmountInUnit;
                if (to != 'TELEBTC') {
                    toAmountInUnit = new bignumber_js_1.default((yield this.getOutputAmountAndPath(String((0, lodash_1.floor)(amountAfterFeeInUnit.toNumber())), from, to, network)).outputAmount.toString());
                }
                else {
                    toAmountInUnit = amountAfterFeeInUnit;
                }
                return {
                    fromAmount: fromAmountInUnit.toFixed(),
                    toAmount: toAmountInUnit.toFixed(),
                };
            }
            else {
                if (from != 'TELEBTC') {
                    const teleBTCAmount = (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default['TELEBTC'], (yield this.getOutputAmountAndPath((0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[from], amount).toString(), from, 'TELEBTC', network)).outputAmount.toString());
                    fees = yield this.getFees({ network, from, to, amount: teleBTCAmount });
                    amountAfterFee = teleBTCAmount.minus(fees.totalFeeInBTC);
                    amountAfterFeeInUnit = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default['TELEBTC'], amountAfterFee);
                    return {
                        fromAmount: fromAmountInUnit.toFixed(),
                        toAmount: amountAfterFeeInUnit.toFixed(),
                    };
                }
                else {
                    fees = yield this.getFees({ network, from, to, amount });
                    amountAfterFee = (0, bignumber_js_1.default)(amount).minus(fees.totalFeeInBTC);
                    amountAfterFeeInUnit = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[from], amountAfterFee);
                    return {
                        fromAmount: fromAmountInUnit.toFixed(),
                        toAmount: amountAfterFeeInUnit.toFixed(),
                    };
                }
            }
        });
    }
    sendBitcoinSwap({ quote, network, walletId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const to = (yield this._chooseLockerAddress(quote.from, quote.to, quote.fromAmount, network)).bitcoinAddress;
            const value = new bignumber_js_1.default(quote.fromAmount);
            const requestType = quote.to == 'TELEBTC' ? TeleSwapTxTypes.WRAP : TeleSwapTxTypes.SWAP;
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);
            const opReturnData = yield this.getOpReturnData(quote, requestType, network, fromAddressRaw);
            console.log("opReturnData", opReturnData);
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            let tx;
            try {
                tx = yield client.wallet.sendTransaction({
                    to: to,
                    value,
                    data: opReturnData,
                    fee: quote.fee,
                });
            }
            catch (_a) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.FailedAssert.SendTransaction);
            }
            return {
                status: 'WAITING_FOR_SEND_CONFIRMATIONS',
                swapTxHash: tx === null || tx === void 0 ? void 0 : tx.hash,
                swapTx: tx,
                numberOfBitcoinConfirmations: 0,
            };
        });
    }
    sendBurn({ quote, network, walletId, }) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let value;
            if (quote.from != 'TELEBTC') {
                value = quote.exchangedTeleBTCAmount;
            }
            else {
                value = new bignumber_js_1.default(quote.fromAmount);
            }
            const _lockerLockingScript = (yield this._chooseLockerAddress('TELEBTC', quote.to, value.toString(), network))
                .lockerLockingScript;
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const api = new ethers.providers.InfuraProvider(this.getChainIdNumber(quote.from, network), build_config_1.default.infuraApiKey);
            const ccBurnRouterAddress = quote.network == types_1.Network.Mainnet
                ? configs_1.teleswap.contractsInfo.polygon.mainnet.ccBurnAddress
                : configs_1.teleswap.contractsInfo.polygon.testnet.ccBurnAddress;
            const ccBurnRouter = new ethers.Contract(ccBurnRouterAddress, configs_1.teleswap.ABI.CCBurnRouterABI, api);
            const inputAmountHex = '0x' + value.toNumber().toString(16);
            const networkName = quote.network == types_1.Network.Mainnet ? 'bitcoin' : 'bitcoin_testnet';
            const bitcoinNetwork = {
                name: networkName,
                connection: {
                    api: {
                        enabled: true,
                        provider: 'BlockStream',
                        token: null,
                    },
                },
            };
            const bitcoinAddressObject = new bitcoin_1.BitcoinInterface(bitcoinNetwork.connection, bitcoinNetwork.name).convertAddressToObject(fromAddressRaw);
            const _userScript = '0x' + ((_a = bitcoinAddressObject.addressObject.hash) === null || _a === void 0 ? void 0 : _a.toString('hex'));
            const _scriptType = addressTypesNumber[bitcoinAddressObject.addressType];
            const _encodedData = ccBurnRouter.interface.encodeFunctionData('ccBurn', [
                inputAmountHex,
                _userScript,
                _scriptType,
                _lockerLockingScript,
            ]);
            let tx;
            try {
                tx = yield client.wallet.sendTransaction({
                    to: ccBurnRouterAddress,
                    value: new bignumber_js_1.default(0),
                    data: _encodedData,
                });
            }
            catch (_b) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.FailedAssert.SendTransaction);
            }
            return {
                status: 'WAITING_FOR_BURN_CONFIRMATIONS',
                swapTxHash: tx === null || tx === void 0 ? void 0 : tx.hash,
                swapTx: tx,
                userBitcoinAddress: fromAddressRaw,
            };
        });
    }
    sendExchange({ quote, network, walletId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const value = new bignumber_js_1.default(quote.fromAmount);
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const api = new ethers.providers.InfuraProvider(this.getChainIdNumber(quote.from, network), build_config_1.default.infuraApiKey);
            const teleBTCAddress = cryptoassets_2.default['TELEBTC'].contractAddress;
            const erc20 = new ethers.Contract(teleBTCAddress, ERC20_json_1.default.abi, api);
            const currentBalance = (yield erc20.balanceOf(fromAddressRaw)).toString();
            const exchangeRouter = new ethers.Contract(this.config.QuickSwapRouterAddress, UniswapV2Router02_json_1.default.abi, api);
            const result = yield this.getOutputAmountAndPath(value.toString(), quote.from, 'TELEBTC', network);
            const expectedOutput = (0, lodash_1.floor)((Number(result.outputAmount.toString()) * (100 - SLIPPAGE)) / 100);
            const path = result.path;
            const inputAmountHex = '0x' + value.toNumber().toString(16);
            const outputAmountHex = '0x' + expectedOutput.toString(16);
            const deadline = (yield api.getBlock('latest')).timestamp + 120;
            let _encodedData;
            let _value;
            if (quote.from == 'MATIC') {
                _value = value;
                _encodedData = exchangeRouter.interface.encodeFunctionData('swapExactETHForTokens', [
                    outputAmountHex,
                    path,
                    fromAddressRaw,
                    deadline,
                ]);
            }
            else {
                _value = new bignumber_js_1.default(0);
                _encodedData = exchangeRouter.interface.encodeFunctionData('swapExactTokensForTokens', [
                    inputAmountHex,
                    outputAmountHex,
                    path,
                    fromAddressRaw,
                    deadline,
                ]);
            }
            let tx;
            try {
                tx = yield client.wallet.sendTransaction({
                    to: this.config.QuickSwapRouterAddress,
                    value: _value,
                    data: _encodedData,
                });
            }
            catch (_a) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.FailedAssert.SendTransaction);
            }
            return {
                status: 'WAITING_FOR_EXCHANGE_CONFIRMATIONS',
                exchangeTxHash: tx === null || tx === void 0 ? void 0 : tx.hash,
                exchangedTeleBTCAmount: new bignumber_js_1.default(currentBalance),
            };
        });
    }
    approveForExchange({ quote, network, walletId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const value = new bignumber_js_1.default(quote.fromAmount);
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const api = new ethers.providers.InfuraProvider(this.getChainIdNumber(quote.from, network), build_config_1.default.infuraApiKey);
            const erc20 = new ethers.Contract(this.getTokenAddress(quote.from, network), ERC20_json_1.default.abi, api);
            const inputAmountHex = '0x' + value.toNumber().toString(16);
            const encodedData = erc20.interface.encodeFunctionData('approve', [
                this.config.QuickSwapRouterAddress,
                inputAmountHex,
            ]);
            let exchangeApproveTx;
            try {
                exchangeApproveTx = yield client.wallet.sendTransaction({
                    to: this.getTokenAddress(quote.from, network),
                    value: new bignumber_js_1.default(0),
                    data: encodedData,
                });
            }
            catch (_a) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.FailedAssert.SendTransaction);
            }
            return {
                status: 'WAITING_FOR_EXCHANGE_APPROVE_CONFIRMATIONS',
                exchangeApproveTxHash: exchangeApproveTx === null || exchangeApproveTx === void 0 ? void 0 : exchangeApproveTx.hash,
            };
        });
    }
    approveForBurn({ quote, network, walletId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let value;
            if (quote.from != 'TELEBTC') {
                value = quote.exchangedTeleBTCAmount;
            }
            else {
                value = new bignumber_js_1.default(quote.fromAmount);
            }
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const api = new ethers.providers.InfuraProvider(this.getChainIdNumber(quote.from, network), build_config_1.default.infuraApiKey);
            const teleBTCAddress = cryptoassets_2.default['TELEBTC'].contractAddress;
            const erc20 = new ethers.Contract(teleBTCAddress, ERC20_json_1.default.abi, api);
            const inputAmountHex = '0x' + value.toNumber().toString(16);
            const ccBurnRouterAddress = quote.network == types_1.Network.Mainnet
                ? configs_1.teleswap.contractsInfo.polygon.mainnet.ccBurnAddress
                : configs_1.teleswap.contractsInfo.polygon.testnet.ccBurnAddress;
            const encodedData = erc20.interface.encodeFunctionData('approve', [ccBurnRouterAddress, inputAmountHex]);
            let approveTx;
            try {
                approveTx = yield client.wallet.sendTransaction({
                    to: teleBTCAddress,
                    value: new bignumber_js_1.default(0),
                    data: encodedData,
                });
            }
            catch (_a) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.FailedAssert.SendTransaction);
            }
            return {
                status: 'WAITING_FOR_APPROVE_CONFIRMATIONS',
                approveTxHash: approveTx === null || approveTx === void 0 ? void 0 : approveTx.hash,
            };
        });
    }
    sendSwap({ network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (swap.from == 'BTC') {
                return yield this.sendBitcoinSwap({
                    quote: swap,
                    network,
                    walletId,
                });
            }
            if (swap.from != 'TELEBTC' && swap.to == 'BTC') {
                return yield this.approveForExchange({
                    quote: swap,
                    network,
                    walletId,
                });
            }
            if (swap.from == 'TELEBTC' && swap.to == 'BTC') {
                return yield this.approveForBurn({
                    quote: swap,
                    network,
                    walletId,
                });
            }
        });
    }
    newSwap({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isSwapSupported(quote.from, quote.to, network)) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Unsupported.Chain);
            }
            const updates = yield this.sendSwap({ network, walletId, swap: quote });
            return Object.assign({ id: (0, uuid_1.v4)(), fee: quote.fee }, updates);
        });
    }
    estimateFees({ network, walletId, asset, txType, quote, feePrices, max }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            return new bignumber_js_1.default((yield this.getFees({ network: quote.network, from: quote.from, to: quote.to, amount: new bignumber_js_1.default(0) })).teleporterFeeInBTC);
        });
    }
    getTokenAddress(asset, network) {
        switch (asset) {
            case 'teleBTC':
            case 'TELEBTC':
            case 'BTC':
                return cryptoassets_2.default['TELEBTC'].contractAddress;
            case 'MATIC':
            case 'WMATIC':
            case 'PWMATIC':
                return network == types_1.Network.Mainnet
                    ? cryptoassets_2.default['PWMATIC'].contractAddress
                    : configs_1.teleswap.tokenInfo.polygon.testnet.WrappedMATICAddress;
            default:
                return network == types_1.Network.Mainnet
                    ? cryptoassets_2.default[asset].contractAddress
                    : configs_1.teleswap.tokenInfo.polygon.testnet.chainlinkAddress;
        }
    }
    waitForBitcoinConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.swapTxHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    return {
                        endTime: Date.now(),
                        status: 'WAITING_FOR_RECEIVE',
                        numberOfBitcoinConfirmations: tx.confirmations,
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const bitcoinTxConfirmations = (yield client.chain.getTransactionByHash(swap.swapTxHash)).confirmations;
                if (bitcoinTxConfirmations && bitcoinTxConfirmations >= RELAY_FINALIZATION_PARAMETER - 1) {
                    const api = new ethers.providers.InfuraProvider(this.getChainIdNumber(swap.to, network), build_config_1.default.infuraApiKey);
                    let ccRouterFactory;
                    let ccRouterFactoryAddress;
                    if (swap.to == 'TELEBTC') {
                        ccRouterFactoryAddress =
                            swap.network == types_1.Network.Mainnet
                                ? configs_1.teleswap.contractsInfo.polygon.mainnet.ccTransferAddress
                                : configs_1.teleswap.contractsInfo.polygon.testnet.ccTransferAddress;
                        ccRouterFactory = new ethers.Contract(ccRouterFactoryAddress, configs_1.teleswap.ABI.CCTransferRouterABI, api);
                    }
                    else {
                        ccRouterFactoryAddress =
                            swap.network == types_1.Network.Mainnet
                                ? configs_1.teleswap.contractsInfo.polygon.mainnet.ccExchangeAddress
                                : configs_1.teleswap.contractsInfo.polygon.testnet.ccExchangeAddress;
                        ccRouterFactory = new ethers.Contract(ccRouterFactoryAddress, configs_1.teleswap.ABI.CCExchangeRouterABI, api);
                    }
                    const result = yield ccRouterFactory.isRequestUsed('0x' + this.changeEndianness(swap.swapTxHash));
                    if (result) {
                        return {
                            endTime: Date.now(),
                            status: 'SUCCESS',
                            numberOfBitcoinConfirmations: bitcoinTxConfirmations,
                        };
                    }
                    else if (bitcoinTxConfirmations > (RELAY_FINALIZATION_PARAMETER + 1) * 2) {
                        return {
                            endTime: Date.now(),
                            status: 'FAILED',
                            numberOfBitcoinConfirmations: bitcoinTxConfirmations,
                        };
                    }
                }
                else if (bitcoinTxConfirmations && bitcoinTxConfirmations > swap.numberOfBitcoinConfirmations) {
                    return {
                        endTime: Date.now(),
                        status: 'WAITING_FOR_RECEIVE',
                        numberOfBitcoinConfirmations: bitcoinTxConfirmations,
                    };
                }
            }
            catch (e) {
                throw error_parser_1.CUSTOM_ERRORS.Unknown;
            }
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
    waitForExchangeApproveConfirmations({ swap, network, walletId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.exchangeApproveTxHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    return {
                        endTime: Date.now(),
                        status: 'EXCHANGE_APPROVE_CONFIRMED',
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
    waitForExchangeConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.exchangeTxHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    const api = new ethers.providers.InfuraProvider(this.getChainIdNumber(swap.from, network), build_config_1.default.infuraApiKey);
                    const fromAddressRaw = yield this.getSwapAddress(network, walletId, swap.from, swap.fromAccountId);
                    const teleBTCAddress = cryptoassets_2.default['TELEBTC'].contractAddress;
                    const erc20 = new ethers.Contract(teleBTCAddress, ERC20_json_1.default.abi, api);
                    const newBalance = new bignumber_js_1.default((yield erc20.balanceOf(fromAddressRaw)).toString());
                    return {
                        endTime: Date.now(),
                        status: 'EXCHANGE_CONFIRMED',
                        exchangedTeleBTCAmount: newBalance.minus(swap.exchangedTeleBTCAmount),
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
    waitForBurnConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.swapTxHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    const api = new ethers.providers.InfuraWebSocketProvider(this.getChainIdNumber(swap.from, network), build_config_1.default.infuraApiKey);
                    const ccBurnRouterAddress = network == types_1.Network.Mainnet
                        ? configs_1.teleswap.contractsInfo.polygon.mainnet.ccBurnAddress
                        : configs_1.teleswap.contractsInfo.polygon.testnet.ccBurnAddress;
                    const ccBurnRouter = new ethers.Contract(ccBurnRouterAddress, configs_1.teleswap.ABI.CCBurnRouterABI, api);
                    const fromAddressRaw = yield this.getSwapAddress(network, walletId, swap.from, swap.fromAccountId);
                    const filter = ccBurnRouter.filters.CCBurn(fromAddressRaw);
                    const receipt = yield api.getTransactionReceipt(swap.swapTxHash);
                    const logs = yield ccBurnRouter.queryFilter(filter, receipt.blockNumber, receipt.blockNumber);
                    const event = ccBurnRouter.interface.parseLog(logs[0]);
                    const burntAmount = event.args.burntAmount.toNumber();
                    return {
                        endTime: Date.now(),
                        status: 'WAITING_FOR_BURN_BITCOIN_CONFIRMATIONS',
                        toAmount: String(burntAmount),
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
    waitForBurnBitcoinConfirmations({ swap, network }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const isTestnet = network == types_1.Network.Testnet ? true : false;
                const userBurnReqs = yield (0, scripts_1.getUserPendingBurns)({
                    userBurnRequests: [
                        {
                            address: swap.userBitcoinAddress,
                            amount: Number(swap.toAmount),
                        },
                    ],
                    targetNetworkConnectionInfo: this.getTargetNetworkConnectionInfo(swap.from, swap.network),
                    testnet: isTestnet,
                    mempool: true,
                });
                if (userBurnReqs.processedBurns.length > 0) {
                    return {
                        endTime: Date.now(),
                        status: 'SUCCESS',
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
                case 'WAITING_FOR_EXCHANGE_APPROVE_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForExchangeApproveConfirmations({ swap, network, walletId }); }));
                case 'EXCHANGE_APPROVE_CONFIRMED':
                    return (0, utils_1.withLock)(store, { item: swap, network, walletId, asset: swap.from }, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.sendExchange({ quote: swap, network, walletId }); }));
                case 'WAITING_FOR_EXCHANGE_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForExchangeConfirmations({ swap, network, walletId }); }));
                case 'EXCHANGE_CONFIRMED':
                    return (0, utils_1.withLock)(store, { item: swap, network, walletId, asset: swap.from }, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.approveForBurn({ quote: swap, network, walletId }); }));
                case 'WAITING_FOR_APPROVE_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForApproveConfirmations({ swap, network, walletId }); }));
                case 'APPROVE_CONFIRMED':
                    return (0, utils_1.withLock)(store, { item: swap, network, walletId, asset: swap.from }, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.sendBurn({ quote: swap, network, walletId }); }));
                case 'WAITING_FOR_BURN_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForBurnConfirmations({ swap, network, walletId }); }));
                case 'WAITING_FOR_BURN_BITCOIN_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForBurnBitcoinConfirmations({ swap, network, walletId }); }));
                case 'WAITING_FOR_SEND_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForBitcoinConfirmations({ swap, network, walletId }); }));
                case 'WAITING_FOR_RECEIVE':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForReceive({ swap, network, walletId }); }));
            }
        });
    }
    _getStatuses() {
        return {
            WAITING_FOR_EXCHANGE_APPROVE_CONFIRMATIONS: {
                step: 0,
                label: 'Approve {from}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Swap initiated',
                    };
                },
            },
            EXCHANGE_APPROVE_CONFIRMED: {
                step: 0,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Exchange approve confirmed',
                    };
                },
            },
            WAITING_FOR_EXCHANGE_CONFIRMATIONS: {
                step: 1,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
            },
            EXCHANGE_CONFIRMED: {
                step: 1,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
            },
            WAITING_FOR_APPROVE_CONFIRMATIONS: {
                step: 0,
                label: 'Approve {from}',
                filterStatus: 'PENDING',
            },
            APPROVE_CONFIRMED: {
                step: 0,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Burn approve confirmed',
                    };
                },
            },
            WAITING_FOR_BURN_CONFIRMATIONS: {
                step: 1,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
            },
            WAITING_FOR_BURN_BITCOIN_CONFIRMATIONS: {
                step: 1,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Waiting for receiving BTC',
                    };
                },
            },
            WAITING_FOR_SEND_CONFIRMATIONS: {
                step: 0,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
            },
            WAITING_FOR_RECEIVE: {
                step: 1,
                label: 'Receiving {to}',
                filterStatus: 'PENDING',
                notification(swap) {
                    return {
                        message: `Waiting for confirmations:  ${swap.numberOfBitcoinConfirmations} / ${RELAY_FINALIZATION_PARAMETER}`,
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
                filterStatus: 'FAILED',
                notification(swap) {
                    return {
                        message: `Swap failed, please send ${swap === null || swap === void 0 ? void 0 : swap.swapTxHash} to the TeleportDAO discord`,
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
    _chooseLockerAddress(from, to, value, network) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const isTestnet = network === types_1.Network.Testnet ? true : false;
            const type = from == 'BTC' ? 'transfer' : 'burn';
            const targetNetworkConnectionInfo = from == 'BTC'
                ? this.getTargetNetworkConnectionInfo(to, network)
                : this.getTargetNetworkConnectionInfo(from, network);
            const lockers = yield (0, scripts_1.getLockers)({
                amount: (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default['BTC'], Number(value)),
                type: type,
                targetNetworkConnectionInfo: targetNetworkConnectionInfo,
                testnet: isTestnet,
            });
            if (!lockers.preferredLocker) {
                throw (0, error_parser_1.createInternalError)('Lockers capacity is low (decrease input amount)');
            }
            else {
                return {
                    bitcoinAddress: lockers.preferredLocker.bitcoinAddress,
                    lockerLockingScript: lockers.preferredLocker.lockerInfo.lockerLockingScript,
                };
            }
        });
    }
    getChainIdNumber(asset, network) {
        const chainId = cryptoassets_2.default[asset].chain;
        const chain = (0, cryptoassets_1.getChain)(network, chainId);
        return Number(chain.network.chainId);
    }
    getFees(quote) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const isTestnet = quote.network === types_1.Network.Testnet ? true : false;
            let calculatedFee;
            if (quote.from == 'BTC') {
                calculatedFee = yield (0, scripts_1.calculateFee)({
                    amount: quote.amount,
                    type: 'transfer',
                    targetNetworkConnectionInfo: this.getTargetNetworkConnectionInfo(quote.to, quote.network),
                    testnet: isTestnet,
                });
            }
            else {
                calculatedFee = yield (0, scripts_1.calculateFee)({
                    amount: quote.amount,
                    type: 'burn',
                    targetNetworkConnectionInfo: this.getTargetNetworkConnectionInfo(quote.from, quote.network),
                    testnet: isTestnet,
                });
            }
            return {
                teleporterFeeInBTC: calculatedFee.teleporterFeeInBTC || 0,
                teleporterPercentageFee: calculatedFee.teleporterPercentageFee || 0,
                totalFeeInBTC: calculatedFee.totalFeeInBTC || 0,
            };
        });
    }
    getOutputAmountAndPath(amount, from, to, network) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const api = new ethers.providers.InfuraProvider(this.getChainIdNumber(to, network), build_config_1.default.infuraApiKey);
            const exchangeFactory = new ethers.Contract(this.config.QuickSwapFactoryAddress, UniswapV2Factory_json_1.default.abi, api);
            const pair = yield exchangeFactory.getPair(this.getTokenAddress(from, network), this.getTokenAddress(to, network));
            let isDirectPair = true;
            if (pair == ZERO_ADDRESS) {
                isDirectPair = false;
                const _pair = yield exchangeFactory.getPair(this.getTokenAddress('WMATIC', network), this.getTokenAddress(to, network));
                if (_pair == ZERO_ADDRESS) {
                    throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Default);
                }
            }
            const exchangeRouter = new ethers.Contract(this.config.QuickSwapRouterAddress, UniswapV2Router02_json_1.default.abi, api);
            let _path;
            if (isDirectPair) {
                _path = [this.getTokenAddress(from, network), this.getTokenAddress(to, network)];
            }
            else {
                _path = [
                    this.getTokenAddress(from, network),
                    this.getTokenAddress('WMATIC', network),
                    this.getTokenAddress(to, network),
                ];
            }
            const outputAmount = yield exchangeRouter.getAmountsOut(amount, _path);
            return {
                outputAmount: outputAmount[outputAmount.length - 1],
                path: _path,
            };
        });
    }
    getTargetNetworkConnectionInfo(to, network) {
        const api = new ethers.providers.InfuraWebSocketProvider(this.getChainIdNumber(to, network), build_config_1.default.infuraApiKey);
        const targetNetworkConnectionInfo = {
            web3: {
                url: api.connection.url,
            },
        };
        return targetNetworkConnectionInfo;
    }
    getOpReturnData(quote, requestType, network, recipientAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const api = new ethers.providers.InfuraProvider(this.getChainIdNumber(quote.to, network), build_config_1.default.infuraApiKey);
            let isExchange;
            const chainId = this.getChainIdNumber(quote.to, types_1.Network.Mainnet);
            let appId;
            const speed = 0;
            let exchangeTokenAddress;
            let deadline;
            let outputAmount;
            const isFixedToken = true;
            const percentageFee = (yield this.getFees({
                network: network,
                from: 'BTC',
                to: quote.to,
                amount: (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default['BTC'], Number(quote.fromAmount)),
            })).teleporterPercentageFee;
            if (requestType == TeleSwapTxTypes.SWAP) {
                isExchange = true;
                appId = EXCHANGE_APP_ID;
                exchangeTokenAddress = this.getTokenAddress(quote.to, network);
                deadline = (yield api.getBlock('latest')).timestamp + SUGGESTED_DEADLINE;
                outputAmount = (0, lodash_1.floor)((Number(quote.toAmount) * (100 - SLIPPAGE)) / 100);
            }
            else {
                isExchange = false;
                appId = TRANSFER_APP_ID;
                exchangeTokenAddress = ZERO_ADDRESS;
                deadline = 0;
                outputAmount = 0;
            }
            return bitcoin_1.TeleportDaoPayment.getTransferOpReturnData({
                chainId,
                appId,
                recipientAddress,
                percentageFee,
                speed,
                isExchange,
                exchangeTokenAddress,
                outputAmount,
                deadline,
                isFixedToken,
            });
        });
    }
}
exports.TeleSwapSwapProvider = TeleSwapSwapProvider;
//# sourceMappingURL=TeleSwapSwapProvider.js.map