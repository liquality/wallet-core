"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const NonEvmChain_1 = require("../../NonEvmChain");
exports.default = new NonEvmChain_1.TerraChain({
    id: types_1.ChainId.Terra,
    name: 'Terra',
    code: 'LUNA',
    color: '#008080',
    nativeAsset: [
        {
            name: 'Luna',
            chain: types_1.ChainId.Terra,
            type: types_1.AssetTypes.native,
            code: 'LUNA',
            priceSource: { coinGeckoId: 'terra-luna' },
            color: '#008080',
            decimals: 6,
            feeAsset: 'LUNA',
        },
        {
            name: 'TerraUSD',
            chain: types_1.ChainId.Terra,
            type: types_1.AssetTypes.native,
            code: 'UST',
            priceSource: { coinGeckoId: 'terrausd' },
            decimals: 6,
            color: '#0083ff',
            feeAsset: 'UST',
        },
    ],
    isEVM: false,
    hasTokens: true,
    isMultiLayered: false,
    averageBlockTime: 3,
    safeConfirmations: 1,
    txFailureTimeoutMs: 900000,
    network: {
        name: 'Terra Classic',
        coinType: '330',
        isTestnet: false,
        chainId: 'columbus-5',
        rpcUrls: ['https://lcd.terra.dev'],
        scraperUrls: ['https://fcd.terra.dev/v1'],
    },
    explorerViews: [
        {
            tx: 'https://finder.terra.money/classic/tx/{hash}',
            address: 'https://finder.terra.money/classic/address/{address}',
        },
    ],
    nameService: {
        uns: 'TERRA',
    },
    multicallSupport: false,
    ledgerSupport: false,
    EIP1559: false,
    gasLimit: {
        send: {
            native: 200000,
            nonNative: 200000,
        },
    },
    fees: {
        unit: 'LUNA',
        magnitude: 1e6,
    },
    supportCustomFees: true,
});
//# sourceMappingURL=terra.js.map