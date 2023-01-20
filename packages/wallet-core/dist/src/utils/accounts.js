"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCOUNT_TYPE_OPTIONS = exports.getNextAccountColor = exports.accountColors = exports.accountCreator = void 0;
const cryptoassets_1 = require("@liquality/cryptoassets");
const error_parser_1 = require("@liquality/error-parser");
const uuid_1 = require("uuid");
const types_1 = require("../store/types");
const derivationPath_1 = require("./derivationPath");
const accountCreator = (payload) => {
    const { network, walletId, account } = payload;
    const { name, alias, chain, index, addresses, assets, balances, type, color, chainCode, publicKey } = account;
    const enabled = account.enabled !== null && account.enabled !== undefined ? account.enabled : true;
    const _addresses = addresses.map((a) => {
        return (0, cryptoassets_1.getChain)(network, chain).formatAddress(a);
    });
    const derivationPath = account.derivationPath
        ? account.derivationPath
        : (0, derivationPath_1.getDerivationPath)(chain, network, index, type);
    const id = (0, uuid_1.v4)();
    const createdAt = Date.now();
    return {
        id,
        walletId,
        type,
        name,
        alias,
        chain,
        index,
        derivationPath,
        addresses: _addresses,
        assets,
        balances: balances || {},
        createdAt,
        color,
        enabled,
        chainCode,
        publicKey,
    };
};
exports.accountCreator = accountCreator;
exports.accountColors = [
    '#000000',
    '#1CE5C3',
    '#007AFF',
    '#4F67E4',
    '#9D4DFA',
    '#D421EB',
    '#FF287D',
    '#FE7F6B',
    '#EAB300',
    '#F7CA4F',
    '#A1E44A',
    '#3AB24D',
    '#8247E5',
    '#bf0205',
];
const getNextAccountColor = (chain, index) => {
    const defaultColor = (0, cryptoassets_1.getChain)(types_1.Network.Mainnet, chain).color;
    if (!defaultColor) {
        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Chain.DefaultColor(chain));
    }
    const defaultIndex = exports.accountColors.findIndex((c) => c === defaultColor);
    if (defaultIndex === -1) {
        return defaultColor;
    }
    const finalIndex = index + defaultIndex;
    if (finalIndex >= exports.accountColors.length) {
        return exports.accountColors[defaultIndex];
    }
    return exports.accountColors[finalIndex];
};
exports.getNextAccountColor = getNextAccountColor;
exports.ACCOUNT_TYPE_OPTIONS = [
    {
        name: 'ETH',
        label: 'ETH',
        type: 'ethereum_imported',
        chain: cryptoassets_1.ChainId.Ethereum,
        blockchain: 'Ethereum Blockchain',
    },
    {
        name: 'BTC',
        label: 'BTC',
        type: 'bitcoin_imported',
        chain: cryptoassets_1.ChainId.Bitcoin,
        blockchain: 'Bitcoin Blockchain',
    },
];
//# sourceMappingURL=accounts.js.map