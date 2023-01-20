"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TESTNET_NON_EVM_CHAINS = void 0;
const tslib_1 = require("tslib");
const types_1 = require("../../types");
const near_1 = tslib_1.__importDefault(require("./non-evm/near"));
const solana_1 = tslib_1.__importDefault(require("./non-evm/solana"));
const terra_1 = tslib_1.__importDefault(require("./non-evm/terra"));
exports.TESTNET_NON_EVM_CHAINS = {
    [types_1.ChainId.Near]: near_1.default,
    [types_1.ChainId.Solana]: solana_1.default,
    [types_1.ChainId.Terra]: terra_1.default,
};
//# sourceMappingURL=NonEvmChains.js.map