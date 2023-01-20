"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSlowQuotes = exports.getQuotes = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("@chainify/utils");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const uuid_1 = require("uuid");
const build_config_1 = tslib_1.__importDefault(require("../../build.config"));
const swap_1 = require("../../factory/swap");
const slowQuotesCallbacks = {};
const getQuotes = (_context, { network, from, to, fromAccountId, toAccountId, walletId, amount, slowQuoteThreshold = 5000, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const requestId = (0, uuid_1.v4)();
    if (!amount) {
        return {
            requestId,
            hasSlowQuotes: false,
            quotes: [],
        };
    }
    const quotes = [];
    const slowQuotes = [];
    let hasSlowQuotes = false;
    const getAllQuotes = (() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return bluebird_1.default.map(Object.keys(build_config_1.default.swapProviders[network]), (provider) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const swapProvider = (0, swap_1.getSwapProvider)(network, provider);
            const quote = yield swapProvider
                .getQuote({ network, from, to, amount: new bignumber_js_1.default(amount), fromAccountId, toAccountId, walletId })
                .catch(console.error);
            if (!quote) {
                return null;
            }
            const result = Object.assign(Object.assign({}, quote), { from, to, provider, fromAccountId, toAccountId });
            if (quote) {
                if (hasSlowQuotes) {
                    slowQuotes.push(result);
                }
                else {
                    quotes.push(result);
                }
            }
            return result;
        }), { concurrency: 5 });
    }))().then(() => {
        if (hasSlowQuotes && slowQuotesCallbacks[requestId]) {
            slowQuotesCallbacks[requestId](slowQuotes);
            delete slowQuotesCallbacks[requestId];
        }
    });
    const fastQuotes = yield Promise.race([
        getAllQuotes.then(() => false),
        (0, utils_1.sleep)(slowQuoteThreshold).then(() => true),
    ]).then((timedOut) => {
        hasSlowQuotes = timedOut;
        return quotes;
    });
    return {
        requestId,
        hasSlowQuotes,
        quotes: fastQuotes,
    };
});
exports.getQuotes = getQuotes;
const getSlowQuotes = (_context, { requestId }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, _reject) => {
        slowQuotesCallbacks[requestId] = (quotes) => resolve(quotes);
    });
});
exports.getSlowQuotes = getSlowQuotes;
//# sourceMappingURL=getQuotes.js.map