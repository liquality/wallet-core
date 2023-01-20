"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EvmChain_1 = require("../../EvmChain");
const types_1 = require("../../../types");
exports.default = new EvmChain_1.EvmChain({
    id: types_1.ChainId.Avalanche,
    name: 'Avalanche',
    code: 'AVALANCHE',
    color: '#E84141',
    nativeAsset: [
        {
            name: 'Avalanche',
            chain: types_1.ChainId.Avalanche,
            type: types_1.AssetTypes.native,
            code: 'AVAX',
            priceSource: { coinGeckoId: 'avalanche-2' },
            color: '#E84141',
            decimals: 18,
        },
    ],
    isEVM: true,
    hasTokens: true,
    isMultiLayered: false,
    nftProviderType: types_1.NftProviderType.Moralis,
    averageBlockTime: 3,
    safeConfirmations: 10,
    txFailureTimeoutMs: 600000,
    network: {
        name: 'avalanche_mainnet',
        coinType: '60',
        networkId: 43114,
        chainId: 43114,
        isTestnet: false,
        rpcUrls: [
            'https://nd-121-949-157.p2pify.com/b730890d3262b7c31f27895a698f46ed/ext/bc/C/rpc',
            'https://speedy-nodes-nyc.moralis.io/7c28a10f7d39bfb24704dafc/avalanche/mainnet',
            'https://api.avax.network/ext/bc/C/rpc',
        ],
    },
    explorerViews: [
        {
            tx: 'https://snowtrace.io/tx/{hash}',
            address: 'https://snowtrace.io/address/{address}',
            token: 'https://snowtrace.io/token/{token}',
        },
    ],
    nameService: {
        uns: 'AVAX',
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
    feeMultiplier: { slowMultiplier: 1, averageMultiplier: 1, fastMultiplier: 1.25 },
    supportCustomFees: true,
});
//# sourceMappingURL=avalanche.js.map