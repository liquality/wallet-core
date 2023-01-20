"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultAssets = void 0;
const tslib_1 = require("tslib");
const build_config_1 = tslib_1.__importDefault(require("../../build.config"));
exports.setDefaultAssets = {
    version: 2,
    migrate: (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const enabledAssets = {
            mainnet: {
                [state.activeWalletId]: build_config_1.default.defaultAssets.mainnet,
            },
            testnet: {
                [state.activeWalletId]: build_config_1.default.defaultAssets.testnet,
            },
        };
        return Object.assign(Object.assign({}, state), { enabledAssets });
    }),
};
//# sourceMappingURL=2_set_default_assets.js.map