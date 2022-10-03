import near from '../../../chains/mainnet/non-evm/near';
import { transformMainnetToTestnetChain } from '../../../chains/utils';

export default transformMainnetToTestnetChain(
  near,
  {
    name: 'Near Testnet',
    networkId: 'testnet',
    coinType: '397',
    isTestnet: true,
    rpcUrls: ['https://rpc.testnet.near.org'],
    scraperUrls: ['https://near-testnet-api.liq-chainhub.net'],
  },
  [
    {
      tx: 'https://explorer.testnet.near.org/transactions/{hash}',
      address: 'https://explorer.testnet.near.org/accounts/{address}',
    },
  ],
  'https://wallet.testnet.near.org/'
);
