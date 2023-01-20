"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableAssets = void 0;
const tslib_1 = require("tslib");
const error_parser_1 = require("@liquality/error-parser");
const __1 = require("..");
const disableAssets = (context, { network, walletId, assets }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { state, commit, getters } = (0, __1.rootActionContext)(context);
    commit.DISABLE_ASSETS({ network, walletId, assets });
    const accounts = (_a = state.accounts[walletId]) === null || _a === void 0 ? void 0 : _a[network];
    if (!accounts) {
        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Accounts);
    }
    accounts
        .filter((a) => a.assets.some((s) => assets.includes(s)))
        .forEach((account) => {
        const _assets = assets.filter((asset) => { var _a; return ((_a = getters.cryptoassets[asset]) === null || _a === void 0 ? void 0 : _a.chain) === account.chain; });
        commit.DISABLE_ACCOUNT_ASSETS({
            network,
            walletId,
            assets: _assets,
            accountId: account.id,
        });
    });
});
exports.disableAssets = disableAssets;
//# sourceMappingURL=disableAssets.js.map