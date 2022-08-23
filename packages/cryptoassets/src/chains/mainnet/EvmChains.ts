import { IChain } from '../../interfaces/IChain';
import { AssetTypes, ChainId } from '../../types';
import { EvmChain, RskChain } from '../EvmChain';

export const EVM_CHAINS: { [key in ChainId]?: IChain } = {
  [ChainId.Ethereum]: new EvmChain({
    id: ChainId.Ethereum,
    name: 'Ethereum',
    code: 'ETH',
    color: '#627eea',
    nativeAsset: [
      {
        name: 'Ether',
        chain: ChainId.Ethereum,
        type: AssetTypes.native,
        code: 'ETH',
        priceSource: { coinGeckoId: 'ethereum' },
        color: '#627eea',
        decimals: 18,
      },
    ],
    isEVM: true,
    hasTokens: true,
    averageBlockTime: 15,
    safeConfirmations: 3,
    txFailureTimeoutMs: 3_600_000, // 1 hour
    network: {
      name: 'ethereum_mainnet',
      coinType: '60',
      isTestnet: false,
      chainId: 1,
      networkId: 1,
      rpcUrls: [
        'https://mainnet.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f',
        'https://eth-mainnet.public.blastapi.io',
        'https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7',
        'https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79	',
      ],
    },
    explorerViews: [
      {
        tx: 'https://etherscan.io/tx/',
        address: 'https://etherscan.io/address/',
        token: 'https://etherscan.io/token/',
      },
    ],
    multicallSupport: true,
    ledgerSupport: true,
    EIP1559: true,
    gasLimit: {
      send: {
        native: 21_000,
        nonNative: 100_000,
      },
    },
    fees: {
      unit: 'gwei',
      magnitute: 1e9,
    },
    supportCustomFees: true,
  }),

  [ChainId.BinanceSmartChain]: new EvmChain({
    id: ChainId.BinanceSmartChain,
    name: 'BNB Smart Chain',
    code: 'BSC',
    color: '#F7CA4F',
    nativeAsset: [
      {
        name: 'BNB',
        chain: ChainId.BinanceSmartChain,
        type: AssetTypes.native,
        code: 'BNB',
        priceSource: { coinGeckoId: 'binancecoin' },
        color: '#f9a825',
        decimals: 18,
      },
    ],
    isEVM: true,
    hasTokens: true,
    averageBlockTime: 3,
    safeConfirmations: 5,
    txFailureTimeoutMs: 600_000,
    network: {
      name: 'bsc_mainnet',
      coinType: '60',
      networkId: 56,
      chainId: 56,
      isTestnet: false,
      rpcUrls: ['https://bsc-dataseed.binance.org'],
    },
    explorerViews: [
      {
        tx: 'https://bscscan.com/tx/',
        address: 'https://bscscan.com/address/',
        token: 'https://bscscan.com/token/',
      },
    ],

    multicallSupport: true,
    ledgerSupport: false,

    EIP1559: false,
    gasLimit: {
      send: {
        native: 21_000,
        nonNative: 100_000,
      },
    },
    fees: {
      unit: 'gwei',
      magnitute: 1e9,
    },
    feeMultiplier: { slowMultiplier: 1, averageMultiplier: 2, fastMultiplier: 2.2 },
    supportCustomFees: true,
  }),

  [ChainId.Polygon]: new EvmChain({
    id: ChainId.Polygon,
    name: 'Polygon',
    code: 'POLYGON',
    color: '#8247E5',
    nativeAsset: [
      {
        name: 'Matic',
        chain: ChainId.Polygon,
        type: AssetTypes.native,
        code: 'MATIC',
        priceSource: { coinGeckoId: 'matic-network' },
        color: '#8247E5',
        decimals: 18,
      },
    ],
    isEVM: true,
    hasTokens: true,
    averageBlockTime: 3,
    safeConfirmations: 5,
    txFailureTimeoutMs: 600_000,
    network: {
      name: 'polygon_mainnet',
      coinType: '60',
      networkId: 137,
      chainId: 137,
      isTestnet: false,
      rpcUrls: ['https://polygon-rpc.com'],
    },
    explorerViews: [
      {
        tx: 'https://polygonscan.com/tx/',
        address: 'https://polygonscan.com/address/',
        token: 'https://polygonscan.com/token/',
      },
    ],

    multicallSupport: true,
    ledgerSupport: false,

    EIP1559: true,
    gasLimit: {
      send: {
        native: 21_000,
        nonNative: 100_000,
      },
    },
    fees: {
      unit: 'gwei',
      magnitute: 1e9,
    },
    supportCustomFees: true,
  }),

  [ChainId.Arbitrum]: new EvmChain({
    id: ChainId.Arbitrum,
    name: 'Arbitrum',
    code: 'ARBITRUM',
    color: '#28A0EF',

    nativeAsset: [
      {
        name: 'Arbitrum ETH',
        chain: ChainId.Arbitrum,
        type: AssetTypes.native,
        code: 'ARBETH',
        priceSource: { coinGeckoId: 'ethereum' },
        color: '#28A0EF',
        decimals: 18,
        matchingAsset: 'ETH',
      },
    ],

    isEVM: true,
    hasTokens: true,

    averageBlockTime: 3,
    safeConfirmations: 5,
    txFailureTimeoutMs: 600_000,

    network: {
      name: 'arbitrum_mainnet',
      coinType: '60',
      networkId: 42161,
      chainId: 42161,
      isTestnet: false,
      rpcUrls: ['https://arbitrum-mainnet.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f'],
    },
    explorerViews: [
      {
        tx: 'https://arbiscan.io/tx/',
        address: 'https://arbiscan.io/address/',
        token: 'https://arbiscan.io/token/',
      },
    ],

    multicallSupport: true,
    ledgerSupport: false,

    EIP1559: false,
    gasLimit: {
      send: {
        native: 500_000,
        nonNative: 650_000,
      },
    },
    fees: {
      unit: 'gwei',
      magnitute: 1e9,
    },
    feeMultiplier: { slowMultiplier: 1, averageMultiplier: 1, fastMultiplier: 1.25 },
    supportCustomFees: true,
  }),

  [ChainId.Fuse]: new EvmChain({
    id: ChainId.Fuse,
    name: 'Fuse',
    code: 'FUSE',
    color: '#46e8b6',

    nativeAsset: [
      {
        name: 'Fuse Network',
        chain: ChainId.Fuse,
        type: AssetTypes.native,
        code: 'FUSE',
        priceSource: { coinGeckoId: 'fuse-network-token' },
        color: '#46e8b6',
        decimals: 18,
      },
    ],

    isEVM: true,
    hasTokens: true,

    averageBlockTime: 5,
    safeConfirmations: 10,
    txFailureTimeoutMs: 300_000,

    network: {
      name: 'fuse_mainnet',
      coinType: '60',
      networkId: 122,
      chainId: 122,
      isTestnet: false,
      rpcUrls: ['https://rpc.fuse.io'],
    },
    explorerViews: [
      {
        tx: 'https://explorer.fuse.io/tx/',
        address: 'https://explorer.fuse.io/address/',
        token: 'https://explorer.fuse.io/token/',
      },
    ],

    multicallSupport: true,
    ledgerSupport: false,

    EIP1559: false,
    gasLimit: {
      send: {
        native: 21_000,
        nonNative: 100_000,
      },
    },
    fees: {
      unit: 'gwei',
      magnitute: 1e9,
    },
    feeMultiplier: { slowMultiplier: 1, averageMultiplier: 1, fastMultiplier: 1.25 },
    supportCustomFees: true,
  }),

  [ChainId.Avalanche]: new EvmChain({
    id: ChainId.Avalanche,
    name: 'Avalanche',
    code: 'AVALANCHE',
    color: '#E84141',

    nativeAsset: [
      {
        name: 'Avalanche',
        chain: ChainId.Avalanche,
        type: AssetTypes.native,
        code: 'AVAX',
        priceSource: { coinGeckoId: 'avalanche-2' },
        color: '#E84141',
        decimals: 18,
      },
    ],

    isEVM: true,
    hasTokens: true,

    averageBlockTime: 3,
    safeConfirmations: 10,
    txFailureTimeoutMs: 600_000,

    network: {
      name: 'avalanche_mainnet',
      coinType: '60',
      networkId: 43114,
      chainId: 43114,
      isTestnet: false,
      rpcUrls: [
        'https://speedy-nodes-nyc.moralis.io/7c28a10f7d39bfb24704dafc/avalanche/mainnet',
        'https://api.avax.network/ext/bc/C/rpc',
      ],
    },
    explorerViews: [
      {
        tx: 'https://snowtrace.io/tx/',
        address: 'https://snowtrace.io/address/',
        token: 'https://snowtrace.io/token/',
      },
    ],

    multicallSupport: true,
    ledgerSupport: false,

    EIP1559: true,
    gasLimit: {
      send: {
        native: 21_000,
        nonNative: 100_000,
      },
    },
    fees: {
      unit: 'gwei',
      magnitute: 1e9,
    },
    feeMultiplier: { slowMultiplier: 1, averageMultiplier: 1, fastMultiplier: 1.25 },
    supportCustomFees: true,
  }),

  [ChainId.Rootstock]: new RskChain({
    id: ChainId.Rootstock,
    name: 'Rootstock',
    code: 'RSK',
    color: '#3AB24D',

    nativeAsset: [
      {
        name: 'Rootstock BTC',
        chain: ChainId.Rootstock,
        type: AssetTypes.native,
        code: 'RBTC',
        priceSource: { coinGeckoId: 'rootstock' },
        color: '#006e3c',
        decimals: 18,
      },
    ],

    isEVM: true,
    hasTokens: true,

    averageBlockTime: 3,
    safeConfirmations: 5,
    txFailureTimeoutMs: 1_800_000,

    network: {
      name: 'rsk_mainnet',
      coinType: '60',
      networkId: 30,
      chainId: 30,
      isTestnet: false,
      rpcUrls: ['https://mainnet.sovryn.app/rpc'],
    },
    explorerViews: [
      {
        tx: 'https://explorer.rsk.co/tx/',
        address: 'https://explorer.rsk.co/address/',
      },
    ],

    multicallSupport: true,
    ledgerSupport: false,

    EIP1559: false,
    gasLimit: {
      send: {
        native: 21_000,
        nonNative: 100_000,
      },
    },
    fees: {
      unit: 'gwei',
      magnitute: 1e9,
    },
    feeMultiplier: { slowMultiplier: 1, averageMultiplier: 1, fastMultiplier: 1.25 },
    supportCustomFees: true,
  }),
};
