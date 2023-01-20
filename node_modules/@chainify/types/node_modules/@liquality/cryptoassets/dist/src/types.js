"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftProviderType = exports.Network = exports.ChainId = exports.AssetTypes = void 0;
var AssetTypes;
(function (AssetTypes) {
    AssetTypes["native"] = "native";
    AssetTypes["erc20"] = "erc20";
})(AssetTypes = exports.AssetTypes || (exports.AssetTypes = {}));
var ChainId;
(function (ChainId) {
    ChainId["Bitcoin"] = "bitcoin";
    ChainId["Ethereum"] = "ethereum";
    ChainId["Rootstock"] = "rsk";
    ChainId["BinanceSmartChain"] = "bsc";
    ChainId["Near"] = "near";
    ChainId["Polygon"] = "polygon";
    ChainId["Arbitrum"] = "arbitrum";
    ChainId["Solana"] = "solana";
    ChainId["Fuse"] = "fuse";
    ChainId["Terra"] = "terra";
    ChainId["Avalanche"] = "avalanche";
    ChainId["Optimism"] = "optimism";
})(ChainId = exports.ChainId || (exports.ChainId = {}));
var Network;
(function (Network) {
    Network["Mainnet"] = "mainnet";
    Network["Testnet"] = "testnet";
})(Network = exports.Network || (exports.Network = {}));
var NftProviderType;
(function (NftProviderType) {
    NftProviderType["OpenSea"] = "opensea";
    NftProviderType["Moralis"] = "moralis";
    NftProviderType["Covalent"] = "covalent";
})(NftProviderType = exports.NftProviderType || (exports.NftProviderType = {}));
//# sourceMappingURL=types.js.map