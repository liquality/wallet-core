"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableTerraChain = void 0;
const cryptoassets_1 = require("@liquality/cryptoassets");
const enable_chain_1 = require("./enable_chain");
exports.enableTerraChain = {
    version: 16,
    migrate: (state) => (0, enable_chain_1.enableChain)(state, cryptoassets_1.ChainId.Terra),
};
//# sourceMappingURL=16_enable_terra_chain.js.map