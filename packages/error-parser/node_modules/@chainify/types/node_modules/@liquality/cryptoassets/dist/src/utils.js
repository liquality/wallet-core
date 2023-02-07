"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyToUnit = exports.unitToCurrency = exports.remove0x = exports.ensure0x = void 0;
const tslib_1 = require("tslib");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
function ensure0x(hash) {
    return hash.startsWith('0x') ? hash : `0x${hash}`;
}
exports.ensure0x = ensure0x;
function remove0x(hash) {
    return hash.startsWith('0x') ? hash.slice(2) : hash;
}
exports.remove0x = remove0x;
function unitToCurrency(asset, value) {
    const multiplier = new bignumber_js_1.default(10).pow(asset.decimals);
    return new bignumber_js_1.default(value).dividedBy(multiplier);
}
exports.unitToCurrency = unitToCurrency;
function currencyToUnit(asset, value) {
    const multiplier = new bignumber_js_1.default(10).pow(asset.decimals);
    return new bignumber_js_1.default(value).times(multiplier);
}
exports.currencyToUnit = currencyToUnit;
//# sourceMappingURL=utils.js.map