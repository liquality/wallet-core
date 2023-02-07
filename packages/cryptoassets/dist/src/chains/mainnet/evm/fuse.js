"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EvmChain_1 = require("../../EvmChain");
const types_1 = require("../../../types");
exports.default = new EvmChain_1.EvmChain({
    id: types_1.ChainId.Fuse,
    name: 'Fuse',
    code: 'FUSE',
    color: '#46e8b6',
    nativeAsset: [
        {
            name: 'Fuse Network',
            chain: types_1.ChainId.Fuse,
            type: types_1.AssetTypes.native,
            code: 'FUSE',
            priceSource: { coinGeckoId: 'fuse-network-token' },
            color: '#46e8b6',
            decimals: 18,
        },
    ],
    isEVM: true,
    hasTokens: true,
    isMultiLayered: false,
    averageBlockTime: 5,
    safeConfirmations: 10,
    txFailureTimeoutMs: 300000,
    network: {
        name: 'fuse_mainnet',
        coinType: '60',
        networkId: 122,
        chainId: 122,
        isTestnet: false,
        rpcUrls: ['https://rpc.fuse.io'],
    },
    explorerViews: [
        {
            tx: 'https://explorer.fuse.io/tx/{hash}',
            address: 'https://explorer.fuse.io/address/{address}',
            token: 'https://explorer.fuse.io/token/{token}',
        },
    ],
    nameService: {
        uns: 'FUSE',
    },
    multicallSupport: true,
    ledgerSupport: false,
    EIP1559: false,
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
//# sourceMappingURL=fuse.js.map