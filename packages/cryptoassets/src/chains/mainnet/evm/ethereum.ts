import { EvmChain } from '../../../chains/EvmChain';
import { AssetTypes, ChainId } from '../../../types';

export default new EvmChain({
  id: ChainId.Ethereum,
  name: 'Ethereum',
  code: 'ETH',
  color: '#627eea',
  nativeAsset: [
    {
      name: 'Ether',
      chain: ChainId.Ethereum,
      type: AssetTypes.native,
      code: 'ETH',
      priceSource: { coinGeckoId: 'ethereum' },
      color: '#627eea',
      decimals: 18,
    },
  ],
  isEVM: true,
  hasTokens: true,
  averageBlockTime: 15,
  safeConfirmations: 3,
  txFailureTimeoutMs: 3_600_000, // 1 hour
  network: {
    name: 'ethereum_mainnet',
    coinType: '60',
    isTestnet: false,
    chainId: 1,
    networkId: 1,
    rpcUrls: [
      'https://mainnet.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f',
      'https://eth-mainnet.public.blastapi.io',
      'https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7',
      'https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79	',
    ],
  },
  explorerViews: [
    {
      tx: 'https://etherscan.io/tx/',
      address: 'https://etherscan.io/address/',
      token: 'https://etherscan.io/token/',
    },
  ],
  multicallSupport: true,
  ledgerSupport: true,
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
