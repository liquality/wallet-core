"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EvmChain_1 = require("../../EvmChain");
const types_1 = require("../../../types");
exports.default = new EvmChain_1.EvmChain({
    id: types_1.ChainId.Polygon,
    name: 'Polygon',
    code: 'POLYGON',
    color: '#8247E5',
    nativeAsset: [
        {
            name: 'Matic',
            chain: types_1.ChainId.Polygon,
            type: types_1.AssetTypes.native,
            code: 'MATIC',
            priceSource: { coinGeckoId: 'matic-network' },
            color: '#8247E5',
            decimals: 18,
        },
    ],
    isEVM: true,
    hasTokens: true,
    isMultiLayered: false,
    nftProviderType: types_1.NftProviderType.Moralis,
    averageBlockTime: 3,
    safeConfirmations: 5,
    txFailureTimeoutMs: 600000,
    network: {
        name: 'polygon_mainnet',
        coinType: '60',
        networkId: 137,
        chainId: 137,
        isTestnet: false,
        rpcUrls: ['https://polygon-mainnet.infura.io/v3/a2ad6f8c0e57453ca4918331f16de87d', 'https://polygon-rpc.com'],
    },
    explorerViews: [
        {
            tx: 'https://polygonscan.com/tx/{hash}',
            address: 'https://polygonscan.com/address/{address}',
            token: 'https://polygonscan.com/token/{token}',
        },
    ],
    nameService: {
        uns: 'MATIC',
    },
    multicallSupport: true,
    ledgerSupport: false,
    EIP1559: true,
    gasLimit: {
        send: {
            native: 21000,
            nonNative: 100000,
        },
    },
    fees: {
        unit: 'gwei',
        magnitude: 1e9,
    },
    supportCustomFees: true,
});
//# sourceMappingURL=polygon.js.map