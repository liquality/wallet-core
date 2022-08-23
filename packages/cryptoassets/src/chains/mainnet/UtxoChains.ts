import { IChain } from 'src/interfaces/IChain';
import { AssetTypes, ChainId } from '../../types';
import { BitcoinChain } from '../UtxoChain';

export const UTXO_CHAINS: { [key in ChainId]?: IChain } = {
  bitcoin: new BitcoinChain({
    id: ChainId.Bitcoin,
    name: 'Bitcoin',
    code: 'BTC',
    color: '#EAB300',
    nativeAsset: {
      name: 'Bitcoin',
      chain: ChainId.Bitcoin,
      type: AssetTypes.native,
      code: 'BTC',
      priceSource: { coinGeckoId: 'bitcoin' },
      color: '#f7931a',
      decimals: 8,
    },
    isEVM: false,
    hasTokens: false,
    averageBlockTime: 600,
    safeConfirmations: 1,
    txFailureTimeoutMs: 10_800_000, // 3 hours
    network: {
      name: 'bitcoin',
      coinType: '0',
      isTestnet: false,
      networkId: 'mainnet',
      utxo: {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'bc',
        bip32: {
          public: 0x0488b21e,
          private: 0x0488ade4,
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80,
      },
      rpcUrls: ['https://electrs-mainnet-api.liq-chainhub.net/'],
      scraperUrl: ['https://electrs-batch-mainnet-api.liq-chainhub.net/'],
    },
    explorerViews: [
      {
        tx: 'https://blockstream.info/tx/',
        address: 'https://blockstream.info/address/',
      },
    ],
    multicallSupport: false,
    ledgerSupport: true,
    EIP1559: false,
    gasLimit: {
      send: {
        native: 290,
      },
    },
    fees: {
      unit: 'sat/b',
      magnitute: 1e8,
    },
    supportCustomFees: false,
  }),
};
