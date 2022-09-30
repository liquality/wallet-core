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
    rpcUrls: [
      'https://nd-865-707-799.p2pify.com/50bb56fd7bb9cc0f1847f418417c0d7a/ext/bc/C/rpc',
      'https://api.avax-test.network/ext/bc/C/rpc',
    ],
  },
  [
    {
      tx: 'https://testnet.snowtrace.io/tx/{hash}',
      address: 'https://testnet.snowtrace.io/address/{address}',
      token: 'https://testnet.snowtrace.io/token/{token}',
    },
  ],
  'https://faucet.avax.network/'
);
