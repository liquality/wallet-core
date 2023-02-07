"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EvmChain_1 = require("../../EvmChain");
const types_1 = require("../../../types");
exports.default = new EvmChain_1.EvmChain({
    id: types_1.ChainId.BinanceSmartChain,
    name: 'BNB Smart Chain',
    code: 'BSC',
    color: '#F7CA4F',
    nativeAsset: [
        {
            name: 'BNB',
            chain: types_1.ChainId.BinanceSmartChain,
            type: types_1.AssetTypes.native,
            code: 'BNB',
            priceSource: { coinGeckoId: 'binancecoin' },
            color: '#f9a825',
            decimals: 18,
        },
    ],
    isEVM: true,
    hasTokens: true,
    nftProviderType: types_1.NftProviderType.Moralis,
    averageBlockTime: 3,
    safeConfirmations: 5,
    txFailureTimeoutMs: 600000,
    network: {
        name: 'bsc_mainnet',
        coinType: '60',
        networkId: 56,
        chainId: 56,
        isTestnet: false,
        rpcUrls: ['https://bsc-dataseed.binance.org'],
    },
    explorerViews: [
        {
            tx: 'https://bscscan.com/tx/{hash}',
            address: 'https://bscscan.com/address/{address}',
            token: 'https://bscscan.com/token/{token}',
        },
    ],
    nameService: {
        uns: 'BEP20',
    },
    multicallSupport: true,
    ledgerSupport: false,
    isMultiLayered: false,
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
    feeMultiplier: { slowMultiplier: 1, averageMultiplier: 2, fastMultiplier: 2.2 },
    supportCustomFees: true,
});
//# sourceMappingURL=bsc.js.map