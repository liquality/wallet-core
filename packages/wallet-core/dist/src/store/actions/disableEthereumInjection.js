"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableEthereumInjection = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const disableEthereumInjection = (context) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.DISABLE_ETHEREUM_INJECTION();
});
exports.disableEthereumInjection = disableEthereumInjection;
//# sourceMappingURL=disableEthereumInjection.js.map