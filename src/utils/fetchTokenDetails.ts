import { ChainId } from '@liquality/cryptoassets';

export const CHAINS_WITH_FETCH_TOKEN_DETAILS = [
  // EVM
  { chainId: ChainId.Ethereum, label: 'Ethereum (ETH)' },
  { chainId: ChainId.Rootstock, label: 'Rootstock (RSK)' },
  { chainId: ChainId.BinanceSmartChain, label: 'Binance Smart Chain (BSC)' },
  { chainId: ChainId.Polygon, label: 'Polygon (MATIC)' },
  { chainId: ChainId.Arbitrum, label: ' Arbitrum (ARB)' },
  { chainId: ChainId.Avalanche, label: 'Avalanche (AVAX)' },
  { chainId: ChainId.Fuse, label: 'Fuse (FUSE)' },
  // NON-EVM
  { chainId: ChainId.Terra, label: 'Terra (LUNA)' },
];
