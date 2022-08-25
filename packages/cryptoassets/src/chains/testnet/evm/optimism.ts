import optimism from '../../../chains/mainnet/evm/optimism';
import { transformMainnetToTestnetChain } from '../../../chains/utils';

export default transformMainnetToTestnetChain(
  optimism,
  {
    name: 'optimism_testnet',
    coinType: '60',
    networkId: 69,
    chainId: 69,
    isTestnet: true,
    rpcUrls: ['https://optimism-kovan.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f'],
  },
  [
    {
      tx: 'https://kovan-optimistic.etherscan.io/tx/',
      address: 'https://kovan-optimistic.etherscan.io/address/',
      token: 'https://kovan-optimistic.etherscan.io/token/',
    },
  ],
  'https://optimismfaucet.xyz/'
);
