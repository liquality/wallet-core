import { EvmChain } from '../../EvmChain';
import { AssetTypes, ChainId, NftProviderType } from '../../../types';

export default new EvmChain({
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
  isMultiLayered: false,
  nftProviderType: NftProviderType.Infura,

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
      'https://avalanche-mainnet.infura.io/v3/37efa691ffec4c41a60aa4a69865d8f6',
      'https://api.avax.network/ext/bc/C/rpc',
    ],
  },
  explorerViews: [
    {
      tx: 'https://snowtrace.io/tx/{hash}',
      address: 'https://snowtrace.io/address/{address}',
      token: 'https://snowtrace.io/token/{token}',
    },
  ],

  nameService: {
    uns: 'AVAX',
  },

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
    magnitude: 1e9,
  },
  feeMultiplier: { slowMultiplier: 1, averageMultiplier: 1, fastMultiplier: 1.25 },
  supportCustomFees: true,
});
