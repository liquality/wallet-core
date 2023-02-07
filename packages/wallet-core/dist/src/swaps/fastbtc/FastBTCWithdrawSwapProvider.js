"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastBTCWithdrawSwapProvider = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const isTransactionNotFoundError_1 = require("../../utils/isTransactionNotFoundError");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const ethers = tslib_1.__importStar(require("ethers"));
const uuid_1 = require("uuid");
const utils_1 = require("../../store/actions/performNextAction/utils");
const coinFormatter_1 = require("../../utils/coinFormatter");
const cryptoassets_2 = tslib_1.__importDefault(require("../../utils/cryptoassets"));
const SwapProvider_1 = require("../SwapProvider");
const fastBtcBridgeContract_1 = require("./fastBtcBridgeContract");
const error_parser_1 = require("@liquality/error-parser");
class FastBTCWithdrawSwapProvider extends SwapProvider_1.SwapProvider {
    constructor(config) {
        super(config);
        const rskChain = (0, cryptoassets_1.getChain)(this.config.network, cryptoassets_1.ChainId.Rootstock);
        this._provider = new ethers.providers.StaticJsonRpcProvider(rskChain.network.rpcUrls[0], Number(rskChain.network.chainId));
    }
    getFastBtcBridge(provider) {
        const fastBtcBridge = new ethers.Contract(this.config.routerAddress, fastBtcBridgeContract_1.BRIDGE_CONTRACT_ABI, provider);
        return fastBtcBridge;
    }
    getLimits() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fastBtcBridge = this.getFastBtcBridge(this._provider);
            const minInSatoshi = yield fastBtcBridge.minTransferSatoshi();
            const maxInSatosih = yield fastBtcBridge.maxTransferSatoshi();
            const min = (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default.BTC, minInSatoshi);
            const max = (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default.BTC, maxInSatosih);
            return { min, max };
        });
    }
    getClient(network, walletId, asset, accountId) {
        return super.getClient(network, walletId, asset, accountId);
    }
    getReceiveClient(network, walletId, asset, accountId) {
        return super.getClient(network, walletId, asset, accountId);
    }
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { min, max } = yield this.getLimits();
            return [
                {
                    from: 'RBTC',
                    to: 'BTC',
                    rate: '0.998',
                    min: min.toFixed(),
                    max: max.toFixed(),
                },
            ];
        });
    }
    getQuote(quoteRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { from, to, amount } = quoteRequest;
            if (from !== 'RBTC' || to !== 'BTC') {
                return null;
            }
            const { min, max } = yield this.getLimits();
            const isQuoteAmountInTheRange = amount.gte(min) && amount.lte(max);
            if (!isQuoteAmountInTheRange) {
                return null;
            }
            const fastBtcBridge = this.getFastBtcBridge(this._provider);
            const fromAmountInSatoshi = new bignumber_js_1.default((0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default.BTC, new bignumber_js_1.default(amount)));
            const feeSatoshi = yield fastBtcBridge.calculateCurrentFeeSatoshi(ethers.BigNumber.from(fromAmountInSatoshi.toFixed()));
            const fromAmountInUnit = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[from], new bignumber_js_1.default(amount));
            const toAmountInUnit = fromAmountInSatoshi.minus(new bignumber_js_1.default(feeSatoshi.toString()));
            return {
                fromAmount: fromAmountInUnit.toFixed(),
                toAmount: toAmountInUnit.toFixed(),
            };
        });
    }
    buildSwapTx({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const fastBtcBridge = this.getFastBtcBridge(client.chain.getProvider());
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
            const fromAddress = (0, cryptoassets_1.getChain)(network, cryptoassets_2.default.RBTC.chain).formatAddress(fromAddressRaw);
            const toAddress = yield this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);
            const data = yield fastBtcBridge.interface.encodeFunctionData('transferToBtc', [toAddress]);
            const swapTx = {
                from: fromAddress,
                to: fastBtcBridge.address,
                value: ethers.BigNumber.from(quote.fromAmount),
                data,
            };
            return swapTx;
        });
    }
    sendSwap({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const fastBtcBridge = this.getFastBtcBridge(client.chain.getProvider());
            const toAddress = yield this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);
            yield this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
            const data = yield fastBtcBridge.interface.encodeFunctionData('transferToBtc', [toAddress]);
            const swapTx = yield client.wallet.sendTransaction({
                to: fastBtcBridge.address,
                value: new bignumber_js_1.default(quote.fromAmount),
                data,
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
    estimateFees({ network, walletId, quote, feePrices }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const swapTx = yield this.buildSwapTx({ network, walletId, quote });
            const gasLimit = yield client.chain.getProvider().estimateGas(swapTx);
            const fees = {};
            for (const feePrice of feePrices) {
                const gasPrice = new bignumber_js_1.default(feePrice).times(1e9);
                const fee = new bignumber_js_1.default(gasLimit.toString()).times(1.1).times(gasPrice);
                fees[feePrice] = (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default.RBTC, fee);
            }
            return fees;
        });
    }
    getMin() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { min } = yield this.getLimits();
            return min;
        });
    }
    waitForSendConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.swapTxHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    if (!tx.logs) {
                        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.FastBTC.Logs);
                    }
                    const receipt = yield client.chain.getProvider().getTransactionReceipt(swap.swapTxHash);
                    const fastBtcBridge = this.getFastBtcBridge(client.chain.getProvider());
                    const events = receipt.logs.map((log) => fastBtcBridge.interface.parseLog(log));
                    const event = events.find((event) => event.name === 'NewBitcoinTransfer');
                    if (!event) {
                        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.FastBTC.NewBitcoinTransferEvent);
                    }
                    const transferId = event.args.transferId;
                    return {
                        transferId,
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
                const fastBtcBridge = this.getFastBtcBridge(this._provider);
                const statusUpdateFilter = fastBtcBridge.filters.BitcoinTransferStatusUpdated(swap.transferId);
                const stausUpdateEvents = yield fastBtcBridge.queryFilter(statusUpdateFilter, swap.swapTx.blockNumber);
                if (stausUpdateEvents.length > 0) {
                    for (const statusUpdateEvent of stausUpdateEvents) {
                        if (statusUpdateEvent.args.newStatus === fastBtcBridgeContract_1.BitcoinTransferStatus.SENDING) {
                            const transferBlockNumber = statusUpdateEvent.blockNumber;
                            const transferFilter = fastBtcBridge.filters.BitcoinTransferBatchSending();
                            const transferEvents = yield fastBtcBridge.queryFilter(transferFilter, transferBlockNumber, transferBlockNumber);
                            const transferEvent = transferEvents[0];
                            const receiveTxHash = transferEvent.args.bitcoinTxHash.replace('0x', '');
                            const receiveClient = this.getReceiveClient(network, walletId, 'BTC', swap.toAccountId);
                            const receiveTx = yield receiveClient.chain.getTransactionByHash(receiveTxHash);
                            if (receiveTx && receiveTx.confirmations && receiveTx.confirmations > 0) {
                                return {
                                    receiveTxHash,
                                    receiveTx,
                                    endTime: Date.now(),
                                    status: 'SUCCESS',
                                };
                            }
                            return {
                                receiveTxHash,
                                receiveTx,
                                status: 'WAITING_FOR_RECEIVE_CONFIRMATIONS',
                            };
                        }
                    }
                }
            }
            catch (e) {
                console.warn(e);
            }
        });
    }
    waitForReceiveConfirmations({ swap, network, walletId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getReceiveClient(network, walletId, 'BTC', swap.toAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.receiveTxHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    return {
                        receiveTx: tx,
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
    performNextSwapAction(_store, { network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (swap.status) {
                case 'WAITING_FOR_SEND_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForSendConfirmations({ swap, network, walletId }); }));
                case 'WAITING_FOR_RECEIVE':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForReceive({ swap, network, walletId }); }));
                case 'WAITING_FOR_RECEIVE_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForReceiveConfirmations({ swap, network, walletId }); }));
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
            WAITING_FOR_RECEIVE_CONFIRMATIONS: {
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
        return ['SWAP', 'RECEIVE'];
    }
    _totalSteps() {
        return 3;
    }
}
exports.FastBTCWithdrawSwapProvider = FastBTCWithdrawSwapProvider;
//# sourceMappingURL=FastBTCWithdrawSwapProvider.js.map