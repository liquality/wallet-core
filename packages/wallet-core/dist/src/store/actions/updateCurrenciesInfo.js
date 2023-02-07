"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCurrenciesInfo = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const utils_1 = require("../utils");
const updateCurrenciesInfo = (context, { assets }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    const currenciesInfo = yield (0, utils_1.getCurrenciesInfo)(assets);
    commit.UPDATE_CURRENCIES_INFO({ currenciesInfo });
    return currenciesInfo;
});
exports.updateCurrenciesInfo = updateCurrenciesInfo;
//# sourceMappingURL=updateCurrenciesInfo.js.map