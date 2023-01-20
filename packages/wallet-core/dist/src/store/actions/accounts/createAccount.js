"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
const accounts_1 = require("../../../utils/accounts");
const createAccount = (context, { walletId, network, account }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit, dispatch } = (0, __1.rootActionContext)(context);
    const _account = (0, accounts_1.accountCreator)({ network, walletId, account });
    commit.CREATE_ACCOUNT({ network, walletId, account: _account });
    if (!account.addresses || account.addresses.length <= 0) {
        yield dispatch.getUnusedAddresses({
            network,
            walletId,
            assets: _account.assets,
            accountId: _account.id,
        });
    }
    yield dispatch.updateAccountBalance({
        network,
        walletId,
        accountId: _account.id,
    });
    return _account;
});
exports.createAccount = createAccount;
//# sourceMappingURL=createAccount.js.map