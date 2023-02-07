"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableEthereumInjection = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const enableEthereumInjection = (context) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.ENABLE_ETHEREUM_INJECTION();
});
exports.enableEthereumInjection = enableEthereumInjection;
//# sourceMappingURL=enableEthereumInjection.js.map