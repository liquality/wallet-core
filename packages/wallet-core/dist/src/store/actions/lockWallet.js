"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lockWallet = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const lockWallet = (context) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.LOCK_WALLET();
});
exports.lockWallet = lockWallet;
//# sourceMappingURL=lockWallet.js.map