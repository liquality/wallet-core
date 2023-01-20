"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableAvalancheChain = void 0;
const cryptoassets_1 = require("@liquality/cryptoassets");
const enable_chain_1 = require("./enable_chain");
exports.enableAvalancheChain = {
    version: 18,
    migrate: (state) => (0, enable_chain_1.enableChain)(state, cryptoassets_1.ChainId.Avalanche),
};
//# sourceMappingURL=18_enable_avalanche_chain.js.map