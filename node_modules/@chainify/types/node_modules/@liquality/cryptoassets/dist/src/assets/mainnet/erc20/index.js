"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP = exports.MAINNET_ERC20_ASSETS = void 0;
const tslib_1 = require("tslib");
const arbitrum_tokens_1 = tslib_1.__importDefault(require("./arbitrum-tokens"));
const avalanche_tokens_1 = tslib_1.__importDefault(require("./avalanche-tokens"));
const ethereum_tokens_1 = tslib_1.__importDefault(require("./ethereum-tokens"));
const optimism_tokens_1 = tslib_1.__importDefault(require("./optimism-tokens"));
const polygon_tokens_1 = tslib_1.__importDefault(require("./polygon-tokens"));
const rsk_tokens_1 = tslib_1.__importDefault(require("./rsk-tokens"));
const solana_tokens_1 = tslib_1.__importDefault(require("./solana-tokens"));
const terra_tokens_1 = tslib_1.__importDefault(require("./terra-tokens"));
const utils_1 = require("../../utils");
const MAINNET_ERC20_ASSETS = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, arbitrum_tokens_1.default), avalanche_tokens_1.default), ethereum_tokens_1.default), optimism_tokens_1.default), polygon_tokens_1.default), rsk_tokens_1.default), solana_tokens_1.default), terra_tokens_1.default);
exports.MAINNET_ERC20_ASSETS = MAINNET_ERC20_ASSETS;
const CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP = (0, utils_1.transformChainToTokenAddress)(MAINNET_ERC20_ASSETS);
exports.CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP = CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP;
//# sourceMappingURL=index.js.map