"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccount = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
const updateAccount = (context, { network, walletId, account }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    const updatedAt = Date.now();
    const updatedAccount = Object.assign(Object.assign({}, account), { updatedAt });
    commit.UPDATE_ACCOUNT({ network, walletId, account: updatedAccount });
    return updatedAccount;
});
exports.updateAccount = updateAccount;
//# sourceMappingURL=updateAccount.js.map