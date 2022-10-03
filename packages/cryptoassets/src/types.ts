import { IAsset } from './interfaces/IAsset';
import { IChain } from './interfaces/IChain';

export enum AssetTypes {
  native = 'native',
  erc20 = 'erc20',
}

export type AssetType = AssetTypes.native | AssetTypes.erc20;

export enum ChainId {
  Bitcoin = 'bitcoin',
  Ethereum = 'ethereum',
  Rootstock = 'rsk',
  BinanceSmartChain = 'bsc',
  Near = 'near',
  Polygon = 'polygon',
  Arbitrum = 'arbitrum',
  Solana = 'solana',
  Fuse = 'fuse',
  Terra = 'terra',
  Avalanche = 'avalanche',
  Optimism = 'optimism',
}

export type AssetMap = Record<string, IAsset>;

export type ExplorerView = {
  tx?: string;
  address?: string;
  token?: string;
};

export type FeeMultiplier = {
  slowMultiplier: number;
  averageMultiplier: number;
  fastMultiplier: number;
};

export type MakeOptional<Type, Key extends keyof Type> = Omit<Type, Key> & Partial<Type>;

// TODO: merge with wallet-core
export enum Network {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

export type ChainsMap = { [key in ChainId]?: IChain };

export enum NftProviderType {
  OpenSea = 'opensea',
  Moralis = 'moralis',
  Covalent = 'covalent',
}
