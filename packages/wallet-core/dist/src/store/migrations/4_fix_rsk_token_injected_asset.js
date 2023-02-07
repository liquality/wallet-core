"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixRSKTokenInjectedAsset = void 0;
const tslib_1 = require("tslib");
exports.fixRSKTokenInjectedAsset = {
    version: 4,
    migrate: (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        if (state.injectEthereumAsset === 'RSK') {
            const injectEthereumAsset = 'RBTC';
            return Object.assign(Object.assign({}, state), { injectEthereumAsset });
        }
        return Object.assign({}, state);
    }),
};
//# sourceMappingURL=4_fix_rsk_token_injected_asset.js.map