import { EvmChain } from '../../../chains/EvmChain';
import { AssetTypes, ChainId } from '../../../types';

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
});
