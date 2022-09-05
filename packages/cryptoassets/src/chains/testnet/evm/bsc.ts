import bsc from '../../../chains/mainnet/evm/bsc';
import { transformMainnetToTestnetChain } from '../../../chains/utils';

export default transformMainnetToTestnetChain(
  bsc,
  {
    name: 'bsc_testnet',
    coinType: '60',
    networkId: 97,
    chainId: 97,
    isTestnet: true,
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
  },
  [
    {
      tx: 'https://testnet.bscscan.com/tx/',
      address: 'https://testnet.bscscan.com/address/',
      token: 'https://testnet.bscscan.com/token/',
    },
  ],
  'https://testnet.binance.org/faucet-smart'
);
