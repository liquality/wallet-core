import { EvmChain } from '../../EvmChain';
import { AssetTypes, ChainId, NftProviderType } from '../../../types';

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
  nftProviderType: NftProviderType.Infura,

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
      tx: 'https://bscscan.com/tx/{hash}',
      address: 'https://bscscan.com/address/{address}',
      token: 'https://bscscan.com/token/{token}',
    },
  ],

  nameService: {
    uns: 'BEP20',
  },

  multicallSupport: true,
  ledgerSupport: false,
  isMultiLayered: false,

  EIP1559: false,
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
  feeMultiplier: { slowMultiplier: 1, averageMultiplier: 2, fastMultiplier: 2.2 },
  supportCustomFees: true,
});
