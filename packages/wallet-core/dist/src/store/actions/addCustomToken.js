"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCustomToken = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const addCustomToken = (context, { network, walletId, chain, symbol, name, contractAddress, decimals, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    const customToken = { symbol, name, contractAddress, decimals, chain: chain };
    commit.ADD_CUSTOM_TOKEN({ network, walletId, customToken });
});
exports.addCustomToken = addCustomToken;
//# sourceMappingURL=addCustomToken.js.map