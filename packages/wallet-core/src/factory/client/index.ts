import { ChainId } from '@liquality/cryptoassets';
import { AccountInfo, Asset, Network } from '../../store/types';
import cryptoassets from '../../utils/cryptoassets';
import { createBtcClient, createNearClient, createSolanaClient, createTerraClient } from './clients';
import {
  createArbitrumClient,
  createAvalancheClient,
  createBSCClient,
  createEthClient,
  createFuseClient,
  createPolygonClient,
  createRskClient,
} from './evm';

export const createClient = (asset: Asset, network: Network, mnemonic: string, accountInfo: AccountInfo) => {
  const assetData = cryptoassets[asset];

  if (!assetData) {
    console.info('Asset ', asset);
    console.info('Asset Data ', assetData);
    throw new Error('Asset not found');
  }

  switch (assetData.chain) {
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
    default:
      return createEthClient(network, mnemonic, accountInfo);
  }
};
