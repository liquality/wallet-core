"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bitcoin_1 = tslib_1.__importDefault(require("../../mainnet/utxo/bitcoin"));
const utils_1 = require("../../utils");
exports.default = (0, utils_1.transformMainnetToTestnetChain)(bitcoin_1.default, {
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
}, [
    {
        tx: 'https://blockstream.info/testnet/tx/{hash}',
        address: 'https://blockstream.info/testnet/address/{address}',
    },
], 'https://bitcoinfaucet.uo1.net/');
//# sourceMappingURL=bitcoin.js.map