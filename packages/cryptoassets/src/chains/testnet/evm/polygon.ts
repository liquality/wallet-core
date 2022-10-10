import polygon from '../../../chains/mainnet/evm/polygon';
import { transformMainnetToTestnetChain } from '../../../chains/utils';

export default transformMainnetToTestnetChain(
  polygon,
  {
    name: 'polygon_testnet',
    coinType: '60',
    networkId: 80001,
    chainId: 80001,
    isTestnet: true,
    rpcUrls: [
      'https://polygon-mumbai.infura.io/v3/a2ad6f8c0e57453ca4918331f16de87d',
      'https://matic-testnet-archive-rpc.bwarelabs.com',
    ],
  },
  [
    {
      tx: 'https://mumbai.polygonscan.com/tx/{hash}',
      address: 'https://mumbai.polygonscan.com/address/{address}',
      token: 'https://mumbai.polygonscan.com/token/{token}',
    },
  ],
  'https://mumbaifaucet.com/'
);
