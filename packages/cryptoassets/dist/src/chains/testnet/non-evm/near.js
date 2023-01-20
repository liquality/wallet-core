"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const near_1 = tslib_1.__importDefault(require("../../mainnet/non-evm/near"));
const utils_1 = require("../../utils");
exports.default = (0, utils_1.transformMainnetToTestnetChain)(near_1.default, {
    name: 'Near Testnet',
    networkId: 'testnet',
    coinType: '397',
    isTestnet: true,
    rpcUrls: ['https://rpc.testnet.near.org'],
    scraperUrls: ['https://near-testnet-api.liq-chainhub.net'],
}, [
    {
        tx: 'https://explorer.testnet.near.org/transactions/{hash}',
        address: 'https://explorer.testnet.near.org/accounts/{address}',
    },
], 'https://wallet.testnet.near.org/');
//# sourceMappingURL=near.js.map