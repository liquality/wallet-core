"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleAccount = void 0;
const __1 = require("../..");
const toggleAccount = (context, { network, walletId, accounts, enable, }) => {
    const { commit, dispatch } = (0, __1.rootActionContext)(context);
    accounts.forEach((accountId) => {
        commit.TOGGLE_ACCOUNT({ network, walletId, accountId, enable });
        if (enable) {
            dispatch.updateAccountBalance({
                network,
                walletId,
                accountId,
            });
        }
    });
};
exports.toggleAccount = toggleAccount;
//# sourceMappingURL=toggleAccount.js.map