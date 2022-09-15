import bitcoin from '../../../chains/mainnet/utxo/bitcoin';
import { transformMainnetToTestnetChain } from '../../../chains/utils';

export default transformMainnetToTestnetChain(
  bitcoin,
  {
    name: 'bitcoin_testnet',
    coinType: '1',
    isTestnet: true,
    networkId: 'testnet',
    utxo: {
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'tb',
      bip32: {
        public: 0x043587cf,
        private: 0x04358394,
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef,
    },
    rpcUrls: ['https://electrs-testnet-api.liq-chainhub.net/'],
    scraperUrls: ['https://electrs-batch-testnet-api.liq-chainhub.net/'],
  },
  [
    {
      tx: 'https://blockstream.info/testnet/tx/{hash}',
      address: 'https://blockstream.info/testnet/address/{address}',
    },
  ],
  'https://bitcoinfaucet.uo1.net/'
);
