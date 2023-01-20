"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCustomToken = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const removeCustomToken = (context, { network, walletId, symbol }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.REMOVE_CUSTOM_TOKEN({ network, walletId, symbol });
});
exports.removeCustomToken = removeCustomToken;
//# sourceMappingURL=removeCustomToken.js.map