"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiProviderSwaps = void 0;
const tslib_1 = require("tslib");
exports.multiProviderSwaps = {
    version: 7,
    migrate: (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const walletId = state.activeWalletId;
        const migrateHistory = (state, network, walletId) => {
            var _a;
            const walletHistory = (_a = state.history[network]) === null || _a === void 0 ? void 0 : _a[walletId];
            return walletHistory && walletHistory.length
                ? walletHistory.map((item) => (item.type === 'SWAP' ? Object.assign(Object.assign({}, item), { provider: 'liquality' }) : item))
                : [];
        };
        const history = {
            mainnet: {
                [walletId]: migrateHistory(state, 'mainnet', walletId),
            },
            testnet: {
                [walletId]: migrateHistory(state, 'testnet', walletId),
            },
        };
        return Object.assign(Object.assign({}, state), { history });
    }),
};
//# sourceMappingURL=7_multi_provider_swaps.js.map