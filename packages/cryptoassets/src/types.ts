export interface Chain {
  name: string;
  code: string;
  nativeAsset: string;
  fees: { unit: string };
  safeConfirmations: number;
  txFailureTimeout: number;
  evmCompatible: boolean;
  hasTokens: boolean;
  supportCustomFees: boolean;
  isValidAddress: (address: string, network?: string) => boolean;
  formatAddress: (address: string, network?: string) => string;
  isValidTransactionHash: (hash: string) => boolean;
  formatTransactionHash: (hash: string) => string;
}

export enum AssetTypes {
  native = 'native',
  erc20 = 'erc20',
}

export type AssetType = AssetTypes.native | AssetTypes.erc20;

export enum ChainId {
  Bitcoin = 'bitcoin',
  BitcoinCash = 'bitcoin_cash',
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
}

export interface Asset {
  name: string;
  chain: ChainId;
  type: AssetType;
  code: string;
  decimals: number;
  coinGeckoId?: string;
  color?: string;
  contractAddress?: string; // ERC20 only
  matchingAsset?: string;
  feeAsset?: string;
}

export type AssetMap = Record<string, Asset>;

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
