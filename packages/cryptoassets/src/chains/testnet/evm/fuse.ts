import fuse from '../../../chains/mainnet/evm/fuse';
import { transformMainnetToTestnetChain } from '../../../chains/utils';

export default transformMainnetToTestnetChain(
  fuse,
  {
    name: 'fuse_testnet',
    coinType: '60',
    networkId: 123,
    chainId: 123,
    isTestnet: true,
    rpcUrls: ['https://rpc.fusespark.io'],
  },
  [
    {
      tx: 'https://explorer.fusespark.io/tx/{hash}',
      address: 'https://explorer.fusespark.io/address/{address}',
      token: 'https://explorer.fusespark.io/token/{token}',
    },
  ],
  'https://stakely.io/en/faucet/fuse-blockchain'
);
