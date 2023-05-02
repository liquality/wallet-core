import avalanche from '../../mainnet/evm/avalanche';
import { transformMainnetToTestnetChain } from '../../utils';

export default transformMainnetToTestnetChain(
  avalanche,
  {
    name: 'avalanche_testnet',
    coinType: '60',
    networkId: 43113,
    chainId: 43113,
    isTestnet: true,
    rpcUrls: [
      'https://avalanche-fuji.infura.io/v3/37efa691ffec4c41a60aa4a69865d8f6',
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
