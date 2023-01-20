"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllNonEvmChains = exports.getAllUtxoChains = exports.getAllEvmChains = exports.getAllSupportedChains = exports.isEvmChain = exports.getNativeAssetCode = exports.getChain = exports.TESTNET_SUPPORTED_CHAINS = exports.MAINNET_SUPPORTED_CHAINS = void 0;
const EvmChains_1 = require("./mainnet/EvmChains");
const NonEvmChains_1 = require("./mainnet/NonEvmChains");
const UtxoChains_1 = require("./mainnet/UtxoChains");
const EvmChains_2 = require("./testnet/EvmChains");
const NonEvmChains_2 = require("./testnet/NonEvmChains");
const UtxoChains_2 = require("./testnet/UtxoChains");
exports.MAINNET_SUPPORTED_CHAINS = Object.assign(Object.assign(Object.assign({}, EvmChains_1.EVM_CHAINS), UtxoChains_1.UTXO_CHAINS), NonEvmChains_1.NON_EVM_CHAINS);
exports.TESTNET_SUPPORTED_CHAINS = Object.assign(Object.assign(Object.assign({}, EvmChains_2.TESTNET_EVM_CHAINS), UtxoChains_2.TESTNET_UTXO_CHAINS), NonEvmChains_2.TESTNET_NON_EVM_CHAINS);
function getChain(network, chainId) {
    const chains = getAllSupportedChains();
    return chains[network][chainId];
}
exports.getChain = getChain;
function getNativeAssetCode(network, chainId, index = 0) {
    const chains = getAllSupportedChains();
    return chains[network][chainId].nativeAsset[index].code;
}
exports.getNativeAssetCode = getNativeAssetCode;
function isEvmChain(network, chainId) {
    const chains = getAllSupportedChains();
    return chains[network][chainId].isEVM;
}
exports.isEvmChain = isEvmChain;
function getAllSupportedChains() {
    return {
        mainnet: exports.MAINNET_SUPPORTED_CHAINS,
        testnet: exports.TESTNET_SUPPORTED_CHAINS,
    };
}
exports.getAllSupportedChains = getAllSupportedChains;
function getAllEvmChains() {
    return {
        mainnet: EvmChains_1.EVM_CHAINS,
        testnet: EvmChains_2.TESTNET_EVM_CHAINS,
    };
}
exports.getAllEvmChains = getAllEvmChains;
function getAllUtxoChains() {
    return {
        mainnet: UtxoChains_1.UTXO_CHAINS,
        testnet: UtxoChains_2.TESTNET_UTXO_CHAINS,
    };
}
exports.getAllUtxoChains = getAllUtxoChains;
function getAllNonEvmChains() {
    return {
        mainnet: NonEvmChains_1.NON_EVM_CHAINS,
        testnet: NonEvmChains_2.TESTNET_NON_EVM_CHAINS,
    };
}
exports.getAllNonEvmChains = getAllNonEvmChains;
//# sourceMappingURL=index.js.map