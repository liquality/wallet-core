"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const polygon_1 = tslib_1.__importDefault(require("../../mainnet/evm/polygon"));
const utils_1 = require("../../utils");
exports.default = (0, utils_1.transformMainnetToTestnetChain)(polygon_1.default, {
    name: 'polygon_testnet',
    coinType: '60',
    networkId: 80001,
    chainId: 80001,
    isTestnet: true,
    rpcUrls: [
        'https://polygon-mumbai.infura.io/v3/a2ad6f8c0e57453ca4918331f16de87d',
        'https://matic-testnet-archive-rpc.bwarelabs.com',
    ],
}, [
    {
        tx: 'https://mumbai.polygonscan.com/tx/{hash}',
        address: 'https://mumbai.polygonscan.com/address/{address}',
        token: 'https://mumbai.polygonscan.com/token/{token}',
    },
], 'https://mumbaifaucet.com/');
//# sourceMappingURL=polygon.js.map