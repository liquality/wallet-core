"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const avalanche_1 = tslib_1.__importDefault(require("../../mainnet/evm/avalanche"));
const utils_1 = require("../../utils");
exports.default = (0, utils_1.transformMainnetToTestnetChain)(avalanche_1.default, {
    name: 'avalanche_testnet',
    coinType: '60',
    networkId: 43113,
    chainId: 43113,
    isTestnet: true,
    rpcUrls: [
        'https://nd-865-707-799.p2pify.com/50bb56fd7bb9cc0f1847f418417c0d7a/ext/bc/C/rpc',
        'https://api.avax-test.network/ext/bc/C/rpc',
    ],
}, [
    {
        tx: 'https://testnet.snowtrace.io/tx/{hash}',
        address: 'https://testnet.snowtrace.io/address/{address}',
        token: 'https://testnet.snowtrace.io/token/{token}',
    },
], 'https://faucet.avax.network/');
//# sourceMappingURL=avalanche.js.map