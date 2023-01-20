"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TESTNET_EVM_CHAINS = void 0;
const tslib_1 = require("tslib");
const types_1 = require("../../types");
const arbitrum_1 = tslib_1.__importDefault(require("./evm/arbitrum"));
const avalanche_1 = tslib_1.__importDefault(require("./evm/avalanche"));
const bsc_1 = tslib_1.__importDefault(require("./evm/bsc"));
const ethereum_1 = tslib_1.__importDefault(require("./evm/ethereum"));
const fuse_1 = tslib_1.__importDefault(require("./evm/fuse"));
const optimism_1 = tslib_1.__importDefault(require("./evm/optimism"));
const polygon_1 = tslib_1.__importDefault(require("./evm/polygon"));
const rsk_1 = tslib_1.__importDefault(require("./evm/rsk"));
exports.TESTNET_EVM_CHAINS = {
    [types_1.ChainId.Ethereum]: ethereum_1.default,
    [types_1.ChainId.BinanceSmartChain]: bsc_1.default,
    [types_1.ChainId.Polygon]: polygon_1.default,
    [types_1.ChainId.Arbitrum]: arbitrum_1.default,
    [types_1.ChainId.Fuse]: fuse_1.default,
    [types_1.ChainId.Avalanche]: avalanche_1.default,
    [types_1.ChainId.Rootstock]: rsk_1.default,
    [types_1.ChainId.Optimism]: optimism_1.default,
};
//# sourceMappingURL=EvmChains.js.map