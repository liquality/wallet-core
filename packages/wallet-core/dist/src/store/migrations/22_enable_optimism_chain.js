"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableOptimismChain = void 0;
const cryptoassets_1 = require("@liquality/cryptoassets");
const enable_chain_1 = require("./enable_chain");
exports.enableOptimismChain = {
    version: 22,
    migrate: (state) => (0, enable_chain_1.enableChain)(state, cryptoassets_1.ChainId.Optimism),
};
//# sourceMappingURL=22_enable_optimism_chain.js.map