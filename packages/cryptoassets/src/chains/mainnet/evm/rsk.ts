import { RskChain } from '../../../chains/EvmChain';
import { AssetTypes, ChainId } from '../../../types';

export default new RskChain({
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
  isMultiLayered: false,

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
      tx: 'https://explorer.rsk.co/tx/{hash}',
      address: 'https://explorer.rsk.co/address/{address}',
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
    magnitude: 1e9,
  },
  feeMultiplier: { slowMultiplier: 1, averageMultiplier: 1, fastMultiplier: 1.25 },
  supportCustomFees: true,
});
