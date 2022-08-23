import { EvmChain } from '../../../chains/EvmChain';
import { AssetTypes, ChainId } from '../../../types';

export default new EvmChain({
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
});
