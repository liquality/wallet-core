"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectEthereumAssetChain = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
exports.injectEthereumAssetChain = {
    version: 9,
    migrate: (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const injectEthereumChain = (0, cryptoassets_1.getAsset)(state.activeNetwork, state.injectEthereumAsset).chain || cryptoassets_1.ChainId.Ethereum;
        delete state.injectEthereumAsset;
        return Object.assign(Object.assign({}, state), { injectEthereumChain });
    }),
};
//# sourceMappingURL=9_inject_ethereum_asset_chain.js.map