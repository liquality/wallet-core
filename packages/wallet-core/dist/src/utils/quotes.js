"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortQuotes = exports.calculateQuoteRate = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const bignumber_js_1 = tslib_1.__importStar(require("bignumber.js"));
const cryptoassets_2 = tslib_1.__importDefault(require("./cryptoassets"));
function calculateQuoteRate(quote) {
    const fromAmount = (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[quote.from], new bignumber_js_1.BigNumber(quote.fromAmount));
    const toAmount = (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[quote.to], new bignumber_js_1.BigNumber(quote.toAmount));
    return toAmount.div(fromAmount);
}
exports.calculateQuoteRate = calculateQuoteRate;
function sortQuotes(quotes, _network) {
    return quotes.slice(0).sort((a, b) => {
        return new bignumber_js_1.default(b.toAmount).minus(a.toAmount).toNumber();
    });
}
exports.sortQuotes = sortQuotes;
//# sourceMappingURL=quotes.js.map