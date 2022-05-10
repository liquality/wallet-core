import { BitcoinNetworks } from '@liquality/bitcoin-networks';
import { ChainId } from '@liquality/cryptoassets';
import { EthereumNetworks } from '@liquality/ethereum-networks';
import { NearNetworks } from '@liquality/near-networks';
import { SolanaNetworks } from '@liquality/solana-networks';
import { TerraNetworks } from '@liquality/terra-networks';
import { Network } from '../store/types';

export const Networks = [Network.Mainnet, Network.Testnet];

export const ChainNetworks = {
  [ChainId.Bitcoin]: {
    testnet: BitcoinNetworks.bitcoin_testnet,
    mainnet: BitcoinNetworks.bitcoin,
  },
  [ChainId.Ethereum]: {
    testnet: EthereumNetworks.ropsten,
    mainnet: EthereumNetworks.ethereum_mainnet,
  },
  [ChainId.Rootstock]: {
    testnet: EthereumNetworks.rsk_testnet,
    mainnet: EthereumNetworks.rsk_mainnet,
  },
  [ChainId.BinanceSmartChain]: {
    testnet: EthereumNetworks.bsc_testnet,
    mainnet: EthereumNetworks.bsc_mainnet,
  },
  [ChainId.Polygon]: {
    testnet: EthereumNetworks.polygon_testnet,
    mainnet: EthereumNetworks.polygon_mainnet,
  },
  [ChainId.Arbitrum]: {
    testnet: EthereumNetworks.arbitrum_testnet,
    mainnet: EthereumNetworks.arbitrum_mainnet,
  },
  [ChainId.Avalanche]: {
    testnet: EthereumNetworks.avax_testnet,
    mainnet: EthereumNetworks.avax_mainnet,
  },
  [ChainId.Near]: {
    testnet: NearNetworks.near_testnet,
    mainnet: NearNetworks.near_mainnet,
  },
  [ChainId.Solana]: {
    testnet: SolanaNetworks.solana_testnet,
    mainnet: SolanaNetworks.solana_mainnet,
  },
  [ChainId.Terra]: {
    testnet: TerraNetworks.terra_testnet,
    mainnet: TerraNetworks.terra_mainnet,
  },
  [ChainId.Fuse]: {
    testnet: {
      name: 'fuse_testnet',
      coinType: '60',
      networkId: 123,
      chainId: 123,
      isTestnet: true,
    }, // TODO: change to EthereumNetworks.fuse_testnet after chainabstractionlayer/pull/491 is merged
    mainnet: EthereumNetworks.fuse_mainnet,
  },
};
