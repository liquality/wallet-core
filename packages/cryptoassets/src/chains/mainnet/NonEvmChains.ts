import { IChain } from '../../interfaces/IChain';
import { AssetTypes, ChainId } from '../../types';
import { NearChain, SolanaChain, TerraChain } from '../NonEvmChain';

export const NON_EVM_CHAINS: { [key in ChainId]?: IChain } = {
  [ChainId.Near]: new NearChain({
    id: ChainId.Near,
    name: 'Near',
    code: 'NEAR',
    color: '#000000',

    nativeAsset: [
      {
        name: 'Near',
        chain: ChainId.Near,
        type: AssetTypes.native,
        code: 'NEAR',
        priceSource: { coinGeckoId: 'near' },
        color: '#000000',
        decimals: 24,
      },
    ],

    isEVM: false,
    hasTokens: false,
    averageBlockTime: 5,
    safeConfirmations: 10,
    txFailureTimeoutMs: 300_000,

    network: {
      name: 'Near Mainnet',
      coinType: '397',
      isTestnet: false,
      networkId: 'mainnet',
      rpcUrls: [
        'https://near-mainnet--rpc--archive.datahub.figment.io/apikey/34936f0636daa31fce47a133c923357d',
        'https://rpc.mainnet.near.org',
      ],
    },
    explorerViews: [
      {
        tx: 'https://explorer.near.org/transactions/',
        address: 'https://explorer.near.org/accounts/',
      },
    ],

    multicallSupport: false,
    ledgerSupport: false,

    EIP1559: false,
    gasLimit: {
      send: {
        native: 10_000_000_000_000,
      },
    },
    fees: {
      unit: 'TGas',
      magnitute: 1e12,
    },
    supportCustomFees: false,
  }),

  [ChainId.Solana]: new SolanaChain({
    id: ChainId.Solana,
    name: 'Solana',
    code: 'SOL',
    color: '#008080',

    nativeAsset: [
      {
        name: 'Solana',
        chain: ChainId.Solana,
        type: AssetTypes.native,
        code: 'SOL',
        priceSource: { coinGeckoId: 'solana' },
        color: '#008080',
        decimals: 9,
      },
    ],

    isEVM: false,
    hasTokens: true,

    averageBlockTime: 5,
    safeConfirmations: 10,
    txFailureTimeoutMs: 300_000,

    network: {
      name: 'Solana Mainnet',
      coinType: '501',
      isTestnet: false,
      networkId: 'mainnet',
      rpcUrls: ['https://solana--mainnet.datahub.figment.io/apikey/d7d9844ccf72ad4fef9bc5caaa957a50'],
    },
    explorerViews: [
      {
        tx: 'https://explorer.solana.com/tx/',
        address: 'https://explorer.solana.com/address/',
      },
    ],

    multicallSupport: false,
    ledgerSupport: false,

    EIP1559: false,
    gasLimit: {
      send: {
        native: 1_000_000_000,
      },
    },
    fees: {
      unit: 'Lamports',
      magnitute: 1e9,
    },
    supportCustomFees: false,
  }),

  [ChainId.Terra]: new TerraChain({
    id: ChainId.Terra,
    name: 'Terra',
    code: 'LUNA',
    color: '#008080',

    nativeAsset: [
      {
        name: 'Luna',
        chain: ChainId.Terra,
        type: AssetTypes.native,
        code: 'LUNA',
        priceSource: { coinGeckoId: 'terra-luna' },
        color: '#008080',
        decimals: 6,
        feeAsset: 'LUNA',
      },
      {
        name: 'TerraUSD',
        chain: ChainId.Terra,
        type: AssetTypes.native,
        code: 'UST',
        priceSource: { coinGeckoId: 'terrausd' },
        decimals: 6,
        color: '#0083ff',
        feeAsset: 'UST',
      },
    ],

    isEVM: false,
    hasTokens: true,

    averageBlockTime: 3,
    safeConfirmations: 1,
    txFailureTimeoutMs: 900_000,

    network: {
      name: 'Terra Classic',
      coinType: '330',
      isTestnet: false,
      chainId: 'columbus-5',
      rpcUrls: ['https://lcd.terra.dev'],
      scraperUrls: ['https://fcd.terra.dev/v1'],
    },
    explorerViews: [
      {
        tx: 'https://finder.terra.money/classic/tx/',
        address: 'https://finder.terra.money/classic/address/',
      },
    ],

    multicallSupport: false,
    ledgerSupport: false,

    EIP1559: false,
    gasLimit: {
      send: {
        native: 200_000,
        nonNative: 200_000,
      },
    },
    fees: {
      unit: 'LUNA',
      magnitute: 1e6,
    },
    supportCustomFees: false,
  }),
};
