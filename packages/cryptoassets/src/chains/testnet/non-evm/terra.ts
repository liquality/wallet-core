import terra from '../../../chains/mainnet/non-evm/terra';
import { transformMainnetToTestnetChain } from '../../../chains/utils';

export default transformMainnetToTestnetChain(
  terra,
  {
    name: 'Terra Classic Testnet',
    networkId: 'testnet',
    coinType: '330',
    isTestnet: true,
    chainId: 'bombay-12',
    rpcUrls: ['https://pisco-lcd.terra.dev'],
    scraperUrls: ['https://pisco-fcd.terra.de'],
  },
  [
    {
      tx: 'https://finder.terra.money/testnet/tx/',
      address: 'https://finder.terra.money/testnet/address/',
    },
  ],
  'https://faucet.terra.money/'
);
