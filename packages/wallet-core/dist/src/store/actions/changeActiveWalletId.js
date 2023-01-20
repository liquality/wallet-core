"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeActiveWalletId = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const changeActiveWalletId = (context, { walletId }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.CHANGE_ACTIVE_WALLETID({ walletId });
});
exports.changeActiveWalletId = changeActiveWalletId;
//# sourceMappingURL=changeActiveWalletId.js.map