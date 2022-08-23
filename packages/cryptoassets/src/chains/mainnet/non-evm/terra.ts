import { AssetTypes, ChainId } from '../../../types';
import { TerraChain } from '../../NonEvmChain';

export default new TerraChain({
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
});
