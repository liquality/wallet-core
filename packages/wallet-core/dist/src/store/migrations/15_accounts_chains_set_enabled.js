"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountsChainsSetEnabled = void 0;
const tslib_1 = require("tslib");
const build_config_1 = tslib_1.__importDefault(require("../../build.config"));
const networks_1 = require("../../utils/networks");
exports.accountsChainsSetEnabled = {
    version: 15,
    migrate: (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const accounts = {};
        const enabledChains = {};
        for (const walletId in state.accounts) {
            accounts[walletId] = {};
            enabledChains[walletId] = {};
            for (const network of networks_1.Networks) {
                const updatedAccounts = state.accounts[walletId][network].map((a) => (Object.assign(Object.assign({}, a), { enabled: true })));
                accounts[walletId][network] = updatedAccounts;
                enabledChains[walletId][network] = [...build_config_1.default.chains];
            }
        }
        return Object.assign(Object.assign({}, state), { enabledChains,
            accounts });
    }),
};
//# sourceMappingURL=15_accounts_chains_set_enabled.js.map