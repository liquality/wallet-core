"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAccount = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
const removeAccount = (context, { network, walletId, id }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.REMOVE_ACCOUNT({ network, walletId, id });
    return id;
});
exports.removeAccount = removeAccount;
//# sourceMappingURL=removeAccount.js.map