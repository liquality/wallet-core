"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNetworkCustomTokens = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
exports.addNetworkCustomTokens = {
    version: 3,
    migrate: (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const customTokens = {
            mainnet: {
                [state.activeWalletId]: (_b = (_a = state.customTokens) === null || _a === void 0 ? void 0 : _a.mainnet) === null || _b === void 0 ? void 0 : _b[state.activeWalletId].map((token) => (Object.assign(Object.assign({}, token), { network: cryptoassets_1.ChainId.Ethereum }))),
            },
            testnet: {
                [state.activeWalletId]: (_d = (_c = state.customTokens) === null || _c === void 0 ? void 0 : _c.testnet) === null || _d === void 0 ? void 0 : _d[state.activeWalletId].map((token) => (Object.assign(Object.assign({}, token), { network: cryptoassets_1.ChainId.Ethereum }))),
            },
        };
        return Object.assign(Object.assign({}, state), { customTokens });
    }),
};
//# sourceMappingURL=3_add_network_custom_tokens.js.map