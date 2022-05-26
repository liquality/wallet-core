import { BitcoinNetworks } from '@chainify/bitcoin';
import { EvmNetworks } from '@chainify/evm';
import { NearNetworks } from '@chainify/near';
import { SolanaNetworks } from '@chainify/solana';
import { TerraNetworks } from '@chainify/terra';
import { ChainId } from '@liquality/cryptoassets';
import { buildConfig } from '..';
import { Network } from '../store/types';

export const Networks = [Network.Mainnet, Network.Testnet];

export const ChainNetworks = {
  [ChainId.Bitcoin]: {
    testnet: BitcoinNetworks.bitcoin_testnet,
    mainnet: BitcoinNetworks.bitcoin,
  },

  [ChainId.Ethereum]: {
    testnet: {
      ...EvmNetworks.ropsten,
      rpcUrl: `https://ropsten.infura.io/v3/${buildConfig.infuraApiKey}`,
    },
    mainnet: {
      ...EvmNetworks.ethereum_mainnet,
      rpcUrl: `https://mainnet.infura.io/v3/${buildConfig.infuraApiKey}`,
    },
  },

  [ChainId.Rootstock]: {
    testnet: {
      ...EvmNetworks.rsk_testnet,
      rpcUrl: buildConfig.rskRpcUrls.testnet,
    },
    mainnet: {
      ...EvmNetworks.rsk_mainnet,
      rpcUrl: buildConfig.rskRpcUrls.mainnet,
    },
  },

  [ChainId.BinanceSmartChain]: {
    testnet: {
      ...EvmNetworks.bsc_testnet,
      rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    },
    mainnet: {
      ...EvmNetworks.bsc_mainnet,
      rpcUrl: 'https://bsc-dataseed.binance.org',
    },
  },

  [ChainId.Polygon]: {
    testnet: {
      ...EvmNetworks.polygon_testnet,
      rpcUrl: 'https://rpc-mumbai.matic.today',
    },
    mainnet: {
      ...EvmNetworks.polygon_mainnet,
      rpcUrl: 'https://polygon-rpc.com',
    },
  },

  [ChainId.Arbitrum]: {
    testnet: {
      ...EvmNetworks.arbitrum_testnet,
      rpcUrl: 'https://rinkeby.arbitrum.io/rpc',
    },
    mainnet: {
      ...EvmNetworks.arbitrum_mainnet,
      rpcUrl: `https://arbitrum-mainnet.infura.io/v3/${buildConfig.infuraApiKey}`,
    },
  },

  [ChainId.Avalanche]: {
    testnet: {
      ...EvmNetworks.avax_testnet,
      rpcUrl: process.env.VUE_APP_AVALANCHE_TESTNET_NODE || 'https://api.avax-test.network/ext/bc/C/rpc',
    },
    mainnet: {
      ...EvmNetworks.avax_mainnet,
      rpcUrl: process.env.VUE_APP_AVALANCHE_MAINNET_NODE || 'https://api.avax.network/ext/bc/C/rpc',
    },
  },

  [ChainId.Near]: {
    testnet: NearNetworks.near_testnet,
    mainnet: {
      ...NearNetworks.near_mainnet,
      rpcUrl: process.env.VUE_APP_NEAR_MAINNET_URL || NearNetworks.near_mainnet.rpcUrl,
    },
  },

  [ChainId.Solana]: {
    testnet: SolanaNetworks.solana_testnet,
    mainnet: SolanaNetworks.solana_mainnet,
  },

  [ChainId.Terra]: {
    testnet: TerraNetworks.terra_testnet,
    mainnet: {
      ...TerraNetworks.terra_mainnet,
      rpcUrl: process.env.VUE_APP_TERRA_MAINNET_URL || TerraNetworks.terra_mainnet.rpcUrl,
    },
  },

  [ChainId.Fuse]: {
    testnet: {
      ...EvmNetworks.fuse_testnet,
      rpcUrl: 'https://rpc.fusespark.io',
    },
    mainnet: { ...EvmNetworks.fuse_mainnet, rpcUrl: 'https://rpc.fuse.io' },
  },

  [ChainId.Optimism]: {
    testnet: {
      ...EvmNetworks.optimism_testnet,
      rpcUrl: `https://optimism-kovan.infura.io/v3/${buildConfig.infuraApiKey}`,
    },
    mainnet: {
      ...EvmNetworks.optimism_mainnet,
      rpcUrl: `https://optimism-mainnet.infura.io/v3/${buildConfig.infuraApiKey}`,
    },
  },
};
