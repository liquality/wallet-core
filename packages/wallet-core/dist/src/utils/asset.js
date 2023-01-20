"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openseaLink = exports.getNftLink = exports.getNftTransferLink = exports.getMarketplaceName = exports.estimateGas = exports.getExplorerTransactionHash = exports.getAddressExplorerLink = exports.getTransactionExplorerLink = exports.getAssetColorStyle = exports.getFeeAsset = exports.getNativeAsset = exports.isAssetEvmNativeAsset = exports.isChainEvmCompatible = exports.isERC20 = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const error_parser_1 = require("@liquality/error-parser");
const ethers = tslib_1.__importStar(require("ethers"));
const types_1 = require("../store/types");
const cryptoassets_2 = tslib_1.__importDefault(require("./cryptoassets"));
function getChainExplorer(chainId, network) {
    const chain = (0, cryptoassets_1.getChain)(network, chainId);
    const chainExplorer = chain.explorerViews[0];
    if (!chainExplorer) {
        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Chain.Explorer(chainId));
    }
    return chainExplorer;
}
const isERC20 = (asset) => {
    var _a;
    return ((_a = cryptoassets_2.default[asset]) === null || _a === void 0 ? void 0 : _a.type) === cryptoassets_1.AssetTypes.erc20;
};
exports.isERC20 = isERC20;
const isChainEvmCompatible = (asset, network = types_1.Network.Mainnet) => {
    var _a;
    const chainId = (_a = cryptoassets_2.default[asset]) === null || _a === void 0 ? void 0 : _a.chain;
    return (0, cryptoassets_1.isEvmChain)(network, chainId);
};
exports.isChainEvmCompatible = isChainEvmCompatible;
const isAssetEvmNativeAsset = (asset, network = types_1.Network.Mainnet) => {
    var _a;
    const chainId = (_a = cryptoassets_2.default[asset]) === null || _a === void 0 ? void 0 : _a.chain;
    if (chainId) {
        const chain = (0, cryptoassets_1.getChain)(network, chainId);
        if (chain.isEVM && chain.nativeAsset[0].code === asset) {
            return true;
        }
    }
    return false;
};
exports.isAssetEvmNativeAsset = isAssetEvmNativeAsset;
const getNativeAsset = (asset, network = types_1.Network.Mainnet) => {
    var _a, _b;
    if (((_a = cryptoassets_2.default[asset]) === null || _a === void 0 ? void 0 : _a.type) === cryptoassets_1.AssetTypes.native) {
        return asset;
    }
    const chainId = (_b = cryptoassets_2.default[asset]) === null || _b === void 0 ? void 0 : _b.chain;
    return chainId ? (0, cryptoassets_1.getNativeAssetCode)(network, chainId) : asset;
};
exports.getNativeAsset = getNativeAsset;
const getFeeAsset = (asset) => {
    if (!cryptoassets_2.default[asset]) {
        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Asset.Default);
    }
    return cryptoassets_2.default[asset].feeAsset;
};
exports.getFeeAsset = getFeeAsset;
const getAssetColorStyle = (asset) => {
    const assetData = cryptoassets_2.default[asset];
    if (assetData && assetData.color) {
        return { color: assetData.color };
    }
    return { color: '#000000' };
};
exports.getAssetColorStyle = getAssetColorStyle;
const getTransactionExplorerLink = (hash, asset, network) => {
    const transactionHash = (0, exports.getExplorerTransactionHash)(asset, hash);
    const chain = cryptoassets_2.default[asset].chain;
    const link = `${getChainExplorer(chain, network).tx}`;
    return link.replace('{hash}', transactionHash);
};
exports.getTransactionExplorerLink = getTransactionExplorerLink;
const getAddressExplorerLink = (address, asset, network) => {
    const chain = cryptoassets_2.default[asset].chain;
    const link = `${getChainExplorer(chain, network).address}`;
    return link.replace('{address}', address);
};
exports.getAddressExplorerLink = getAddressExplorerLink;
const getExplorerTransactionHash = (asset, hash) => {
    switch (asset) {
        case 'NEAR':
            return hash.split('_')[0];
        default:
            return hash;
    }
};
exports.getExplorerTransactionHash = getExplorerTransactionHash;
const estimateGas = ({ data, to, value }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const paramsForGasEstimate = {
        data,
        to,
        value,
    };
    const provider = ethers.getDefaultProvider();
    return yield provider.estimateGas(paramsForGasEstimate);
});
exports.estimateGas = estimateGas;
const NFT_ASSETS_MAP = {
    ethereum: {
        testnet: {
            marketplaceName: 'OpenSea',
            url: `https://testnet.opensea.io/`,
            transfer: `https://testnets.opensea.io/assets/{contract_address}/{token_id}`,
        },
        mainnet: {
            marketplaceName: 'OpenSea',
            url: `https://opensea.io/`,
            transfer: `https://opensea.io/assets/{chain}/{contract_address}/{token_id}`,
        },
    },
    polygon: {
        testnet: {
            marketplaceName: 'OpenSea',
            url: `https://testnet.opensea.io/`,
            transfer: `https://testnets.opensea.io/assets/{contract_address}/{token_id}`,
        },
        mainnet: {
            marketplaceName: 'OpenSea',
            url: `https://opensea.io/`,
            transfer: `https://opensea.io/assets/{asset}/{contract_address}/{token_id}`,
        },
    },
    arbitrum: {
        testnet: {
            marketplaceName: 'StratosNFT',
            url: `https://testnet.stratosnft.io/`,
            transfer: `https://testnets.stratosnft.io/asset/{contract_address}/{token_id}`,
        },
        mainnet: {
            marketplaceName: 'StratosNFT',
            url: `https://stratosnft.io/`,
            transfer: `https://stratosnft.io/asset/{contract_address}/{token_id}`,
        },
    },
    solana: {
        testnet: {
            marketplaceName: 'Magic Eden',
            url: `https://magiceden.io/`,
            transfer: `https://magiceden.io/item-details/{contract_address}`,
        },
        mainnet: {
            marketplaceName: 'Magic Eden',
            url: `https://magiceden.io/`,
            transfer: `https://magiceden.io/item-details/{contract_address}`,
        },
    },
};
const getNftAssetsMap = (chainId, network) => {
    const nftAssetsMap = NFT_ASSETS_MAP[chainId];
    if (!nftAssetsMap) {
        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Unsupported.NftAssetMap(chainId, network));
    }
    return nftAssetsMap;
};
const getMarketplaceName = (asset, network) => {
    const chainId = cryptoassets_2.default[asset].chain;
    const nftAssetsMap = getNftAssetsMap(chainId, network);
    const marketplaceName = nftAssetsMap[network].marketplaceName;
    if (!marketplaceName) {
        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Nft.MarketPlaceName(chainId, network));
    }
    else {
        return marketplaceName;
    }
};
exports.getMarketplaceName = getMarketplaceName;
const getNftTransferLink = (asset, network, tokenId, contract_address) => {
    const chainId = cryptoassets_2.default[asset].chain;
    const nftAssetsMap = getNftAssetsMap(chainId, network);
    const transferLink = nftAssetsMap[network].transfer;
    if (!transferLink) {
        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Nft.TransferLink(chainId, network));
    }
    else {
        return transferLink
            .replace('{contract_address}', contract_address)
            .replace('{chain}', chainId)
            .replace('{asset}', asset)
            .replace('{token_id}', tokenId);
    }
};
exports.getNftTransferLink = getNftTransferLink;
const getNftLink = (asset, network) => {
    const chainId = cryptoassets_2.default[asset].chain;
    const nftAssetsMap = getNftAssetsMap(chainId, network);
    const url = nftAssetsMap[network].url;
    if (!url) {
        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Nft.ExplorerLink(chainId, network));
    }
    else {
        return url;
    }
};
exports.getNftLink = getNftLink;
const openseaLink = (network) => {
    return `https://${network === 'testnet' ? 'testnets.' : ''}opensea.io/`;
};
exports.openseaLink = openseaLink;
//# sourceMappingURL=asset.js.map