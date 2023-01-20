"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFiatUI = exports.formatFiat = exports.fiatToCrypto = exports.cryptoToFiat = exports.prettyFiatBalance = exports.prettyBalance = exports.dpUI = exports.dp = exports.VALUE_DECIMALS = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const bignumber_js_1 = require("bignumber.js");
const cryptoassets_2 = tslib_1.__importDefault(require("./cryptoassets"));
exports.VALUE_DECIMALS = 6;
const dp = (amount, coin) => {
    if (!amount)
        return amount;
    return new bignumber_js_1.BigNumber(amount).dp(cryptoassets_2.default[coin].decimals);
};
exports.dp = dp;
const dpUI = (amount, dp = exports.VALUE_DECIMALS) => {
    if (!amount)
        return amount;
    return new bignumber_js_1.BigNumber(amount).dp(dp, bignumber_js_1.BigNumber.ROUND_FLOOR);
};
exports.dpUI = dpUI;
const prettyBalance = (amount, coin, dp = exports.VALUE_DECIMALS) => {
    if (!amount || !coin)
        return amount;
    amount = (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[coin], amount);
    return (0, exports.dpUI)(amount, dp);
};
exports.prettyBalance = prettyBalance;
const prettyFiatBalance = (amount, rate) => {
    const fiatAmount = (0, exports.cryptoToFiat)(amount, rate);
    if (isNaN(fiatAmount))
        return fiatAmount;
    return (0, exports.formatFiat)(fiatAmount);
};
exports.prettyFiatBalance = prettyFiatBalance;
const cryptoToFiat = (amount, rate) => {
    if (!rate)
        return '--';
    return new bignumber_js_1.BigNumber(amount).times(rate);
};
exports.cryptoToFiat = cryptoToFiat;
const fiatToCrypto = (amount, rate) => {
    if (!rate)
        return amount;
    return new bignumber_js_1.BigNumber(amount).dividedBy(rate).dp(exports.VALUE_DECIMALS, bignumber_js_1.BigNumber.ROUND_FLOOR);
};
exports.fiatToCrypto = fiatToCrypto;
const formatFiat = (amount) => {
    if (isNaN(amount))
        return amount;
    return amount.toFormat(2, bignumber_js_1.BigNumber.ROUND_CEIL);
};
exports.formatFiat = formatFiat;
const formatFiatUI = (amount) => {
    const _amount = String(amount).replace(/,/g, '');
    return isNaN(Number(_amount)) ? amount : '$' + amount;
};
exports.formatFiatUI = formatFiatUI;
//# sourceMappingURL=coinFormatter.js.map