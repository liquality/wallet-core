import { NftProviderType } from '../../../types';
import ethereum from '../../../chains/mainnet/evm/ethereum';
import { transformMainnetToTestnetChain } from '../../../chains/utils';

export default transformMainnetToTestnetChain(
  ethereum,
  {
    name: 'ropsten',
    coinType: '60',
    networkId: 3,
    chainId: 3,
    isTestnet: true,
    rpcUrls: ['https://ropsten.infura.io/v3/a2ad6f8c0e57453ca4918331f16de87d'],
  },
  [
    {
      tx: 'https://ropsten.etherscan.io/tx/{hash}',
      address: 'https://ropsten.etherscan.io/address/{address}',
      token: 'https://ropsten.etherscan.io/token/{token}',
    },
  ],
  'https://faucet.metamask.io/',
  NftProviderType.Moralis
);
