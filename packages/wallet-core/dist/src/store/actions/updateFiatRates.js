"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFiatRates = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const utils_1 = require("../utils");
const updateFiatRates = (context, { assets }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    const fiatRates = yield (0, utils_1.getPrices)(assets, 'usd');
    commit.UPDATE_FIAT_RATES({ fiatRates });
    return fiatRates;
});
exports.updateFiatRates = updateFiatRates;
//# sourceMappingURL=updateFiatRates.js.map