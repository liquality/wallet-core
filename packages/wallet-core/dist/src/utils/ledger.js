"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEDGER_OPTIONS = exports.LEDGER_BITCOIN_OPTIONS = void 0;
const types_1 = require("../store/types");
const address_1 = require("./address");
exports.LEDGER_BITCOIN_OPTIONS = [
    {
        name: types_1.AccountType.BitcoinLedgerNativeSegwit,
        label: 'Segwit',
        addressType: address_1.BitcoinAddressType.BECH32,
    },
    {
        name: types_1.AccountType.BitcoinLedgerLegacy,
        label: 'Legacy',
        addressType: address_1.BitcoinAddressType.LEGACY,
    },
];
exports.LEDGER_OPTIONS = [
    {
        name: 'ETH',
        label: 'ETH',
        types: [types_1.AccountType.EthereumLedger],
        chain: 'ethereum',
    },
    {
        name: 'BTC',
        label: 'BTC',
        types: [types_1.AccountType.BitcoinLedgerNativeSegwit, types_1.AccountType.BitcoinLedgerLegacy],
        chain: 'bitcoin',
    },
    {
        name: 'RBTC',
        label: 'RSK',
        types: [types_1.AccountType.RskLedger],
        chain: 'rsk',
    },
];
//# sourceMappingURL=ledger.js.map