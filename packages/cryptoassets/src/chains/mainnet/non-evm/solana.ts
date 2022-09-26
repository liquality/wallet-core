import { AssetTypes, ChainId } from '../../../types';
import { SolanaChain } from '../../NonEvmChain';

export default new SolanaChain({
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
  isMultiLayered: false,

  averageBlockTime: 5,
  safeConfirmations: 10,
  txFailureTimeoutMs: 300_000,

  network: {
    name: 'Solana Mainnet',
    coinType: '501',
    isTestnet: false,
    networkId: 'mainnet',
    rpcUrls: ['https://nd-157-564-859.p2pify.com/74ee6dc01d553b84db9e7e5272dd2afe'],
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
    magnitude: 1e9,
  },
  supportCustomFees: false,
});
