"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const contracts_mainnet_json_1 = tslib_1.__importDefault(require("@blobfishkate/sovryncontracts/contracts-mainnet.json"));
const cryptoassets_1 = require("@liquality/cryptoassets");
const types_1 = require("./store/types");
const config = {
    defaultAssets: {
        mainnet: [
            'BTC',
            'ETH',
            'DAI',
            'USDC',
            'USDT',
            'WBTC',
            'UNI',
            'RBTC',
            'SOV',
            'BNB',
            'NEAR',
            'SOL',
            'MATIC',
            'PWETH',
            'ARBETH',
            'AVAX',
            'FISH',
            'LUNA',
            'UST',
            'OPTETH',
            'ARBDAI',
            'OPDAI',
            'PDAI',
            'OPTUSDC',
            'ARBUSDC',
            'PUSDC',
            'sUSDC',
            'USDC.e',
            'ARBUSDT',
            'OPUSDT',
            'PUSDT',
            'sUSDT',
            'USDT.e',
        ],
        testnet: [
            'BTC',
            'ETH',
            'DAI',
            'RBTC',
            'BNB',
            'NEAR',
            'SOL',
            'SOV',
            'MATIC',
            'PWETH',
            'ARBETH',
            'AVAX',
            'LUNA',
            'UST',
            'OPTETH',
            'OPTUSDC',
        ],
    },
    infuraApiKey: 'da99ebc8c0964bb8bb757b6f8cc40f1f',
    exploraApis: {
        testnet: 'https://electrs-testnet-api.liq-chainhub.net/',
        mainnet: 'https://electrs-mainnet-api.liq-chainhub.net/',
    },
    batchEsploraApis: {
        testnet: 'https://electrs-batch-testnet-api.liq-chainhub.net/',
        mainnet: 'https://electrs-batch-mainnet-api.liq-chainhub.net/',
    },
    swapProviders: {
        testnet: {
            [types_1.SwapProviderType.TeleSwap]: {
                name: 'TeleSwap',
                icon: 'sovryn.svg',
                type: types_1.SwapProviderType.TeleSwap,
                network: types_1.Network.Testnet,
                QuickSwapRouterAddress: '0x8954AfA98594b838bda56FE4C12a09D7739D179b',
                QuickSwapFactoryAddress: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32'
            },
        },
        mainnet: {
            [types_1.SwapProviderType.Liquality]: {
                name: 'Liquality',
                icon: 'liquality.svg',
                type: types_1.SwapProviderType.Liquality,
                agent: process.env.VUE_APP_AGENT_MAINNET_URL || 'https://mainnet-dev-agent.liq-chainhub.net',
            },
            [types_1.SwapProviderType.LiqualityBoostNativeToERC20]: {
                name: 'Liquality Boost',
                type: types_1.SwapProviderType.LiqualityBoostNativeToERC20,
                network: types_1.Network.Mainnet,
                icon: 'liqualityboost.svg',
                supportedBridgeAssets: ['RBTC', 'AVAX', 'LUNA', 'UST'],
            },
            [types_1.SwapProviderType.LiqualityBoostERC20ToNative]: {
                name: 'Liquality Boost',
                type: types_1.SwapProviderType.LiqualityBoostERC20ToNative,
                network: types_1.Network.Mainnet,
                icon: 'liqualityboost.svg',
                supportedBridgeAssets: ['RBTC', 'AVAX', 'LUNA', 'UST'],
            },
            [types_1.SwapProviderType.UniswapV2]: {
                name: 'Uniswap V2',
                icon: 'uniswap.svg',
                type: types_1.SwapProviderType.UniswapV2,
                routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
            },
            [types_1.SwapProviderType.OneInch]: {
                name: 'Oneinch V4',
                icon: 'oneinch.svg',
                type: types_1.SwapProviderType.OneInch,
                agent: 'https://api.1inch.exchange/v4.0',
                routerAddress: '0x1111111254fb6c44bac0bed2854e76f90643097d',
                referrerAddress: {
                    ethereum: '0x3a712CC47aeb0F20A7C9dE157c05d74B11F172f5',
                    polygon: '0x3a712CC47aeb0F20A7C9dE157c05d74B11F172f5',
                    bsc: '0x3a712CC47aeb0F20A7C9dE157c05d74B11F172f5',
                    avalanche: '0x3a712CC47aeb0F20A7C9dE157c05d74B11F172f5',
                },
                referrerFee: 0.3,
            },
            [types_1.SwapProviderType.FastBTCDeposit]: {
                name: 'FastBTC',
                icon: 'sovryn.svg',
                type: types_1.SwapProviderType.FastBTCDeposit,
                bridgeEndpoint: 'https://fastbtc.sovryn.app',
            },
            [types_1.SwapProviderType.FastBTCWithdraw]: {
                name: 'FastBTC',
                icon: 'sovryn.svg',
                type: types_1.SwapProviderType.FastBTCWithdraw,
                network: types_1.Network.Mainnet,
                routerAddress: '0x0D5006330289336ebdF9d0AC9E0674f91b4851eA',
            },
            [types_1.SwapProviderType.Sovryn]: {
                name: 'Sovryn',
                icon: 'sovryn.svg',
                type: types_1.SwapProviderType.Sovryn,
                routerAddress: contracts_mainnet_json_1.default.swapNetwork,
                routerAddressRBTC: contracts_mainnet_json_1.default.proxy3,
                rpcURL: 'https://mainnet.sovryn.app/rpc',
            },
            [types_1.SwapProviderType.Thorchain]: {
                name: 'Thorchain',
                icon: 'thorchain.svg',
                type: types_1.SwapProviderType.Thorchain,
                thornode: 'https://thornode.thorchain.info',
            },
            [types_1.SwapProviderType.Astroport]: {
                name: 'Astroport',
                icon: 'astroport.svg',
                type: types_1.SwapProviderType.Astroport,
                URL: 'https://lcd.terra.dev',
                chainID: 'columbus-5',
            },
            [types_1.SwapProviderType.Jupiter]: {
                name: 'Jupiter',
                icon: 'jupiter.svg',
                type: types_1.SwapProviderType.Jupiter,
            },
            [types_1.SwapProviderType.DeBridge]: {
                name: 'DeBridge',
                icon: 'debridge.svg',
                type: types_1.SwapProviderType.DeBridge,
                url: 'https://deswap.debridge.finance/v1.0/',
                api: 'https://api.debridge.finance/api/',
                routerAddress: '0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251',
                chains: {
                    1: {
                        deBridgeGateAddress: '0x43dE2d77BF8027e25dBD179B491e8d64f38398aA',
                        signatureVerifier: '0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c',
                        minBlockConfirmation: 12,
                    },
                    56: {
                        deBridgeGateAddress: '0x43dE2d77BF8027e25dBD179B491e8d64f38398aA',
                        signatureVerifier: '0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c',
                        minBlockConfirmation: 12,
                    },
                    42161: {
                        deBridgeGateAddress: '0x43dE2d77BF8027e25dBD179B491e8d64f38398aA',
                        signatureVerifier: '0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c',
                        minBlockConfirmation: 12,
                    },
                    137: {
                        deBridgeGateAddress: '0x43dE2d77BF8027e25dBD179B491e8d64f38398aA',
                        signatureVerifier: '0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c',
                        minBlockConfirmation: 256,
                    },
                    43114: {
                        deBridgeGateAddress: '0x43dE2d77BF8027e25dBD179B491e8d64f38398aA',
                        signatureVerifier: '0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c',
                        minBlockConfirmation: 12,
                    },
                },
            },
            [types_1.SwapProviderType.LiFi]: {
                name: 'LiFi',
                icon: 'lifi.svg',
                type: types_1.SwapProviderType.LiFi,
                apiURL: 'https://li.quest/v1/',
            },
            [types_1.SwapProviderType.TeleSwap]: {
                name: 'TeleSwap',
                icon: 'sovryn.svg',
                type: types_1.SwapProviderType.TeleSwap,
                QuickSwapRouterAddress: '0x0000000000000000000000000000000000000000',
                QuickSwapFactoryAddress: '0x0000000000000000000000000000000000000000'
            },
        },
    },
    discordUrl: 'https://discord.gg/Xsqw7PW8wk',
    networks: [types_1.Network.Mainnet, types_1.Network.Testnet],
    chains: Object.values(cryptoassets_1.ChainId),
    supportedBridgeAssets: ['RBTC', 'AVAX'],
    nameResolvers: {
        uns: {
            resolutionService: 'https://unstoppabledomains.g.alchemy.com/domains/',
            tldAPI: 'https://resolve.unstoppabledomains.com/supported_tlds',
            alchemyKey: 'bKmEKAC4HJUEDNlnoYITvXYuhrIshFsa',
        },
    },
};
exports.default = config;
//# sourceMappingURL=build.config.js.map