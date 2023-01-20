"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiqualitySwapProvider = exports.LiqualityTxTypes = void 0;
const tslib_1 = require("tslib");
const client_1 = require("@chainify/client");
const utils_1 = require("@chainify/utils");
const cryptoassets_1 = require("@liquality/cryptoassets");
const bignumber_js_1 = tslib_1.__importStar(require("bignumber.js"));
const lodash_1 = require("lodash");
const uuid_1 = require("uuid");
const package_json_1 = tslib_1.__importDefault(require("../../../package.json"));
const utils_2 = require("../../store/actions/performNextAction/utils");
const utils_3 = require("../../store/utils");
const chainify_1 = require("../../utils/chainify");
const coinFormatter_1 = require("../../utils/coinFormatter");
const cryptoassets_2 = tslib_1.__importDefault(require("../../utils/cryptoassets"));
const fees_1 = require("../../utils/fees");
const EvmSwapProvider_1 = require("../EvmSwapProvider");
const VERSION_STRING = `Wallet ${package_json_1.default.version} (Chainify ${package_json_1.default.dependencies['@chainify/client']
    .replace('^', '')
    .replace('~', '')})`;
const headers = {
    'x-requested-with': VERSION_STRING,
    'x-liquality-user-agent': VERSION_STRING,
};
var LiqualityTxTypes;
(function (LiqualityTxTypes) {
    LiqualityTxTypes["SWAP_INITIATION"] = "SWAP_INITIATION";
    LiqualityTxTypes["SWAP_CLAIM"] = "SWAP_CLAIM";
})(LiqualityTxTypes = exports.LiqualityTxTypes || (exports.LiqualityTxTypes = {}));
class LiqualitySwapProvider extends EvmSwapProvider_1.EvmSwapProvider {
    constructor(config) {
        super(config);
        this.feeUnits = {
            [LiqualityTxTypes.SWAP_INITIATION]: {
                ETH: 165000,
                RBTC: 165000,
                BNB: 165000,
                NEAR: 10000000000000,
                SOL: 2,
                LUNA: 800000,
                UST: 800000,
                MATIC: 165000,
                ERC20: 200000,
                ARBETH: 2400000,
                AVAX: 165000,
            },
            [LiqualityTxTypes.SWAP_CLAIM]: {
                BTC: 143,
                ETH: 90000,
                RBTC: 90000,
                BNB: 90000,
                MATIC: 90000,
                NEAR: 8000000000000,
                SOL: 1,
                LUNA: 800000,
                UST: 800000,
                ERC20: 110000,
                ARBETH: 680000,
                AVAX: 90000,
            },
        };
        this._httpClient = new client_1.HttpClient({ baseURL: this.config.agent });
    }
    getMarketInfo() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this._httpClient.nodeGet('/api/swap/marketinfo', null, { headers });
        });
    }
    getAssetLiquidity(asset) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const assetsInfo = yield this._httpClient.nodeGet('api/swap/assetinfo');
            const assetInfo = assetsInfo.find(({ code }) => code === asset);
            if (!assetInfo) {
                return 0;
            }
            return assetInfo.balance;
        });
    }
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const markets = yield this.getMarketInfo();
            const pairs = markets
                .filter((market) => cryptoassets_2.default[market.from] && cryptoassets_2.default[market.to])
                .map((market) => ({
                from: market.from,
                to: market.to,
                min: new bignumber_js_1.default((0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[market.from], market.min)).toFixed(),
                max: new bignumber_js_1.default((0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[market.from], market.max)).toFixed(),
                rate: new bignumber_js_1.default(market.rate).toFixed(),
            }));
            return pairs;
        });
    }
    getQuote({ network, from, to, amount }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const marketData = this.getMarketData(network);
            const market = marketData.find((market) => market.provider === this.config.providerId && market.to === to && market.from === from);
            if (!market)
                return null;
            const fromAmount = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[from], amount);
            const toAmount = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[to], new bignumber_js_1.default(amount).times(new bignumber_js_1.default(market.rate)));
            return {
                fromAmount: fromAmount.toFixed(),
                toAmount: toAmount.toFixed(),
                min: new bignumber_js_1.default(market.min),
                max: new bignumber_js_1.default(market.max),
            };
        });
    }
    newSwap(swapRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const approveTx = yield this.approve(swapRequest, true);
            const updates = approveTx || (yield this.initiateSwap(swapRequest));
            return Object.assign({ id: (0, uuid_1.v4)() }, updates);
        });
    }
    initiateSwap({ network, walletId, quote: _quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const lockedQuote = yield this._getQuote({
                from: _quote.from,
                to: _quote.to,
                amount: _quote.fromAmount,
            });
            delete lockedQuote.id;
            if (new bignumber_js_1.default(lockedQuote.toAmount).lt(new bignumber_js_1.default(_quote.toAmount).times(0.995))) {
                throw new Error('The quote slippage is too high (> 0.5%). Try again.');
            }
            const quote = Object.assign(Object.assign({}, _quote), lockedQuote);
            if (yield this.hasQuoteExpired(quote)) {
                throw new Error('The quote is expired.');
            }
            quote.fromAddress = yield this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
            quote.toAddress = yield this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);
            const fromClient = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const message = [
                'Creating a swap with following terms:',
                `Send: ${quote.fromAmount} (lowest denomination) ${quote.from}`,
                `Receive: ${quote.toAmount} (lowest denomination) ${quote.to}`,
                `My ${quote.from} Address: ${quote.fromAddress}`,
                `My ${quote.to} Address: ${quote.toAddress}`,
                `Counterparty ${quote.from} Address: ${quote.fromCounterPartyAddress}`,
                `Counterparty ${quote.to} Address: ${quote.toCounterPartyAddress}`,
                `Timestamp: ${quote.swapExpiration}`,
            ].join('\n');
            const messageHex = Buffer.from(message, 'utf8').toString('hex');
            const secret = yield fromClient.swap.generateSecret(messageHex);
            const secretHash = (0, utils_1.sha256)(secret);
            const asset = (0, chainify_1.assetsAdapter)(quote.from)[0];
            const fromFundTx = yield fromClient.swap.initiateSwap({
                asset,
                value: new bignumber_js_1.default(quote.fromAmount),
                recipientAddress: quote.fromCounterPartyAddress,
                refundAddress: quote.fromAddress,
                secretHash: secretHash,
                expiration: quote.swapExpiration,
            }, quote.fee);
            return Object.assign(Object.assign({}, quote), { status: 'INITIATED', secret,
                secretHash, fromFundHash: fromFundTx.hash, fromFundTx });
        });
    }
    estimateFees({ network, walletId, asset, txType, quote, feePrices, max, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (txType === this._txTypes().SWAP_INITIATION && asset === 'BTC') {
                const client = this.getClient(network, walletId, asset, quote.fromAccountId);
                const value = max ? undefined : new bignumber_js_1.default(quote.fromAmount);
                const txs = feePrices.map((fee) => ({ to: '', value, fee }));
                const totalFees = yield client.wallet.getTotalFees(txs, max);
                return (0, lodash_1.mapValues)(totalFees, (f) => (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[asset], f));
            }
            if (txType === this._txTypes().SWAP_INITIATION && asset === 'NEAR') {
                const fees = {};
                const storageFee = new bignumber_js_1.default(0.00125);
                for (const feePrice of feePrices) {
                    fees[feePrice] = (0, fees_1.getTxFee)(this.feeUnits[txType], asset, feePrice).plus(storageFee);
                }
                return fees;
            }
            if (txType in this.feeUnits) {
                const fees = {};
                for (const feePrice of feePrices) {
                    fees[feePrice] = (0, fees_1.getTxFee)(this.feeUnits[txType], asset, feePrice);
                }
                return fees;
            }
            const fees = {};
            for (const feePrice of feePrices) {
                fees[feePrice] = new bignumber_js_1.BigNumber(0);
            }
            return fees;
        });
    }
    getMin(quoteRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (quoteRequest) {
                const pairs = yield this.getSupportedPairs();
                for (const pair of pairs) {
                    if (pair.from == quoteRequest.from && pair.to == quoteRequest.to) {
                        return new bignumber_js_1.default(pair.min);
                    }
                }
            }
            return new bignumber_js_1.default(0);
        });
    }
    updateOrder(order) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this._httpClient.nodePost(`/api/swap/order/${order.orderId}`, {
                fromAddress: order.fromAddress,
                toAddress: order.toAddress,
                fromFundHash: order.fromFundHash,
                secretHash: order.secretHash,
            }, { headers });
        });
    }
    waitForClaimConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const toClient = this.getClient(network, walletId, swap.to, swap.toAccountId);
            try {
                const tx = yield toClient.chain.getTransactionByHash(swap.toClaimHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    this.updateBalances(network, walletId, [swap.toAccountId, swap.fromAccountId]);
                    return {
                        endTime: Date.now(),
                        status: 'SUCCESS',
                    };
                }
            }
            catch (e) {
                if (e.name === 'TxNotFoundError')
                    console.warn(e);
                else
                    throw e;
            }
            const expirationUpdates = yield this.handleExpirations({
                swap,
                network,
                walletId,
            });
            if (expirationUpdates) {
                return expirationUpdates;
            }
        });
    }
    performNextSwapAction(store, { network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (swap.status) {
                case 'WAITING_FOR_APPROVE_CONFIRMATIONS_LSP':
                    return (0, utils_2.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForApproveConfirmations({ swap, network, walletId }); }));
                case 'APPROVE_CONFIRMED_LSP':
                    return (0, utils_2.withLock)(store, { item: swap, network, walletId, asset: swap.from }, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.initiateSwap({ quote: swap, network, walletId }); }));
                case 'INITIATED':
                    return this.reportInitiation(swap);
                case 'INITIATION_REPORTED':
                    return (0, utils_2.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.confirmInitiation({ swap, network, walletId }); }));
                case 'INITIATION_CONFIRMED':
                    return (0, utils_2.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.findCounterPartyInitiation({ swap, network, walletId }); }));
                case 'CONFIRM_COUNTER_PARTY_INITIATION':
                    return (0, utils_2.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.confirmCounterPartyInitiation({ swap, network, walletId }); }));
                case 'READY_TO_CLAIM':
                    return (0, utils_2.withLock)(store, { item: swap, network, walletId, asset: swap.to }, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.claimSwap({ swap, network, walletId }); }));
                case 'WAITING_FOR_CLAIM_CONFIRMATIONS':
                    return (0, utils_2.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForClaimConfirmations({ swap, network, walletId }); }));
                case 'WAITING_FOR_REFUND':
                    return (0, utils_2.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForRefund({ swap, network, walletId }); }));
                case 'GET_REFUND':
                    return (0, utils_2.withLock)(store, { item: swap, network, walletId, asset: swap.from }, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.refundSwap({ swap, network, walletId }); }));
                case 'WAITING_FOR_REFUND_CONFIRMATIONS':
                    return (0, utils_2.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForRefundConfirmations({ swap, network, walletId }); }));
            }
        });
    }
    _getStatuses() {
        const baseStatuses = super._getStatuses();
        return {
            WAITING_FOR_APPROVE_CONFIRMATIONS_LSP: baseStatuses.WAITING_FOR_APPROVE_CONFIRMATIONS,
            APPROVE_CONFIRMED_LSP: baseStatuses.APPROVE_CONFIRMED,
            INITIATED: {
                step: 1,
                label: 'Locking {from}',
                filterStatus: 'PENDING',
            },
            INITIATION_REPORTED: {
                step: 1,
                label: 'Locking {from}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Swap initiated',
                    };
                },
            },
            INITIATION_CONFIRMED: {
                step: 2,
                label: 'Locking {from}',
                filterStatus: 'PENDING',
            },
            CONFIRM_COUNTER_PARTY_INITIATION: {
                step: 2,
                label: 'Locking {to}',
                filterStatus: 'PENDING',
                notification(swap) {
                    return {
                        message: `Counterparty sent ${(0, coinFormatter_1.prettyBalance)(swap.toAmount, swap.to)} ${swap.to} to escrow`,
                    };
                },
            },
            READY_TO_CLAIM: {
                step: 3,
                label: 'Claiming {to}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Claiming funds',
                    };
                },
            },
            WAITING_FOR_CLAIM_CONFIRMATIONS: {
                step: 3,
                label: 'Claiming {to}',
                filterStatus: 'PENDING',
            },
            WAITING_FOR_REFUND: {
                step: 3,
                label: 'Pending Refund',
                filterStatus: 'PENDING',
            },
            GET_REFUND: {
                step: 3,
                label: 'Refunding {from}',
                filterStatus: 'PENDING',
            },
            WAITING_FOR_REFUND_CONFIRMATIONS: {
                step: 3,
                label: 'Refunding {from}',
                filterStatus: 'PENDING',
            },
            REFUNDED: {
                step: 4,
                label: 'Refunded',
                filterStatus: 'REFUNDED',
                notification(swap) {
                    return {
                        message: `Swap refunded, ${(0, coinFormatter_1.prettyBalance)(swap.fromAmount, swap.from)} ${swap.from} returned`,
                    };
                },
            },
            SUCCESS: {
                step: 4,
                label: 'Completed',
                filterStatus: 'COMPLETED',
                notification(swap) {
                    return {
                        message: `Swap completed, ${(0, coinFormatter_1.prettyBalance)(swap.toAmount, swap.to)} ${swap.to} ready to use`,
                    };
                },
            },
            QUOTE_EXPIRED: {
                step: 4,
                label: 'Quote Expired',
                filterStatus: 'REFUNDED',
            },
        };
    }
    _txTypes() {
        return LiqualityTxTypes;
    }
    _fromTxType() {
        return this._txTypes().SWAP_INITIATION;
    }
    _toTxType() {
        return this._txTypes().SWAP_CLAIM;
    }
    _timelineDiagramSteps() {
        return ['APPROVE', 'INITIATION', 'AGENT_INITIATION', 'CLAIM_OR_REFUND'];
    }
    _totalSteps() {
        return 5;
    }
    _getQuote({ from, to, amount }) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return this._httpClient.nodePost('/api/swap/order', { from, to, fromAmount: amount }, { headers });
            }
            catch (e) {
                if ((_b = (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) {
                    throw new Error(e.response.data.error);
                }
                else {
                    throw e;
                }
            }
        });
    }
    waitForRefund({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yield this.canRefund({ swap, network, walletId })) {
                return { status: 'GET_REFUND' };
            }
        });
    }
    waitForRefundConfirmations({ swap, network, walletId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fromClient = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield fromClient.chain.getTransactionByHash(swap.refundHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    return {
                        endTime: Date.now(),
                        status: 'REFUNDED',
                    };
                }
            }
            catch (e) {
                if (e.name === 'TxNotFoundError')
                    console.warn(e);
                else
                    throw e;
            }
        });
    }
    refundSwap({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fromClient = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            yield this.sendLedgerNotification(swap.fromAccountId, 'Signing required to refund the swap.');
            const asset = (0, chainify_1.assetsAdapter)(swap.from)[0];
            const refundTx = yield fromClient.swap.refundSwap({
                asset,
                value: new bignumber_js_1.default(swap.fromAmount),
                recipientAddress: swap.fromCounterPartyAddress,
                refundAddress: swap.fromAddress,
                secretHash: swap.secretHash,
                expiration: swap.swapExpiration,
            }, swap.fromFundHash, swap.fee);
            return {
                refundHash: refundTx.hash,
                refundTx,
                status: 'WAITING_FOR_REFUND_CONFIRMATIONS',
            };
        });
    }
    reportInitiation(swap) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yield this.hasQuoteExpired(swap)) {
                return { status: 'WAITING_FOR_REFUND' };
            }
            yield this.updateOrder(swap);
            return {
                status: 'INITIATION_REPORTED',
            };
        });
    }
    confirmInitiation({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const counterPartyInitiation = yield this.findCounterPartyInitiation({
                swap,
                network,
                walletId,
            });
            if (counterPartyInitiation)
                return counterPartyInitiation;
            const fromClient = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield fromClient.chain.getTransactionByHash(swap.fromFundHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    return {
                        status: 'INITIATION_CONFIRMED',
                    };
                }
            }
            catch (e) {
                if (e.name === 'TxNotFoundError')
                    console.warn(e);
                else
                    throw e;
            }
        });
    }
    findCounterPartyInitiation({ swap, network, walletId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const toClient = this.getClient(network, walletId, swap.to, swap.toAccountId);
            const toAsset = cryptoassets_2.default[swap.to];
            const asset = Object.assign(Object.assign({}, toAsset), { isNative: toAsset.type === 'native' });
            try {
                const tx = yield toClient.swap.findInitiateSwapTransaction({
                    asset,
                    value: new bignumber_js_1.default(swap.toAmount),
                    recipientAddress: swap.toAddress,
                    refundAddress: swap.toCounterPartyAddress,
                    secretHash: swap.secretHash,
                    expiration: swap.nodeSwapExpiration,
                });
                if (tx) {
                    const toFundHash = tx.hash;
                    const isVerified = yield toClient.swap.verifyInitiateSwapTransaction({
                        asset,
                        value: new bignumber_js_1.default(swap.toAmount),
                        recipientAddress: swap.toAddress,
                        refundAddress: swap.toCounterPartyAddress,
                        secretHash: swap.secretHash,
                        expiration: swap.nodeSwapExpiration,
                    }, toFundHash);
                    if (isVerified) {
                        return {
                            toFundHash,
                            status: 'CONFIRM_COUNTER_PARTY_INITIATION',
                        };
                    }
                }
            }
            catch (e) {
                if (['BlockNotFoundError', 'PendingTxError', 'TxNotFoundError'].includes(e.name))
                    console.warn(e);
                else
                    throw e;
            }
            const expirationUpdates = yield this.handleExpirations({
                swap,
                network,
                walletId,
            });
            if (expirationUpdates) {
                return expirationUpdates;
            }
        });
    }
    confirmCounterPartyInitiation({ swap, network, walletId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const toClient = this.getClient(network, walletId, swap.to, swap.toAccountId);
            const tx = yield toClient.chain.getTransactionByHash(swap.toFundHash);
            if (tx &&
                tx.confirmations &&
                tx.confirmations >= (0, cryptoassets_1.getChain)(network, cryptoassets_2.default[swap.to].chain).safeConfirmations) {
                return {
                    status: 'READY_TO_CLAIM',
                };
            }
            const expirationUpdates = yield this.handleExpirations({
                swap,
                network,
                walletId,
            });
            if (expirationUpdates) {
                return expirationUpdates;
            }
        });
    }
    claimSwap({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const expirationUpdates = yield this.handleExpirations({
                swap,
                network,
                walletId,
            });
            if (expirationUpdates) {
                return expirationUpdates;
            }
            const toClient = this.getClient(network, walletId, swap.to, swap.toAccountId);
            yield this.sendLedgerNotification(swap.toAccountId, 'Signing required to claim the swap.');
            const asset = (0, chainify_1.assetsAdapter)(swap.to)[0];
            const toClaimTx = yield toClient.swap.claimSwap({
                asset,
                value: new bignumber_js_1.default(swap.toAmount),
                recipientAddress: swap.toAddress,
                refundAddress: swap.toCounterPartyAddress,
                secretHash: swap.secretHash,
                expiration: swap.nodeSwapExpiration,
            }, swap.toFundHash, swap.secret, swap.claimFee);
            return {
                toClaimHash: toClaimTx.hash,
                toClaimTx,
                status: 'WAITING_FOR_CLAIM_CONFIRMATIONS',
            };
        });
    }
    hasQuoteExpired(swap) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (0, utils_3.timestamp)() >= swap.expiresAt;
        });
    }
    hasChainTimePassed({ network, walletId, asset, timestamp, accountId, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, asset, accountId);
            const maxTries = 3;
            let tries = 0;
            while (tries < maxTries) {
                try {
                    const blockNumber = yield client.chain.getBlockHeight();
                    const latestBlock = yield client.chain.getBlockByNumber(blockNumber);
                    return latestBlock.timestamp > timestamp;
                }
                catch (e) {
                    tries++;
                    if (tries >= maxTries)
                        throw e;
                    else {
                        console.warn(e);
                        yield (0, utils_3.wait)(2000);
                    }
                }
            }
        });
    }
    canRefund({ network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.hasChainTimePassed({
                network,
                walletId,
                asset: swap.from,
                timestamp: swap.swapExpiration,
                accountId: swap.fromAccountId,
            });
        });
    }
    hasSwapExpired({ network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.hasChainTimePassed({
                network,
                walletId,
                asset: swap.to,
                timestamp: swap.nodeSwapExpiration,
                accountId: swap.toAccountId,
            });
        });
    }
    handleExpirations({ network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yield this.canRefund({ swap, network, walletId })) {
                return { status: 'GET_REFUND' };
            }
            if (yield this.hasSwapExpired({ swap, network, walletId })) {
                return { status: 'WAITING_FOR_REFUND' };
            }
        });
    }
}
exports.LiqualitySwapProvider = LiqualitySwapProvider;
//# sourceMappingURL=LiqualitySwapProvider.js.map