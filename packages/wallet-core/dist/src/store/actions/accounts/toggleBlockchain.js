"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBlockchain = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
const build_config_1 = tslib_1.__importDefault(require("../../../build.config"));
const toggleBlockchain = (context, { network, walletId, chainId, enable }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    if (build_config_1.default.chains.includes(chainId)) {
        commit.TOGGLE_BLOCKCHAIN({ network, walletId, chainId, enable });
    }
});
exports.toggleBlockchain = toggleBlockchain;
//# sourceMappingURL=toggleBlockchain.js.map