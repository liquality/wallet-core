"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const NonEvmChain_1 = require("../../NonEvmChain");
exports.default = new NonEvmChain_1.SolanaChain({
    id: types_1.ChainId.Solana,
    name: 'Solana',
    code: 'SOL',
    color: '#008080',
    nativeAsset: [
        {
            name: 'Solana',
            chain: types_1.ChainId.Solana,
            type: types_1.AssetTypes.native,
            code: 'SOL',
            priceSource: { coinGeckoId: 'solana' },
            color: '#008080',
            decimals: 9,
        },
    ],
    isEVM: false,
    hasTokens: true,
    isMultiLayered: false,
    averageBlockTime: 5,
    safeConfirmations: 10,
    txFailureTimeoutMs: 300000,
    network: {
        name: 'Solana Mainnet',
        coinType: '501',
        isTestnet: false,
        networkId: 'mainnet',
        rpcUrls: [
            'https://nd-157-564-859.p2pify.com/74ee6dc01d553b84db9e7e5272dd2afe',
            'https://solana--mainnet.datahub.figment.io/apikey/d7d9844ccf72ad4fef9bc5caaa957a50',
        ],
    },
    explorerViews: [
        {
            tx: 'https://explorer.solana.com/tx/{hash}',
            address: 'https://explorer.solana.com/address/{address}',
        },
    ],
    nameService: {
        uns: 'SOLANA',
    },
    multicallSupport: false,
    ledgerSupport: false,
    EIP1559: false,
    gasLimit: {
        send: {
            native: 1000000000,
            nonNative: 1000000000,
        },
    },
    fees: {
        unit: 'Lamports',
        magnitude: 1e9,
    },
    supportCustomFees: false,
});
//# sourceMappingURL=solana.js.map