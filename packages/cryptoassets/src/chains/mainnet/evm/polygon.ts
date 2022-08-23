import { EvmChain } from '../../../chains/EvmChain';
import { AssetTypes, ChainId } from '../../../types';

export default new EvmChain({
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
});
