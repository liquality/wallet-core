"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableSolanaChain = void 0;
const cryptoassets_1 = require("@liquality/cryptoassets");
const enable_chain_1 = require("./enable_chain");
exports.enableSolanaChain = {
    version: 21,
    migrate: (state) => (0, enable_chain_1.enableChain)(state, cryptoassets_1.ChainId.Solana),
};
//# sourceMappingURL=21_enable_solana_chain.js.map