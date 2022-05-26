import { ChainId } from '@liquality/cryptoassets';
import { AccountType, Asset, Network } from '../../store/types';
import cryptoassets from '../../utils/cryptoassets';
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

export const createClient = (
  asset: Asset,
  network: Network,
  mnemonic: string,
  accountType: AccountType,
  derivationPath: string
) => {
  const assetData = cryptoassets[asset];

  switch (assetData.chain) {
    case ChainId.Bitcoin:
      return createBtcClient(network, mnemonic, accountType, derivationPath);
    case ChainId.Rootstock:
      return createRskClient(asset, network, mnemonic, accountType, derivationPath);
    case ChainId.BinanceSmartChain:
      return createBSCClient(asset, network, mnemonic, derivationPath);
    case ChainId.Polygon:
      return createPolygonClient(asset, network, mnemonic, derivationPath);
    case ChainId.Arbitrum:
      return createArbitrumClient(asset, network, mnemonic, derivationPath);
    case ChainId.Avalanche:
      return createAvalancheClient(asset, network, mnemonic, derivationPath);
    case ChainId.Fuse:
      return createFuseClient(asset, network, mnemonic, derivationPath);
    case ChainId.Optimism:
      return createOptimismClient(asset, network, mnemonic, derivationPath);
    case ChainId.Near:
      return createNearClient(network, mnemonic, derivationPath);
    case ChainId.Terra:
      return createTerraClient(network, mnemonic, derivationPath);
    case ChainId.Solana:
      return createSolanaClient(network, mnemonic, derivationPath);
    default:
      return createEthClient(asset, network, mnemonic, accountType, derivationPath);
  }
};
