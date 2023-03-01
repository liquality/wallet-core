import arbitrum from '../../mainnet/evm/arbitrum';
import { transformMainnetToTestnetChain } from '../../utils';

export default transformMainnetToTestnetChain(
  arbitrum,
  {
    name: 'arbitrum_testnet',
    coinType: '60',
    networkId: 421613,
    chainId: 421613,
    isTestnet: true,
    rpcUrls: ['https://arbitrum-goerli.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f'],
  },
  [
    {
      tx: 'https://goerli.arbiscan.io/tx/{hash}',
      address: 'https://goerli.arbiscan.io/address/{address}',
      token: 'https://goerli.arbiscan.io/token/{token}',
    },
  ],
  'https://goerlifaucet.com/'
);
