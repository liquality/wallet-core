"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAINNET_NATIVE_ASSETS = void 0;
const chains_1 = require("../../chains");
const MAINNET_NATIVE_ASSETS = Object.values(chains_1.MAINNET_SUPPORTED_CHAINS).reduce((result, chain) => {
    chain.nativeAsset.forEach((asset) => (result[asset.code] = asset));
    return result;
}, {});
exports.MAINNET_NATIVE_ASSETS = MAINNET_NATIVE_ASSETS;
//# sourceMappingURL=native.js.map