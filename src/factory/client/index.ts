import { Nullable } from '@chainify/types';
import { ChainId } from '@liquality/cryptoassets';
import { Account, AccountType, Asset, Network } from '../../store/types';
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

export const createClient = (
  asset: Asset,
  network: Network,
  mnemonic: string,
  accountType: AccountType,
  derivationPath: string,
  account?: Nullable<Account>
) => {
  const assetData = cryptoassets[asset];

  if (!assetData) {
    console.error('Asset ', asset);
    console.error('Asset Data ', assetData);
    throw new Error('Asset not found');
  }

  switch (assetData.chain) {
    case ChainId.Bitcoin:
      return createBtcClient(network, mnemonic, accountType, derivationPath, account);
    case ChainId.Rootstock:
      return createRskClient(network, mnemonic, accountType, derivationPath);
    case ChainId.BinanceSmartChain:
      return createBSCClient(network, mnemonic, derivationPath);
    case ChainId.Polygon:
      return createPolygonClient(network, mnemonic, derivationPath);
    case ChainId.Arbitrum:
      return createArbitrumClient(network, mnemonic, derivationPath);
    case ChainId.Avalanche:
      return createAvalancheClient(network, mnemonic, derivationPath);
    case ChainId.Fuse:
      return createFuseClient(network, mnemonic, derivationPath);
    case ChainId.Near:
      return createNearClient(network, mnemonic, derivationPath);
    case ChainId.Terra:
      return createTerraClient(network, mnemonic, derivationPath);
    case ChainId.Solana:
      return createSolanaClient(network, mnemonic, derivationPath);
    default:
      return createEthClient(network, mnemonic, accountType, derivationPath);
  }
};
