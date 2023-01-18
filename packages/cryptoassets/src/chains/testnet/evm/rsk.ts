import rsk from '../../mainnet/evm/rsk';
import { transformMainnetToTestnetChain } from '../../utils';

export default transformMainnetToTestnetChain(
  rsk,
  {
    name: 'rsk_testnet',
    coinType: '60',
    networkId: 31,
    chainId: 31,
    isTestnet: true,
    rpcUrls: ['https://testnet.sovryn.app/rpc'],
  },
  [
    {
      tx: 'https://explorer.testnet.rsk.co/tx/{hash}',
      address: 'https://explorer.testnet.rsk.co/address/{address}',
    },
  ],
  'https://faucet.rsk.co/'
);
