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
    rpcUrls: ['https://ropsten.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f'],
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
