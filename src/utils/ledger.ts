import { AccountType } from '../store/types';

export const LEDGER_BITCOIN_OPTIONS = [
  {
    name: AccountType.BitcoinLedgerNativeSegwit,
    label: 'Segwit',
    addressType: 'bech32',
  },
  {
    name: AccountType.BitcoinLedgerLegacy,
    label: 'Legacy',
    addressType: 'legacy',
  },
];

export const LEDGER_OPTIONS = [
  {
    name: 'ETH',
    label: 'ETH',
    types: [AccountType.EthereumLedger],
    chain: 'ethereum',
  },
  {
    name: 'BTC',
    label: 'BTC',
    types: [
      AccountType.BitcoinLedgerNativeSegwit,
      AccountType.BitcoinLedgerLegacy,
    ],
    chain: 'bitcoin',
  },
  {
    name: 'RBTC',
    label: 'RSK',
    types: [AccountType.RskLedger],
    chain: 'rsk',
  },
];
