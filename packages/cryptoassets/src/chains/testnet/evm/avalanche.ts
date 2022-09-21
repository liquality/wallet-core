import avalanche from '../../../chains/mainnet/evm/avalanche';
import { transformMainnetToTestnetChain } from '../../../chains/utils';

export default transformMainnetToTestnetChain(
  avalanche,
  {
    name: 'avalanche_testnet',
    coinType: '60',
    networkId: 43113,
    chainId: 43113,
    isTestnet: true,
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  },
  [
    {
      tx: 'https://testnet.snowtrace.io/tx/',
      address: 'https://testnet.snowtrace.io/address/',
      token: 'https://testnet.snowtrace.io/token/',
    },
  ],
  'https://faucet.avax.network/'
);
