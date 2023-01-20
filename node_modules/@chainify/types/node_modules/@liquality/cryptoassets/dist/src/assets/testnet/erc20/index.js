"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_TO_TESTNET_TOKEN_ADDRESS_MAP = exports.TESTNET_ERC20_ASSETS = void 0;
const tslib_1 = require("tslib");
const ethereum_tokens_1 = tslib_1.__importDefault(require("./ethereum-tokens"));
const optimism_tokens_1 = tslib_1.__importDefault(require("./optimism-tokens"));
const polygon_tokens_1 = tslib_1.__importDefault(require("./polygon-tokens"));
const rsk_tokens_1 = tslib_1.__importDefault(require("./rsk-tokens"));
const terra_tokens_1 = tslib_1.__importDefault(require("./terra-tokens"));
const utils_1 = require("../../utils");
const TESTNET_ERC20_ASSETS = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ethereum_tokens_1.default), optimism_tokens_1.default), polygon_tokens_1.default), rsk_tokens_1.default), terra_tokens_1.default);
exports.TESTNET_ERC20_ASSETS = TESTNET_ERC20_ASSETS;
const CHAIN_TO_TESTNET_TOKEN_ADDRESS_MAP = (0, utils_1.transformChainToTokenAddress)(TESTNET_ERC20_ASSETS);
exports.CHAIN_TO_TESTNET_TOKEN_ADDRESS_MAP = CHAIN_TO_TESTNET_TOKEN_ADDRESS_MAP;
//# sourceMappingURL=index.js.map