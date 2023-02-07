"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEthereumInjectionChain = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const setEthereumInjectionChain = (context, { chain }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.SET_ETHEREUM_INJECTION_CHAIN({ chain });
});
exports.setEthereumInjectionChain = setEthereumInjectionChain;
//# sourceMappingURL=setEthereumInjectionChain.js.map