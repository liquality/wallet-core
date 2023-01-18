import terra from '../../mainnet/non-evm/terra';
import { transformMainnetToTestnetChain } from '../../utils';

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
      tx: 'https://finder.terra.money/testnet/tx/{hash}',
      address: 'https://finder.terra.money/testnet/address/{address}',
    },
  ],
  'https://faucet.terra.money/'
);
