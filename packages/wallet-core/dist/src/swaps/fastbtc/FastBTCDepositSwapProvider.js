"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastBTCDepositSwapProvider = exports.FastBtcType = exports.FastBtcStatus = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const isTransactionNotFoundError_1 = require("../../utils/isTransactionNotFoundError");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const lodash_1 = require("lodash");
const socket_io_client_1 = require("socket.io-client");
const uuid_1 = require("uuid");
const utils_1 = require("../../store/actions/performNextAction/utils");
const coinFormatter_1 = require("../../utils/coinFormatter");
const cryptoassets_2 = tslib_1.__importDefault(require("../../utils/cryptoassets"));
const SwapProvider_1 = require("../SwapProvider");
const FAST_BTC_SATOSHI_FEE = 5000;
const FAST_BTC_PERCENTAGE_FEE = 0.2;
var FastBtcStatus;
(function (FastBtcStatus) {
    FastBtcStatus["Confirmed"] = "confirmed";
})(FastBtcStatus = exports.FastBtcStatus || (exports.FastBtcStatus = {}));
var FastBtcType;
(function (FastBtcType) {
    FastBtcType["Deposit"] = "deposit";
    FastBtcType["Transfer"] = "transfer";
})(FastBtcType = exports.FastBtcType || (exports.FastBtcType = {}));
class FastBTCDepositSwapProvider extends SwapProvider_1.SwapProvider {
    connectSocket() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.socketConnection && this.socketConnection.connected)
                return true;
            return new Promise((resolve) => {
                this.socketConnection = (0, socket_io_client_1.io)(this.config.bridgeEndpoint, {
                    reconnectionDelayMax: 10000,
                });
                this.socketConnection.on('connect', function () {
                    resolve(true);
                });
                this.socketConnection.on('disconnect', function () {
                    console.warn('FastBtc socket disconnected');
                });
            });
        });
    }
    getClient(network, walletId, asset, accountId) {
        return super.getClient(network, walletId, asset, accountId);
    }
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const validAmountRange = yield this._getTxAmount();
            return [
                {
                    from: 'BTC',
                    to: 'RBTC',
                    rate: '0.998',
                    max: (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default.BTC, new bignumber_js_1.default(validAmountRange.max)).toFixed(),
                    min: (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default.BTC, new bignumber_js_1.default(validAmountRange.min)).toFixed(),
                },
            ];
        });
    }
    _getHistory(address) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.connectSocket();
            return new Promise((resolve, reject) => {
                this.socketConnection.emit('getDepositHistory', address, (res) => {
                    if (res && res.error) {
                        reject(res.err);
                    }
                    resolve(res);
                });
            });
        });
    }
    _getAddress(address) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.connectSocket();
            return new Promise((resolve, reject) => {
                this.socketConnection.emit('getDepositAddress', address, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res);
                });
            });
        });
    }
    _getTxAmount() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.connectSocket();
            return new Promise((resolve) => {
                this.socketConnection.emit('txAmount', (res) => {
                    resolve(res);
                });
            });
        });
    }
    getQuote(quoteRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { from, to, amount } = quoteRequest;
            if (from !== 'BTC' || to !== 'RBTC') {
                return null;
            }
            const fromAmountInUnit = new bignumber_js_1.default((0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[from], new bignumber_js_1.default(amount)));
            const validAmountRange = yield this._getTxAmount();
            const isQuoteAmountInTheRange = amount.lte(validAmountRange.max) && amount.gte(validAmountRange.min);
            if (!isQuoteAmountInTheRange) {
                return null;
            }
            const toAmountInUnit = new bignumber_js_1.default((0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[to], new bignumber_js_1.default(amount).minus((0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[from], FAST_BTC_SATOSHI_FEE)))).times(1 - FAST_BTC_PERCENTAGE_FEE / 100);
            return {
                fromAmount: fromAmountInUnit.toFixed(),
                toAmount: toAmountInUnit.toFixed(),
            };
        });
    }
    sendSwap({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (quote.from !== 'BTC' || quote.to !== 'RBTC') {
                return null;
            }
            const toChain = cryptoassets_2.default[quote.to].chain;
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const toAddressRaw = yield this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);
            const toAddress = (0, cryptoassets_1.getChain)(network, toChain).formatAddress(toAddressRaw);
            const relayAddress = yield this._getAddress(toAddress);
            yield this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
            const swapTx = yield client.wallet.sendTransaction({
                to: relayAddress.btcadr,
                value: new bignumber_js_1.default(quote.fromAmount),
                data: '',
                fee: quote.fee,
            });
            return {
                status: 'WAITING_FOR_SEND_CONFIRMATIONS',
                swapTx,
                swapTxHash: swapTx.hash,
            };
        });
    }
    newSwap({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const updates = yield this.sendSwap({ network, walletId, quote });
            return Object.assign({ id: (0, uuid_1.v4)(), fee: quote.fee, slippage: 50 }, updates);
        });
    }
    estimateFees({ network, walletId, asset, txType, quote, feePrices, max }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (txType === this._txTypes().SWAP && asset === 'BTC') {
                const client = this.getClient(network, walletId, asset, quote.fromAccountId);
                const value = max ? undefined : new bignumber_js_1.default(quote.fromAmount);
                const txs = feePrices.map((fee) => ({ to: '', value, fee }));
                const totalFees = yield client.wallet.getTotalFees(txs, max);
                return (0, lodash_1.mapValues)(totalFees, (f) => (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[asset], f));
            }
            return null;
        });
    }
    getMin(_quoteRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const validAmountRange = yield this._getTxAmount();
            return new bignumber_js_1.default(validAmountRange.min);
        });
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
    waitForReceive({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const toChain = cryptoassets_2.default[swap.to].chain;
                const toAddressRaw = yield this.getSwapAddress(network, walletId, swap.to, swap.toAccountId);
                const toAddress = (0, cryptoassets_1.getChain)(network, toChain).formatAddress(toAddressRaw);
                const addressHistory = (yield this._getHistory(toAddress)).sort((a, b) => new Date(a.dateAdded).getTime() > new Date(b.dateAdded).getTime() ? 1 : -1);
                let isDepositConfirmed = false;
                let isReceiveConfirmed = false;
                let depositConfirmationDate = 0;
                let depositAmount = 0;
                for (const transaction of addressHistory) {
                    if (transaction.txHash === swap.swapTxHash &&
                        transaction.status === FastBtcStatus.Confirmed &&
                        transaction.type === FastBtcType.Deposit) {
                        isDepositConfirmed = true;
                        depositConfirmationDate = new Date(transaction.dateAdded).getTime();
                        depositAmount = transaction.valueBtc;
                    }
                    else if (isDepositConfirmed &&
                        transaction.status === FastBtcStatus.Confirmed &&
                        transaction.type === FastBtcType.Transfer &&
                        transaction.valueBtc === depositAmount &&
                        new Date(transaction.dateAdded).getTime() - depositConfirmationDate > 0 &&
                        new Date(transaction.dateAdded).getTime() - depositConfirmationDate < 86400000) {
                        isReceiveConfirmed = true;
                    }
                }
                if (isDepositConfirmed && isReceiveConfirmed) {
                    return {
                        endTime: Date.now(),
                        status: 'SUCCESS',
                    };
                }
            }
            catch (e) {
                console.warn(e);
            }
        });
    }
    performNextSwapAction(_store, { network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (swap.status) {
                case 'WAITING_FOR_SEND_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForSendConfirmations({ swap, network, walletId }); }));
                case 'WAITING_FOR_RECEIVE':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForReceive({ swap, network, walletId }); }));
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
        return ['SWAP'];
    }
    _totalSteps() {
        return 3;
    }
}
exports.FastBTCDepositSwapProvider = FastBTCDepositSwapProvider;
//# sourceMappingURL=FastBTCDepositSwapProvider.js.map