import { NftProviderType } from '../../../types';
import ethereum from '../../../chains/mainnet/evm/ethereum';
import { transformMainnetToTestnetChain } from '../../../chains/utils';

export default transformMainnetToTestnetChain(
  ethereum,
  {
    name: 'goerli',
    coinType: '60',
    networkId: 5,
    chainId: 5,
    isTestnet: true,
    rpcUrls: ['https://goerli.infura.io/v3/a2ad6f8c0e57453ca4918331f16de87d'],
  },
  [
    {
      tx: 'https://goerli.etherscan.io/tx/{hash}',
      address: 'https://goerli.etherscan.io/address/{address}',
      token: 'https://goerli.etherscan.io/token/{token}',
    },
  ],
  'https://faucet.paradigm.xyz/',
  NftProviderType.Moralis
);
