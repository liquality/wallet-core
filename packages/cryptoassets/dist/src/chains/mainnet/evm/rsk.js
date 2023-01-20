"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EvmChain_1 = require("../../EvmChain");
const types_1 = require("../../../types");
exports.default = new EvmChain_1.RskChain({
    id: types_1.ChainId.Rootstock,
    name: 'Rootstock',
    code: 'RSK',
    color: '#3AB24D',
    nativeAsset: [
        {
            name: 'Rootstock BTC',
            chain: types_1.ChainId.Rootstock,
            type: types_1.AssetTypes.native,
            code: 'RBTC',
            priceSource: { coinGeckoId: 'rootstock' },
            color: '#006e3c',
            decimals: 18,
        },
    ],
    isEVM: true,
    hasTokens: true,
    isMultiLayered: false,
    averageBlockTime: 3,
    safeConfirmations: 5,
    txFailureTimeoutMs: 1800000,
    network: {
        name: 'rsk_mainnet',
        coinType: '60',
        networkId: 30,
        chainId: 30,
        isTestnet: false,
        rpcUrls: ['https://mainnet.sovryn.app/rpc'],
    },
    explorerViews: [
        {
            tx: 'https://explorer.rsk.co/tx/{hash}',
            address: 'https://explorer.rsk.co/address/{address}',
        },
    ],
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
//# sourceMappingURL=rsk.js.map