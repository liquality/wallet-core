import { EvmChain } from '../../../chains/EvmChain';
import { AssetTypes, ChainId } from '../../../types';

export default new EvmChain({
  id: ChainId.Optimism,
  name: 'Optimism',
  code: 'OPTIMISM',
  color: '#bf0205',
  nativeAsset: [
    {
      name: 'Optimism ETH',
      chain: ChainId.Optimism,
      type: AssetTypes.native,
      code: 'OPTETH',
      priceSource: { coinGeckoId: 'ethereum' },
      color: '#bf0205',
      decimals: 18,
      matchingAsset: 'ETH',
    },
  ],

  isEVM: true,
  hasTokens: true,
  isMultiLayered: true,

  averageBlockTime: 1,
  safeConfirmations: 1,
  txFailureTimeoutMs: 600_000,

  network: {
    name: 'optimism_mainnet',
    coinType: '60',
    networkId: 10,
    chainId: 10,
    isTestnet: false,
    rpcUrls: ['https://optimism-mainnet.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f'],
  },
  explorerViews: [
    {
      tx: 'https://optimistic.etherscan.io/tx/',
      address: 'https://optimistic.etherscan.io/address/',
      token: 'https://optimistic.etherscan.io/token/',
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
    sendL1: {
      native: 5_000,
      nonNative: 5_500,
    },
  },
  fees: {
    unit: 'gwei',
    magnitute: 1e9,
  },
  supportCustomFees: false,
});
