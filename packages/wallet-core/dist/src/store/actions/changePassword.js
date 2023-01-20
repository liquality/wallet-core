"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const crypto_1 = require("../../utils/crypto");
const changePassword = (context, { key }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit, state } = (0, __1.rootActionContext)(context);
    const { encrypted: encryptedWallets, keySalt } = yield (0, crypto_1.encrypt)(JSON.stringify(state.wallets), key);
    commit.CHANGE_PASSWORD({ key, keySalt, encryptedWallets });
});
exports.changePassword = changePassword;
//# sourceMappingURL=changePassword.js.map