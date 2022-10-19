import SovrynMainnetAddresses from '@blobfishkate/sovryncontracts/contracts-mainnet.json';
import SovrynTestnetAddresses from '@blobfishkate/sovryncontracts/contracts-testnet.json';
import { ChainId } from '@liquality/cryptoassets';
import { Asset, Network, SwapProviderType } from './store/types';
import { HTLC_CONTRACT_ADDRESS } from './utils/chainify';

export interface SwapProviderDefinition {
  name: string;
  icon: string;
  type: SwapProviderType;
  [x: string | number | symbol]: unknown;
}

export interface WalletCoreConfig {
  defaultAssets: {
    [key in Network]: Asset[];
  };
  swapProviders: {
    [key in Network]: {
      [providerType in SwapProviderType]?: SwapProviderDefinition;
    };
  };
  networks: Network[];
  chains: ChainId[];
  supportedBridgeAssets: Asset[];
  discordUrl: string;
  infuraApiKey: string;
  exploraApis: {
    [key in Network]: string;
  };
  batchEsploraApis: {
    [key in Network]: string;
  };
  nameResolvers: {
    uns: {
      resolutionService: string;
      tldAPI: string;
      alchemyKey: string;
    };
  };
}

const config: WalletCoreConfig = {
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
      'OPTUSDC',
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
      [SwapProviderType.Liquality]: {
        name: 'Liquality',
        icon: 'liquality.svg',
        type: SwapProviderType.Liquality,
        routerAddress: HTLC_CONTRACT_ADDRESS,
        agent: process.env.VUE_APP_AGENT_TESTNET_URL || 'https://testnet-dev-agent.liq-chainhub.net',
      },
      [SwapProviderType.LiqualityBoostNativeToERC20]: {
        name: 'Liquality Boost',
        type: SwapProviderType.LiqualityBoostNativeToERC20,
        network: Network.Testnet,
        icon: 'liqualityboost.svg',
        supportedBridgeAssets: ['RBTC', 'AVAX', 'LUNA', 'UST'],
      },
      [SwapProviderType.LiqualityBoostERC20ToNative]: {
        name: 'Liquality Boost',
        type: SwapProviderType.LiqualityBoostERC20ToNative,
        network: Network.Testnet,
        icon: 'liqualityboost.svg',
        supportedBridgeAssets: ['RBTC', 'AVAX', 'LUNA', 'UST'],
      },
      [SwapProviderType.UniswapV2]: {
        name: 'Uniswap V2',
        icon: 'uniswap.svg',
        type: SwapProviderType.UniswapV2,
        routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      },
      [SwapProviderType.Sovryn]: {
        name: 'Sovryn',
        icon: 'sovryn.svg',
        type: SwapProviderType.Sovryn,
        routerAddress: SovrynTestnetAddresses.swapNetwork,
        routerAddressRBTC: SovrynTestnetAddresses.proxy3,
        rpcURL: 'https://testnet.sovryn.app/rpc',
      },
      [SwapProviderType.FastBTCWithdraw]: {
        name: 'FastBTC',
        icon: 'sovryn.svg',
        type: SwapProviderType.FastBTCWithdraw,
        network: Network.Testnet,
        routerAddress: '0x10C848e9495a32acA95F6c23C92eCA2b2bE9903A',
      },
    },
    mainnet: {
      [SwapProviderType.Liquality]: {
        name: 'Liquality',
        icon: 'liquality.svg',
        type: SwapProviderType.Liquality,
        agent: process.env.VUE_APP_AGENT_MAINNET_URL || 'https://mainnet-dev-agent.liq-chainhub.net',
      },
      [SwapProviderType.LiqualityBoostNativeToERC20]: {
        name: 'Liquality Boost',
        type: SwapProviderType.LiqualityBoostNativeToERC20,
        network: Network.Mainnet,
        icon: 'liqualityboost.svg',
        supportedBridgeAssets: ['RBTC', 'AVAX', 'LUNA', 'UST'],
      },
      [SwapProviderType.LiqualityBoostERC20ToNative]: {
        name: 'Liquality Boost',
        type: SwapProviderType.LiqualityBoostERC20ToNative,
        network: Network.Mainnet,
        icon: 'liqualityboost.svg',
        supportedBridgeAssets: ['RBTC', 'AVAX', 'LUNA', 'UST'],
      },
      [SwapProviderType.UniswapV2]: {
        name: 'Uniswap V2',
        icon: 'uniswap.svg',
        type: SwapProviderType.UniswapV2,
        routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      },
      [SwapProviderType.OneInch]: {
        name: 'Oneinch V4',
        icon: 'oneinch.svg',
        type: SwapProviderType.OneInch,
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
      [SwapProviderType.FastBTCDeposit]: {
        name: 'FastBTC',
        icon: 'sovryn.svg',
        type: SwapProviderType.FastBTCDeposit,
        bridgeEndpoint: 'https://fastbtc.sovryn.app',
      },
      [SwapProviderType.FastBTCWithdraw]: {
        name: 'FastBTC',
        icon: 'sovryn.svg',
        type: SwapProviderType.FastBTCWithdraw,
        network: Network.Mainnet,
        routerAddress: '0x0D5006330289336ebdF9d0AC9E0674f91b4851eA',
      },
      [SwapProviderType.Sovryn]: {
        name: 'Sovryn',
        icon: 'sovryn.svg',
        type: SwapProviderType.Sovryn,
        routerAddress: SovrynMainnetAddresses.swapNetwork,
        routerAddressRBTC: SovrynMainnetAddresses.proxy3,
        rpcURL: 'https://mainnet.sovryn.app/rpc',
      },
      [SwapProviderType.Thorchain]: {
        name: 'Thorchain',
        icon: 'thorchain.svg',
        type: SwapProviderType.Thorchain,
        thornode: 'https://thornode.thorchain.info',
      },
      [SwapProviderType.Astroport]: {
        name: 'Astroport',
        icon: 'astroport.svg',
        type: SwapProviderType.Astroport,
        URL: 'https://lcd.terra.dev',
        chainID: 'columbus-5',
      },
      [SwapProviderType.Jupiter]: {
        name: 'Jupiter',
        icon: 'jupiter.svg',
        type: SwapProviderType.Jupiter,
      },
      [SwapProviderType.Hop]: {
        name: 'Hop',
        icon: 'hop.svg',
        type: SwapProviderType.Hop,
        graphqlBaseURL: 'https://api.thegraph.com/subgraphs/name/hop-protocol',
      },
      [SwapProviderType.DeBridge]: {
        name: 'DeBridge',
        icon: 'debridge.svg',
        type: SwapProviderType.DeBridge,
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
      [SwapProviderType.LiFi]: {
        name: 'LiFi',
        icon: 'lifi.svg',
        type: SwapProviderType.LiFi,
        apiURL: 'https://li.quest/v1/',
      },
    },
  },
  discordUrl: 'https://discord.gg/Xsqw7PW8wk',
  networks: [Network.Mainnet, Network.Testnet],
  chains: Object.values(ChainId),
  supportedBridgeAssets: ['RBTC', 'AVAX'],
  nameResolvers: {
    uns: {
      resolutionService: 'https://unstoppabledomains.g.alchemy.com/domains/',
      tldAPI: 'https://resolve.unstoppabledomains.com/supported_tlds',
      alchemyKey: 'bKmEKAC4HJUEDNlnoYITvXYuhrIshFsa',
    },
  },
};

export default config;
