"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TESTNET_NATIVE_ASSETS = void 0;
const chains_1 = require("../../chains");
const TESTNET_NATIVE_ASSETS = Object.values(chains_1.TESTNET_SUPPORTED_CHAINS).reduce((result, chain) => {
    chain.nativeAsset.forEach((asset) => (result[asset.code] = asset));
    return result;
}, {});
exports.TESTNET_NATIVE_ASSETS = TESTNET_NATIVE_ASSETS;
//# sourceMappingURL=native.js.map