import arbitrum from '../../../chains/mainnet/evm/arbitrum';
import { transformMainnetToTestnetChain } from '../../../chains/utils';

export default transformMainnetToTestnetChain(
  arbitrum,
  {
    name: 'arbitrum_testnet',
    coinType: '60',
    networkId: 421611,
    chainId: 421611,
    isTestnet: true,
    rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
  },
  [
    {
      tx: 'https://testnet.arbiscan.io/tx/',
      address: 'https://testnet.arbiscan.io/address/',
      token: 'https://testnet.arbiscan.io/token/',
    },
  ],
  'https://faucet.rinkeby.io/'
);
