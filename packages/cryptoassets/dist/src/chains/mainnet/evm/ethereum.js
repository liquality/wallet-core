"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EvmChain_1 = require("../../EvmChain");
const types_1 = require("../../../types");
exports.default = new EvmChain_1.EvmChain({
    id: types_1.ChainId.Ethereum,
    name: 'Ethereum',
    code: 'ETH',
    color: '#627eea',
    nativeAsset: [
        {
            name: 'Ether',
            chain: types_1.ChainId.Ethereum,
            type: types_1.AssetTypes.native,
            code: 'ETH',
            priceSource: { coinGeckoId: 'ethereum' },
            color: '#627eea',
            decimals: 18,
        },
    ],
    isEVM: true,
    nftProviderType: types_1.NftProviderType.OpenSea,
    hasTokens: true,
    isMultiLayered: false,
    averageBlockTime: 15,
    safeConfirmations: 3,
    txFailureTimeoutMs: 3600000,
    network: {
        name: 'ethereum_mainnet',
        coinType: '60',
        isTestnet: false,
        chainId: 1,
        networkId: 1,
        rpcUrls: [
            'https://mainnet.infura.io/v3/a2ad6f8c0e57453ca4918331f16de87d',
            'https://eth-mainnet.public.blastapi.io/',
            'https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7',
            'https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79',
        ],
    },
    explorerViews: [
        {
            tx: 'https://etherscan.io/tx/{hash}',
            address: 'https://etherscan.io/address/{address}',
            token: 'https://etherscan.io/token/{token}',
        },
    ],
    nameService: {
        uns: 'ERC20',
    },
    multicallSupport: true,
    ledgerSupport: true,
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
//# sourceMappingURL=ethereum.js.map