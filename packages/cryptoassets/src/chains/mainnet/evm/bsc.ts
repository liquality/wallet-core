import { EvmChain } from '../../../chains/EvmChain';
import { AssetTypes, ChainId } from '../../../types';

export default new EvmChain({
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
});
