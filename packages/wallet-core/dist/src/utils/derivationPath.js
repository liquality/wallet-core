"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDerivationPath = void 0;
const bitcoin_1 = require("@chainify/bitcoin");
const cryptoassets_1 = require("@liquality/cryptoassets");
const error_parser_1 = require("@liquality/error-parser");
const types_1 = require("../store/types");
const address_1 = require("./address");
const ledger_1 = require("./ledger");
const getDerivationPath = (chainId, network, index, accountType) => {
    const pathFunction = derivationPaths[chainId];
    if (!pathFunction) {
        const chain = (0, cryptoassets_1.getChain)(network, chainId);
        if (chain.isEVM) {
            return getEVMBasedDerivationPath(chain.network.coinType, index, accountType);
        }
        else {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Chain.DerivationPath(chainId));
        }
    }
    return pathFunction(network, index, accountType);
};
exports.getDerivationPath = getDerivationPath;
const derivationPaths = {
    [cryptoassets_1.ChainId.Rootstock]: (network, index, accountType = types_1.AccountType.Default) => {
        let coinType;
        if (accountType === types_1.AccountType.RskLedger) {
            coinType = network === 'mainnet' ? '137' : '37310';
        }
        else {
            coinType = (0, cryptoassets_1.getChain)(network, cryptoassets_1.ChainId.Rootstock).network.coinType;
        }
        return getEVMBasedDerivationPath(coinType, index, accountType);
    },
    [cryptoassets_1.ChainId.Bitcoin]: (network, index, accountType = types_1.AccountType.Default) => {
        const coinType = (0, cryptoassets_1.getChain)(network, cryptoassets_1.ChainId.Bitcoin).network.coinType;
        return getBitcoinDerivationPath(accountType, coinType, index);
    },
    [cryptoassets_1.ChainId.Near]: (network, index) => {
        const coinType = (0, cryptoassets_1.getChain)(network, cryptoassets_1.ChainId.Near).network.coinType;
        return `m/44'/${coinType}'/${index}'`;
    },
    [cryptoassets_1.ChainId.Solana]: (network, index) => {
        const coinType = (0, cryptoassets_1.getChain)(network, cryptoassets_1.ChainId.Solana).network.coinType;
        return `m/44'/${coinType}'/${index}'/0'`;
    },
    [cryptoassets_1.ChainId.Terra]: (network, index) => {
        const coinType = (0, cryptoassets_1.getChain)(network, cryptoassets_1.ChainId.Terra).network.coinType;
        return `'m/44'/${coinType}'/${index}'`;
    },
};
const getEVMBasedDerivationPath = (coinType, index, accountType = types_1.AccountType.Default) => {
    if (accountType === types_1.AccountType.EthereumLedger || accountType === types_1.AccountType.RskLedger) {
        return `m/44'/${coinType}'/${index}'/0/0`;
    }
    return `m/44'/${coinType}'/0'/0/${index}`;
};
const getBitcoinDerivationPath = (accountType, coinType, index) => {
    if (accountType.includes('ledger')) {
        const option = ledger_1.LEDGER_BITCOIN_OPTIONS.find((o) => o.name === accountType);
        if (!option) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.AccountTypeOption(accountType));
        }
        const { addressType } = option;
        return `${address_1.BTC_ADDRESS_TYPE_TO_PREFIX[addressType]}'/${coinType}'/${index}'`;
    }
    else {
        return `${address_1.BTC_ADDRESS_TYPE_TO_PREFIX[bitcoin_1.BitcoinTypes.AddressType.BECH32]}'/${coinType}'/${index}'`;
    }
};
//# sourceMappingURL=derivationPath.js.map