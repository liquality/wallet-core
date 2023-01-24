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
const scripts_1 = require("@sinatdt/scripts");
const configs_1 = require("@sinatdt/configs");
const bitcoin_1 = require("@sinatdt/bitcoin");
const error_parser_1 = require("@liquality/error-parser");
const SUPPORTED_CHAINS = [[cryptoassets_1.ChainId.Bitcoin, cryptoassets_1.ChainId.Polygon, 'testnet'], [cryptoassets_1.ChainId.Polygon, cryptoassets_1.ChainId.Bitcoin, 'testnet']];
const addressTypesNumber = { p2pk: 0, p2pkh: 1, p2sh: 2, p2wpkh: 3 };
const TRANSFER_APP_ID = 0;
const EXCHANGE_APP_ID = 1;
const SUGGESTED_DEADLINE = 100000000;
const RELAY_FINALIZATION_PARAMETER = 1;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
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
    }
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    isSwapSupported(from, to, network) {
        const fromChainId = cryptoassets_2.default[from].chain;
        const toChainId = cryptoassets_2.default[to].chain;
        const _SUPPORTED_CHAINS = SUPPORTED_CHAINS.map((item) => JSON.stringify(item));
        return _SUPPORTED_CHAINS.includes(JSON.stringify([fromChainId, toChainId, network]));
    }
    getQuote({ network, from, to, amount }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.isSwapSupported(from, to, network) == false) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Unsupported.Chain);
            }
            const fees = yield this._getFees({ network, from, to, amount });
            let amountAfterFee;
            if (from == 'BTC') {
                amountAfterFee = (0, bignumber_js_1.default)(amount).plus(fees.TransactionFeeInBTC).minus(fees.totalFeeInBTC);
            }
            else {
                amountAfterFee = (0, bignumber_js_1.default)(amount).minus(fees.totalFeeInBTC);
            }
            const amountAfterFeeInUnit = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[from], amountAfterFee);
            const fromAmountInUnit = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[from], new bignumber_js_1.default(amount));
            if (from == 'BTC' && to != 'TELEBTC') {
                const api = new ethers.providers.InfuraProvider(this._getChainIdNumber(to, network), build_config_1.default.infuraApiKey);
                const exchangeFactory = new ethers.Contract(this.config.QuickSwapFactoryAddress, UniswapV2Factory_json_1.default.abi, api);
                const pair = yield exchangeFactory.getPair(this.getTokenAddress(from), this.getTokenAddress(to));
                let isDirectPair = true;
                if (pair == '0x0000000000000000000000000000000000000000') {
                    isDirectPair = false;
                    let _pair = yield exchangeFactory.getPair(this.getTokenAddress('WMATIC'), this.getTokenAddress(to));
                    if (_pair == '0x0000000000000000000000000000000000000000') {
                        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Default);
                    }
                }
                const exchangeRouter = new ethers.Contract(this.config.QuickSwapRouterAddress, UniswapV2Router02_json_1.default.abi, api);
                let outputAmount;
                if (isDirectPair) {
                    outputAmount = yield exchangeRouter.getAmountsOut((0, lodash_1.ceil)(amountAfterFeeInUnit.toNumber()), [this.getTokenAddress(from), this.getTokenAddress(to)]);
                }
                else {
                    outputAmount = yield exchangeRouter.getAmountsOut((0, lodash_1.ceil)(amountAfterFeeInUnit.toNumber()), [this.getTokenAddress(from), this.getTokenAddress('WMATIC'), this.getTokenAddress(to)]);
                }
                const toAmountInUnit = new bignumber_js_1.default((outputAmount[outputAmount.length - 1]).toString());
                return {
                    fromAmount: fromAmountInUnit.toFixed(),
                    toAmount: toAmountInUnit.toFixed(),
                };
            }
            else if (from == 'BTC' && to == 'TELEBTC') {
                return {
                    fromAmount: fromAmountInUnit.toFixed(),
                    toAmount: amountAfterFeeInUnit.toFixed(),
                };
            }
            else {
                return {
                    fromAmount: fromAmountInUnit.toFixed(),
                    toAmount: amountAfterFeeInUnit.toFixed(),
                };
            }
        });
    }
    sendBitcoinSwap({ quote, network, walletId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
            const to = (yield this._chooseLockerAddress(quote.from, quote.fromAmount, network)).bitcoinAddress;
            const value = new bignumber_js_1.default(quote.fromAmount);
            const requestType = (quote.to == "TeleBTC" || quote.to == "TELEBTC") ? TeleSwapTxTypes.WRAP : TeleSwapTxTypes.SWAP;
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);
            const opReturnData = yield this._getOpReturnData(quote, requestType, network, fromAddressRaw);
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const tx = yield client.wallet.sendTransaction({
                to: to,
                value,
                data: opReturnData,
                fee: quote.fee,
            });
            return {
                status: 'WAITING_FOR_SEND_CONFIRMATIONS',
                bitcoinTxHash: tx.hash,
                numberOfBitcoinConfirmations: 0
            };
        });
    }
    sendBurn({ quote, network, walletId, }) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
            const _lockerLockingScript = (yield this._chooseLockerAddress(quote.from, quote.fromAmount, network)).lockerLockingScript;
            const value = new bignumber_js_1.default(quote.fromAmount);
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const api = new ethers.providers.InfuraProvider(this._getChainIdNumber(quote.from, network), build_config_1.default.infuraApiKey);
            const ccBurnRouter = new ethers.Contract(configs_1.teleswap.contractsInfo.polygon.testnet.ccBurnAddress, configs_1.teleswap.ABI.CCBurnRouterABI, api);
            const inputAmountHex = '0x' + (value.toNumber()).toString(16);
            let bitcoinNetwork = {
                "name": "bitcoin_testnet",
                "connection": {
                    "api": {
                        "enabled": true,
                        "provider": "BlockStream",
                        "token": null
                    }
                }
            };
            const userBitcoinInfo = (new bitcoin_1.BitcoinInterface(bitcoinNetwork.connection, bitcoinNetwork.name))
                .convertAddressToObject(fromAddressRaw);
            const _userScript = '0x' + ((_a = userBitcoinInfo.addressObject.hash) === null || _a === void 0 ? void 0 : _a.toString("hex"));
            const _scriptType = addressTypesNumber[userBitcoinInfo.addressType];
            const _encodedData = ccBurnRouter.interface.encodeFunctionData('ccBurn', [inputAmountHex, _userScript, _scriptType, _lockerLockingScript]);
            const burnTx = yield client.wallet.sendTransaction({
                to: configs_1.teleswap.contractsInfo.polygon.testnet.ccBurnAddress,
                value: new bignumber_js_1.default(0),
                data: _encodedData,
            });
            return {
                status: 'WAITING_FOR_BURN_CONFIRMATIONS',
                burnTxHash: burnTx.hash,
            };
        });
    }
    approveForBurn({ quote, network, walletId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
            const value = new bignumber_js_1.default(quote.fromAmount);
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const api = new ethers.providers.InfuraProvider(this._getChainIdNumber(quote.from, network), build_config_1.default.infuraApiKey);
            const erc20 = new ethers.Contract(configs_1.teleswap.tokenInfo.polygon.testnet.teleBTC, ERC20_json_1.default.abi, api);
            const inputAmountHex = '0x' + (value.toNumber()).toString(16);
            const encodedData = erc20.interface.encodeFunctionData('approve', [configs_1.teleswap.contractsInfo.polygon.testnet.ccBurnAddress, inputAmountHex]);
            const approveTx = yield client.wallet.sendTransaction({
                to: configs_1.teleswap.tokenInfo.polygon.testnet.teleBTC,
                value: new bignumber_js_1.default(0),
                data: encodedData,
            });
            return {
                status: 'WAITING_FOR_APPROVE_CONFIRMATIONS',
                approveTxHash: approveTx.hash,
            };
        });
    }
    sendSwap({ network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (swap.from === 'BTC') {
                return yield this.sendBitcoinSwap({
                    quote: swap,
                    network,
                    walletId,
                });
            }
            if (swap.from === 'TELEBTC' && swap.to === 'BTC') {
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
            return new bignumber_js_1.default((yield this._getFees({ network: quote.network, from: quote.from, to: quote.to, amount: new bignumber_js_1.default(0) })).teleporterFeeInBTC);
        });
    }
    getTokenAddress(asset) {
        switch (asset) {
            case 'TeleBTC':
            case 'TELEBTC':
            case 'BTC':
                return configs_1.teleswap.tokenInfo.polygon.testnet.teleBTC;
            case 'MATIC':
            case 'WMATIC':
                return configs_1.teleswap.tokenInfo.polygon.testnet.link;
            default:
                return configs_1.teleswap.tokenInfo.polygon.testnet.link;
        }
    }
    waitForSendConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.bitcoinTxHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    return {
                        endTime: Date.now(),
                        status: 'WAITING_FOR_RECEIVE',
                        numberOfBitcoinConfirmations: tx.confirmations
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
                const bitcoinTxConfirmations = (yield client.chain.getTransactionByHash(swap.bitcoinTxHash)).confirmations;
                if (bitcoinTxConfirmations && bitcoinTxConfirmations >= RELAY_FINALIZATION_PARAMETER) {
                    const api = new ethers.providers.InfuraProvider(this._getChainIdNumber(swap.to, network), build_config_1.default.infuraApiKey);
                    let ccRouterFactory;
                    if (swap.to == 'TeleBTC' || swap.to == 'TELEBTC') {
                        ccRouterFactory = new ethers.Contract(configs_1.teleswap.contractsInfo.polygon.testnet.ccTransferAddress, configs_1.teleswap.ABI.CCTransferRouterABI, api);
                    }
                    else {
                        ccRouterFactory = new ethers.Contract(configs_1.teleswap.contractsInfo.polygon.testnet.ccExchangeAddress, configs_1.teleswap.ABI.CCExchangeRouterABI, api);
                    }
                    const result = yield ccRouterFactory.isRequestUsed('0x' + swap.bitcoinTxHash);
                    if (result) {
                        return {
                            endTime: Date.now(),
                            status: 'SUCCESS',
                            numberOfBitcoinConfirmations: bitcoinTxConfirmations
                        };
                    }
                }
                else {
                    return {
                        endTime: Date.now(),
                        status: 'WAITING_FOR_RECEIVE',
                        numberOfBitcoinConfirmations: bitcoinTxConfirmations
                    };
                }
            }
            catch (e) {
                console.error(`TeleSwap waiting for receive failed ${swap.bitcoinTxHash}`, e);
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
    waitForBurnConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.burnTxHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
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
                case 'WAITING_FOR_APPROVE_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForApproveConfirmations({ swap, network, walletId }); }));
                case 'APPROVE_CONFIRMED':
                    return (0, utils_1.withLock)(store, { item: swap, network, walletId, asset: swap.from }, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.sendBurn({ quote: swap, network, walletId }); }));
                case 'WAITING_FOR_BURN_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForBurnConfirmations({ swap, network, walletId }); }));
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
                label: 'Approve {from}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Swap initiated',
                    };
                },
            },
            APPROVE_CONFIRMED: {
                step: 0,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Swap initiated',
                    };
                },
            },
            WAITING_FOR_BURN_CONFIRMATIONS: {
                step: 0,
                label: 'Approve {from}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Swap initiated',
                    };
                },
            },
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
                label: 'Receiving {to}',
                filterStatus: 'PENDING',
                notification(swap) {
                    return {
                        message: `Waiting for confirmations:  ${swap.numberOfBitcoinConfirmations} / 6`,
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
    _chooseLockerAddress(from, value, network) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const isMainnet = network === types_1.Network.Mainnet ? true : false;
            let type = (from == 'BTC') ? 'transfer' : 'transfer';
            let lockers = yield (0, scripts_1.getLockers)({
                'amount': (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default['BTC'], Number(value)),
                'type': type,
                'targetNetworkConnectionInfo': this.config.targetNetworkConnectionInfo,
                'testnet': !isMainnet
            });
            console.log("lockers", lockers);
            if (!lockers.preferredLocker) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Default);
            }
            else {
                return {
                    bitcoinAddress: lockers.preferredLocker.bitcoinAddress,
                    lockerLockingScript: lockers.preferredLocker.lockerInfo.lockerLockingScript
                };
            }
        });
    }
    _getChainIdNumber(asset, network) {
        const chainId = cryptoassets_2.default[asset].chain;
        const chain = (0, cryptoassets_1.getChain)(network, chainId);
        return Number(chain.network.chainId);
    }
    _getFees(quote) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const isMainnet = quote.network === types_1.Network.Mainnet ? true : false;
            let calculatedFee;
            if (quote.from == 'BTC') {
                calculatedFee = yield (0, scripts_1.calculateFee)({
                    'amount': quote.amount,
                    'type': 'transfer',
                    'targetNetworkConnectionInfo': this.config.targetNetworkConnectionInfo,
                    'testnet': !isMainnet
                });
            }
            else {
                calculatedFee = yield (0, scripts_1.calculateFee)({
                    'amount': quote.amount,
                    'type': 'burn',
                    'targetNetworkConnectionInfo': this.config.targetNetworkConnectionInfo,
                    'testnet': !isMainnet
                });
            }
            return {
                teleporterFeeInBTC: calculatedFee.teleporterFeeInBTC,
                teleporterPercentageFee: calculatedFee.teleporterPercentageFee,
                TransactionFeeInBTC: calculatedFee.TransactionFeeInBTC,
                totalFeeInBTC: calculatedFee.totalFeeInBTC,
            };
        });
    }
    _getOpReturnData(quote, requestType, network, recipientAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const api = new ethers.providers.InfuraProvider(this._getChainIdNumber(quote.to, network), build_config_1.default.infuraApiKey);
            let isExchange;
            const chainId = 137;
            let appId;
            const speed = 0;
            let exchangeTokenAddress;
            let deadline;
            let outputAmount;
            const isFixedToken = false;
            const percentageFee = (yield this._getFees({
                network: network,
                from: quote.from,
                to: quote.to,
                amount: (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[quote.from], Number(quote.fromAmount))
            })).teleporterPercentageFee;
            if (requestType == TeleSwapTxTypes.SWAP) {
                isExchange = true;
                appId = EXCHANGE_APP_ID;
                exchangeTokenAddress = this.getTokenAddress(quote.to);
                deadline = (yield api.getBlock('latest')).timestamp + SUGGESTED_DEADLINE;
                outputAmount = (0, lodash_1.ceil)(Number((yield this.getQuote({
                    network: network,
                    from: quote.from,
                    to: quote.to,
                    amount: new bignumber_js_1.default(quote.fromAmount)
                })).toAmount) * (100 - SLIPPAGE));
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