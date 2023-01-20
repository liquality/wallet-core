"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JupiterSwapProvider = void 0;
const tslib_1 = require("tslib");
const types_1 = require("@chainify/types");
const cryptoassets_1 = require("@liquality/cryptoassets");
const isTransactionNotFoundError_1 = require("../../utils/isTransactionNotFoundError");
const web3_js_1 = require("@solana/web3.js");
const axios_1 = tslib_1.__importDefault(require("axios"));
const bignumber_js_1 = tslib_1.__importStar(require("bignumber.js"));
const uuid_1 = require("uuid");
const utils_1 = require("../../store/actions/performNextAction/utils");
const coinFormatter_1 = require("../../utils/coinFormatter");
const cryptoassets_2 = tslib_1.__importDefault(require("../../utils/cryptoassets"));
const SwapProvider_1 = require("../SwapProvider");
const error_parser_1 = require("@liquality/error-parser");
const SOL_MINT_ADDRESS = 'So11111111111111111111111111111111111111112';
class JupiterSwapProvider extends SwapProvider_1.SwapProvider {
    _getStatuses() {
        return {
            WAITING_FOR_SWAP_CONFIRMATIONS: {
                step: 0,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
                notification() {
                    return { message: 'Engaging Astroport' };
                },
            },
            SUCCESS: {
                step: 1,
                label: 'Completed',
                filterStatus: 'COMPLETED',
                notification(swap) {
                    return {
                        message: `Swap completed, ${(0, coinFormatter_1.prettyBalance)(new bignumber_js_1.BigNumber(swap.toAmount), swap.to)} ${swap.to} ready to use`,
                    };
                },
            },
            FAILED: {
                step: 1,
                label: 'Swap Failed',
                filterStatus: 'REFUNDED',
                notification() {
                    return { message: 'Swap failed' };
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
    _totalSteps() {
        return 2;
    }
    _timelineDiagramSteps() {
        return ['SWAP'];
    }
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    getQuote(quoteRequest) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { from, to, amount } = quoteRequest;
            const fromInfo = cryptoassets_2.default[from];
            const toInfo = cryptoassets_2.default[to];
            if (fromInfo.chain !== cryptoassets_1.ChainId.Solana || toInfo.chain !== cryptoassets_1.ChainId.Solana || amount.lt(0)) {
                return null;
            }
            const fromAddress = fromInfo.contractAddress || SOL_MINT_ADDRESS;
            const toAddress = toInfo.contractAddress || SOL_MINT_ADDRESS;
            const fromAmountInUnit = (0, cryptoassets_1.currencyToUnit)(fromInfo, new bignumber_js_1.default(amount)).toFixed();
            const { data } = yield axios_1.default.get(`https://quote-api.jup.ag/v1/quote?inputMint=${fromAddress}&outputMint=${toAddress}&amount=${fromAmountInUnit}&slippage=0.5&`);
            if (!((_a = data.data) === null || _a === void 0 ? void 0 : _a[0])) {
                return null;
            }
            const info = data.data[0];
            return {
                from,
                to,
                fromAmount: fromAmountInUnit.toString(),
                toAmount: info.outAmount.toString(),
                info: Object.assign(Object.assign({}, info), { toAddress }),
            };
        });
    }
    newSwap(quoteInput) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { network, walletId, quote } = quoteInput;
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const connection = client.chain.getProvider();
            const [{ address }] = yield client.wallet.getAddresses();
            const transactions = yield this._getTransactions(quote.info, address);
            let swapTx;
            const txTypes = Object.keys(transactions);
            for (let i = 0; i < txTypes.length; i++) {
                const tx = web3_js_1.Transaction.from(Buffer.from(transactions[txTypes[i]], 'base64'));
                if (txTypes[i] === 'swapTransaction') {
                    swapTx = yield client.wallet.sendTransaction({ transaction: tx, value: new bignumber_js_1.default(quote.fromAmount) });
                    yield connection.confirmTransaction(swapTx.hash);
                }
                else {
                    const transaction = yield client.wallet.sendTransaction({ transaction: tx, value: new bignumber_js_1.default(0) });
                    yield connection.confirmTransaction(transaction.hash);
                }
            }
            const updates = {
                status: 'WAITING_FOR_SWAP_CONFIRMATIONS',
                swapTx,
                swapTxHash: swapTx === null || swapTx === void 0 ? void 0 : swapTx.hash,
            };
            return Object.assign({ id: (0, uuid_1.v4)(), fee: quote.fee, slippage: 50 }, updates);
        });
    }
    estimateFees({ txType, feePrices, asset, network, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (txType != this.fromTxType) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Invalid.TransactionType(txType));
            }
            const nativeAsset = (0, cryptoassets_1.getNativeAssetCode)(network, cryptoassets_2.default[asset].chain);
            const gasLimit = 1000000000;
            const fees = {};
            for (const feePrice of feePrices) {
                const fee = new bignumber_js_1.default(gasLimit).times(feePrice);
                fees[feePrice] = new bignumber_js_1.default((0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[nativeAsset], fee).toFixed());
            }
            return fees;
        });
    }
    getExtraAmountToExtractFromBalance() {
        return 33333333;
    }
    performNextSwapAction(_store, { network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (swap.status === 'WAITING_FOR_SWAP_CONFIRMATIONS') {
                return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForSwapConfirmations({ swap, network, walletId }); }));
            }
        });
    }
    getMin(_quoteRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new bignumber_js_1.default(0);
        });
    }
    waitForSwapConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.swapTxHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    const { status } = tx;
                    this.updateBalances(network, walletId, [swap.from]);
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
    _getTransactions(route, userPublicKey) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { data: transactions } = yield axios_1.default.post('https://quote-api.jup.ag/v1/swap', {
                route,
                userPublicKey,
                wrapUnwrapSOL: true,
            });
            return transactions;
        });
    }
}
exports.JupiterSwapProvider = JupiterSwapProvider;
//# sourceMappingURL=JupiterSwapProvider.js.map