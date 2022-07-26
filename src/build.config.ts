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
      [providerId: string]: SwapProviderDefinition;
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
  rskRpcUrls: {
    [key in Network]: string;
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
      'MATIC',
      'PWETH',
      'ARBETH',
      'AVAX',
      'FISH',
      'LUNA',
      'UST',
    ],
    testnet: ['BTC', 'ETH', 'DAI', 'RBTC', 'BNB', 'NEAR', 'SOV', 'MATIC', 'PWETH', 'ARBETH', 'AVAX', 'LUNA', 'UST'],
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
  rskRpcUrls: {
    testnet: 'https://testnet.sovryn.app/rpc',
    mainnet: 'https://mainnet.sovryn.app/rpc',
  },
  swapProviders: {
    testnet: {
      liquality: {
        name: 'Liquality',
        icon: 'liquality.svg',
        type: SwapProviderType.Liquality,
        routerAddress: HTLC_CONTRACT_ADDRESS,
        agent: process.env.VUE_APP_AGENT_TESTNET_URL || 'https://testnet-dev-agent.liq-chainhub.net',
      },
      liqualityBoostNativeToERC20: {
        name: 'Liquality Boost',
        type: SwapProviderType.LiqualityBoostNativeToERC20,
        network: Network.Testnet,
        icon: 'liqualityboost.svg',
        supportedBridgeAssets: ['RBTC', 'MATIC', 'AVAX', 'LUNA', 'UST'],
      },
      liqualityBoostERC20toNative: {
        name: 'Liquality Boost',
        type: SwapProviderType.LiqualityBoostERC20ToNative,
        network: Network.Testnet,
        icon: 'liqualityboost.svg',
        supportedBridgeAssets: ['RBTC', 'MATIC', 'AVAX', 'LUNA', 'UST'],
      },
      uniswapV2: {
        name: 'Uniswap V2',
        icon: 'uniswap.svg',
        type: SwapProviderType.UniswapV2,
        routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      },
      thorchain: {
        name: 'Thorchain',
        icon: 'thorchain.svg',
        type: SwapProviderType.Thorchain,
        thornode: 'https://testnet.thornode.thorchain.info',
      },
      sovryn: {
        name: 'Sovryn',
        icon: 'sovryn.svg',
        type: SwapProviderType.Sovryn,
        routerAddress: SovrynTestnetAddresses.swapNetwork,
        routerAddressRBTC: SovrynTestnetAddresses.proxy3,
        rpcURL: 'https://testnet.sovryn.app/rpc',
      },
    },
    mainnet: {
      liquality: {
        name: 'Liquality',
        icon: 'liquality.svg',
        type: SwapProviderType.Liquality,
        agent: process.env.VUE_APP_AGENT_MAINNET_URL || 'https://mainnet-dev-agent.liq-chainhub.net',
      },
      liqualityBoostNativeToERC20: {
        name: 'Liquality Boost',
        type: SwapProviderType.LiqualityBoostNativeToERC20,
        network: Network.Mainnet,
        icon: 'liqualityboost.svg',
        supportedBridgeAssets: ['RBTC', 'MATIC', 'AVAX', 'LUNA', 'UST'],
      },
      liqualityBoostERC20toNative: {
        name: 'Liquality Boost',
        type: SwapProviderType.LiqualityBoostERC20ToNative,
        network: Network.Mainnet,
        icon: 'liqualityboost.svg',
        supportedBridgeAssets: ['RBTC', 'MATIC', 'AVAX', 'LUNA', 'UST'],
      },
      uniswapV2: {
        name: 'Uniswap V2',
        icon: 'uniswap.svg',
        type: SwapProviderType.UniswapV2,
        routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      },
      oneinchV4: {
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
      fastBTC: {
        name: 'FastBTC',
        icon: 'sovryn.svg',
        type: SwapProviderType.FastBTC,
        bridgeEndpoint: 'http://3.131.33.161:3000/',
      },
      sovryn: {
        name: 'Sovryn',
        icon: 'sovryn.svg',
        type: SwapProviderType.Sovryn,
        routerAddress: SovrynMainnetAddresses.swapNetwork,
        routerAddressRBTC: SovrynMainnetAddresses.proxy3,
        rpcURL: 'https://mainnet.sovryn.app/rpc',
      },
      thorchain: {
        name: 'Thorchain',
        icon: 'thorchain.svg',
        type: SwapProviderType.Thorchain,
        thornode: 'https://thornode.thorchain.info',
      },
      astroport: {
        name: 'Astroport',
        icon: 'astroport.svg',
        type: SwapProviderType.Astroport,
        URL: 'https://lcd.terra.dev',
        chainID: 'columbus-5',
      },
      hop: {
        name: 'Hop',
        icon: 'hop.svg',
        type: SwapProviderType.Hop,
        graphqlBaseURL: 'https://api.thegraph.com/subgraphs/name/hop-protocol',
      },
      lifi: {
        name: 'LiFi',
        icon: 'lifi.svg',
        type: SwapProviderType.LiFi,
        apiURL: 'https://li.quest/v1/',
      },
    },
  },
  discordUrl: 'https://discord.gg/Xsqw7PW8wk',
  networks: [Network.Mainnet, Network.Testnet],
  chains: [
    ChainId.Bitcoin,
    ChainId.Ethereum,
    ChainId.Rootstock,
    ChainId.BinanceSmartChain,
    ChainId.Near,
    ChainId.Polygon,
    ChainId.Arbitrum,
    ChainId.Terra,
    ChainId.Fuse,
    ChainId.Avalanche,
  ],
  supportedBridgeAssets: ['MATIC', 'RBTC', 'AVAX'],
};

export default config;
