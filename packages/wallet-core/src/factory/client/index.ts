import { ChainId } from '@liquality/cryptoassets';
import { AccountInfo, Network } from '../../store/types';
import { createBtcClient, createNearClient, createSolanaClient, createTerraClient } from './clients';
import {
  createArbitrumClient,
  createAvalancheClient,
  createBSCClient,
  createEthClient,
  createFuseClient,
  createOptimismClient,
  createPolygonClient,
  createRskClient,
} from './evm';

export const createClient = (chainId: ChainId, network: Network, mnemonic: string, accountInfo: AccountInfo) => {
  switch (chainId) {
    case ChainId.Bitcoin:
      return createBtcClient(network, mnemonic, accountInfo);
    case ChainId.Rootstock:
      return createRskClient(network, mnemonic, accountInfo);
    case ChainId.BinanceSmartChain:
      return createBSCClient(network, mnemonic, accountInfo);
    case ChainId.Polygon:
      return createPolygonClient(network, mnemonic, accountInfo);
    case ChainId.Arbitrum:
      return createArbitrumClient(network, mnemonic, accountInfo);
    case ChainId.Avalanche:
      return createAvalancheClient(network, mnemonic, accountInfo);
    case ChainId.Fuse:
      return createFuseClient(network, mnemonic, accountInfo);
    case ChainId.Near:
      return createNearClient(network, mnemonic, accountInfo);
    case ChainId.Terra:
      return createTerraClient(network, mnemonic, accountInfo);
    case ChainId.Solana:
      return createSolanaClient(network, mnemonic, accountInfo);
    case ChainId.Optimism:
      return createOptimismClient(network, mnemonic, accountInfo);
    default:
      return createEthClient(network, mnemonic, accountInfo);
  }
};
