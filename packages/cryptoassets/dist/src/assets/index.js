"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllNonNativeAssets = exports.getAllNativeAssets = exports.getAllAssets = exports.getToken = exports.getAsset = exports.getAssetSendL1GasLimit = exports.getAssetSendGasLimit = exports.CHAIN_TO_TESTNET_TOKEN_ADDRESS_MAP = exports.TESTNET_ERC20_ASSETS = exports.TESTNET_NATIVE_ASSETS = exports.TESTNET_ASSETS = exports.CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP = exports.MAINNET_ERC20_ASSETS = exports.MAINNET_NATIVE_ASSETS = exports.MAINNET_ASSETS = void 0;
const chains_1 = require("../chains");
const types_1 = require("../types");
const erc20_1 = require("./mainnet/erc20");
Object.defineProperty(exports, "CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP", { enumerable: true, get: function () { return erc20_1.CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP; } });
Object.defineProperty(exports, "MAINNET_ERC20_ASSETS", { enumerable: true, get: function () { return erc20_1.MAINNET_ERC20_ASSETS; } });
const native_1 = require("./mainnet/native");
Object.defineProperty(exports, "MAINNET_NATIVE_ASSETS", { enumerable: true, get: function () { return native_1.MAINNET_NATIVE_ASSETS; } });
const erc20_2 = require("./testnet/erc20");
Object.defineProperty(exports, "CHAIN_TO_TESTNET_TOKEN_ADDRESS_MAP", { enumerable: true, get: function () { return erc20_2.CHAIN_TO_TESTNET_TOKEN_ADDRESS_MAP; } });
Object.defineProperty(exports, "TESTNET_ERC20_ASSETS", { enumerable: true, get: function () { return erc20_2.TESTNET_ERC20_ASSETS; } });
const native_2 = require("./testnet/native");
Object.defineProperty(exports, "TESTNET_NATIVE_ASSETS", { enumerable: true, get: function () { return native_2.TESTNET_NATIVE_ASSETS; } });
const MAINNET_ASSETS = Object.assign(Object.assign({}, native_1.MAINNET_NATIVE_ASSETS), erc20_1.MAINNET_ERC20_ASSETS);
exports.MAINNET_ASSETS = MAINNET_ASSETS;
const TESTNET_ASSETS = Object.assign(Object.assign({}, native_2.TESTNET_NATIVE_ASSETS), erc20_2.TESTNET_ERC20_ASSETS);
exports.TESTNET_ASSETS = TESTNET_ASSETS;
function _getAssetSendGasLimit(asset, network, key) {
    var _a, _b;
    const chains = (0, chains_1.getAllSupportedChains)();
    if (!chains[network]) {
        throw new Error(`Network ${network} missing`);
    }
    if (!chains[network][asset.chain]) {
        throw new Error(`Chain ${asset.chain} is missing from ${network}`);
    }
    if (asset.type == types_1.AssetTypes.native) {
        return (_a = chains[network][asset.chain].gasLimit[key]) === null || _a === void 0 ? void 0 : _a.native;
    }
    else {
        return (_b = chains[network][asset.chain].gasLimit[key]) === null || _b === void 0 ? void 0 : _b.nonNative;
    }
}
function getAssetSendGasLimit(asset, network) {
    return _getAssetSendGasLimit(asset, network, 'send');
}
exports.getAssetSendGasLimit = getAssetSendGasLimit;
function getAssetSendL1GasLimit(asset, network) {
    return _getAssetSendGasLimit(asset, network, 'sendL1');
}
exports.getAssetSendL1GasLimit = getAssetSendL1GasLimit;
function getAsset(network, asset) {
    return getAllAssets()[network][asset];
}
exports.getAsset = getAsset;
function getToken(chain, tokenAddress) {
    if (!erc20_1.CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP[chain]) {
        throw new Error(`Chain not found ${chain}`);
    }
    if (!erc20_1.CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP[chain][tokenAddress]) {
        throw new Error(`Token not found in chain ${chain} with token address ${tokenAddress}`);
    }
    return erc20_1.CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP[chain][tokenAddress];
}
exports.getToken = getToken;
function getAllAssets() {
    return {
        mainnet: MAINNET_ASSETS,
        testnet: TESTNET_ASSETS,
    };
}
exports.getAllAssets = getAllAssets;
function getAllNativeAssets() {
    return {
        mainnet: native_1.MAINNET_NATIVE_ASSETS,
        testnet: native_2.TESTNET_NATIVE_ASSETS,
    };
}
exports.getAllNativeAssets = getAllNativeAssets;
function getAllNonNativeAssets() {
    return {
        mainnet: erc20_1.MAINNET_ERC20_ASSETS,
        testnet: erc20_2.TESTNET_ERC20_ASSETS,
    };
}
exports.getAllNonNativeAssets = getAllNonNativeAssets;
//# sourceMappingURL=index.js.map