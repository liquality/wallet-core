import validateBitcoinAddress from 'bitcoin-address-validation';
import { isValidAddress, toChecksumAddress } from 'ethereumjs-util';

import {
  formatBitcoinCashAddress,
  getRSKChainID,
  isValidBitcoinCashAddress,
  isValidHexWith0xPrefix,
  isValidHexWithout0xPrefix,
  isValidNearAddress,
  isValidNearTx,
  isValidSolanaAddress,
  isValidSolanaTx,
  isValidTerraAddress,
  isValidTerraTx,
  toLowerCaseWithout0x,
  with0x,
} from './common';
import { Chain, ChainId } from './types';

const chains: { [key in ChainId]: Chain } = {
  [ChainId.Bitcoin]: {
    name: 'Bitcoin',
    code: 'BTC',
    nativeAsset: 'BTC',
    fees: {
      unit: 'sat/b',
    },
    safeConfirmations: 1,
    // 0,1 blocks per minute * 180 minutes (3 hours) -> 18 blocks wait period
    txFailureTimeout: 10800000, // 3 hours in ms
    evmCompatible: false,
    hasTokens: false,
    supportCustomFees: true,
    // TODO: include network types in validation
    isValidAddress: (address) => !!validateBitcoinAddress(address),
    formatAddress: (address) => address,
    isValidTransactionHash: (hash: string) => isValidHexWithout0xPrefix(hash),
    formatTransactionHash: (hash: string) => toLowerCaseWithout0x(hash),
  },
  [ChainId.BitcoinCash]: {
    name: 'Bitcoin Cash',
    code: 'BCH',
    nativeAsset: 'BCH',
    fees: {
      unit: 'sat/b',
    },
    safeConfirmations: 1,
    // ~0,1 blocks per minute * 180 minutes (3 hours) -> 18 blocks wait period
    txFailureTimeout: 10800000, // 3 hours in ms
    evmCompatible: false,
    hasTokens: false,
    supportCustomFees: true,
    // TODO: include network types in validation
    isValidAddress: (address) => isValidBitcoinCashAddress(address),
    formatAddress: (address) => formatBitcoinCashAddress(address),
    isValidTransactionHash: (hash: string) => isValidHexWithout0xPrefix(hash),
    formatTransactionHash: (hash: string) => toLowerCaseWithout0x(hash),
  },
  [ChainId.Ethereum]: {
    name: 'Ethereum',
    code: 'ETH',
    nativeAsset: 'ETH',
    fees: {
      unit: 'gwei',
    },
    safeConfirmations: 3,
    // ~4 blocks per minute * 30 minutes -> 120 blocks wait period
    txFailureTimeout: 1800000, // in ms
    evmCompatible: true,
    hasTokens: true,
    supportCustomFees: true,
    isValidAddress: (hexAddress: string) => isValidAddress(with0x(hexAddress)),
    formatAddress: (hexAddress: string) => toChecksumAddress(with0x(hexAddress)),
    isValidTransactionHash: (hash: string) => isValidHexWith0xPrefix(hash),
    formatTransactionHash: (hash: string) => toLowerCaseWithout0x(hash),
  },
  [ChainId.Rootstock]: {
    name: 'Rootstock',
    code: 'RSK',
    nativeAsset: 'RBTC',
    fees: {
      unit: 'gwei',
    },
    safeConfirmations: 5,
    // ~3 blocks per minute * 30 minutes -> 90 blocks wait period
    txFailureTimeout: 1800000, // in ms
    evmCompatible: true,
    hasTokens: true,
    supportCustomFees: true,
    isValidAddress: (hexAddress: string) => isValidAddress(with0x(hexAddress)),
    formatAddress: (hexAddress: string, network: string) =>
      toChecksumAddress(with0x(hexAddress), getRSKChainID(network)),
    isValidTransactionHash: (hash: string) => isValidHexWith0xPrefix(hash),
    formatTransactionHash: (hash: string) => toLowerCaseWithout0x(hash),
  },
  [ChainId.BinanceSmartChain]: {
    name: 'Binance Smart Chain',
    code: 'BSC',
    nativeAsset: 'BNB',
    fees: {
      unit: 'gwei',
    },
    safeConfirmations: 5,
    // ~20 blocks per minute * 10 minutes -> 200 blocks wait period
    txFailureTimeout: 600000, // in ms
    evmCompatible: true,
    hasTokens: true,
    supportCustomFees: true,
    isValidAddress: (hexAddress: string) => isValidAddress(with0x(hexAddress)),
    formatAddress: (hexAddress: string) => toChecksumAddress(with0x(hexAddress)),
    isValidTransactionHash: (hash: string) => isValidHexWith0xPrefix(hash),
    formatTransactionHash: (hash: string) => toLowerCaseWithout0x(hash),
  },
  [ChainId.Near]: {
    name: 'Near',
    code: 'NEAR',
    nativeAsset: 'NEAR',
    fees: {
      unit: 'TGas',
    },
    safeConfirmations: 10,
    // ~50 blocks per minute * 5 minutes -> 250 blocks wait period
    txFailureTimeout: 300000, // in ms
    evmCompatible: false,
    hasTokens: false,
    supportCustomFees: true,
    isValidAddress: (address) => isValidNearAddress(address),
    formatAddress: (address) => address,
    isValidTransactionHash: (hash: string) => isValidNearTx(hash),
    formatTransactionHash: (hash: string) => hash,
  },
  [ChainId.Solana]: {
    name: 'Solana',
    code: 'SOL',
    nativeAsset: 'SOL',
    fees: {
      unit: 'Lamports',
    },
    safeConfirmations: 10,
    // ~120 blocks per minute * 5 minutes -> 600 blocks wait period
    txFailureTimeout: 300000, // in ms
    evmCompatible: false,
    hasTokens: false,
    supportCustomFees: false,
    isValidAddress: (address) => isValidSolanaAddress(address),
    formatAddress: (address) => address,
    isValidTransactionHash: (hash: string) => isValidSolanaTx(hash),
    formatTransactionHash: (hash: string) => hash,
  },
  [ChainId.Terra]: {
    name: 'Terra',
    code: 'LUNA',
    nativeAsset: 'LUNA',
    fees: {
      unit: 'LUNA',
    },
    safeConfirmations: 1,
    // ~10 blocks per minute * 15 minutes -> 150 blocks wait period
    txFailureTimeout: 900000, // in ms
    evmCompatible: false,
    hasTokens: true,
    supportCustomFees: true,
    isValidAddress: (address) => isValidTerraAddress(address),
    formatAddress: (address) => address,
    isValidTransactionHash: (hash: string) => isValidTerraTx(hash),
    formatTransactionHash: (hash: string) => hash,
  },
  [ChainId.Polygon]: {
    name: 'Polygon',
    code: 'POLYGON',
    nativeAsset: 'MATIC',
    fees: {
      unit: 'gwei',
    },
    safeConfirmations: 5,
    // ~30 blocks per minute * 10 minutes -> 300 blocks wait period
    txFailureTimeout: 600000, // in ms
    evmCompatible: true,
    hasTokens: true,
    supportCustomFees: true,
    isValidAddress: (hexAddress: string) => isValidAddress(with0x(hexAddress)),
    formatAddress: (hexAddress: string) => toChecksumAddress(with0x(hexAddress)),
    isValidTransactionHash: (hash: string) => isValidHexWith0xPrefix(hash),
    formatTransactionHash: (hash: string) => toLowerCaseWithout0x(hash),
  },
  [ChainId.Arbitrum]: {
    name: 'Arbitrum',
    code: 'ARBITRUM',
    nativeAsset: 'ARBETH',
    fees: {
      unit: 'gwei',
    },
    safeConfirmations: 5,
    // ~15 blocks per minute * 10 minutes -> 150 blocks wait period
    txFailureTimeout: 600000, // in ms
    evmCompatible: true,
    hasTokens: true,
    supportCustomFees: true,
    isValidAddress: (hexAddress: string) => isValidAddress(with0x(hexAddress)),
    formatAddress: (hexAddress: string) => toChecksumAddress(with0x(hexAddress)),
    isValidTransactionHash: (hash: string) => isValidHexWith0xPrefix(hash),
    formatTransactionHash: (hash: string) => toLowerCaseWithout0x(hash),
  },
  [ChainId.Fuse]: {
    name: 'Fuse',
    code: 'FUSE',
    nativeAsset: 'FUSE',
    fees: {
      unit: 'gwei',
    },
    safeConfirmations: 5,
    // ~12 blocks per minute * 15 minutes -> 180 blocks wait period
    txFailureTimeout: 900000, // in ms
    evmCompatible: true,
    hasTokens: true,
    supportCustomFees: true,
    isValidAddress: (hexAddress: string) => isValidAddress(with0x(hexAddress)),
    formatAddress: (hexAddress: string) => toChecksumAddress(with0x(hexAddress)),
    isValidTransactionHash: (hash: string) => isValidHexWith0xPrefix(hash),
    formatTransactionHash: (hash: string) => toLowerCaseWithout0x(hash),
  },
  [ChainId.Avalanche]: {
    name: 'Avalanche',
    code: 'AVALANCHE',
    nativeAsset: 'AVAX',
    fees: {
      unit: 'gwei',
    },
    safeConfirmations: 5,
    // ~15 blocks per minute * 10 minutes -> 150 blocks wait period
    txFailureTimeout: 600000, // in ms
    evmCompatible: true,
    hasTokens: true,
    supportCustomFees: true,
    isValidAddress: (hexAddress: string) => isValidAddress(with0x(hexAddress)),
    formatAddress: (hexAddress: string) => toChecksumAddress(with0x(hexAddress)),
    isValidTransactionHash: (hash: string) => isValidHexWith0xPrefix(hash),
    formatTransactionHash: (hash: string) => hash,
  },
};

function isEthereumChain(chain: ChainId) {
  return chains[chain].evmCompatible;
}

function hasTokens(chain: ChainId) {
  return chains[chain].hasTokens;
}

export { chains, isEthereumChain, hasTokens };
