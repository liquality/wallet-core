"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlockWallet = void 0;
const tslib_1 = require("tslib");
const error_parser_1 = require("@liquality/error-parser");
const __1 = require("..");
const crypto_1 = require("../../utils/crypto");
const unlockWallet = (context, { key }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit, state } = (0, __1.rootActionContext)(context);
    const wallets = yield (0, crypto_1.decrypt)(state.encryptedWallets, key, state.keySalt);
    if (!wallets) {
        throw new error_parser_1.PasswordError();
    }
    const parsedWallets = JSON.parse(wallets);
    commit.UNLOCK_WALLET({
        key,
        wallets: parsedWallets,
        unlockedAt: Date.now(),
    });
});
exports.unlockWallet = unlockWallet;
//# sourceMappingURL=unlockWallet.js.map