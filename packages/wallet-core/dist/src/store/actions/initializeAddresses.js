"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAddresses = void 0;
const tslib_1 = require("tslib");
const error_parser_1 = require("@liquality/error-parser");
const __1 = require("..");
const initializeAddresses = (context, { network, walletId }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { state, dispatch } = (0, __1.rootActionContext)(context);
    const accounts = (_a = state.accounts[walletId]) === null || _a === void 0 ? void 0 : _a[network];
    if (!accounts) {
        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Accounts);
    }
    for (const account of accounts) {
        if (!account.addresses.length) {
            yield dispatch.getUnusedAddresses({
                network,
                walletId,
                assets: account.assets,
                accountId: account.id,
            });
        }
    }
});
exports.initializeAddresses = initializeAddresses;
//# sourceMappingURL=initializeAddresses.js.map