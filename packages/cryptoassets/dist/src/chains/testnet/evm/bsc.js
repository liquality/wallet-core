"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bsc_1 = tslib_1.__importDefault(require("../../mainnet/evm/bsc"));
const utils_1 = require("../../utils");
exports.default = (0, utils_1.transformMainnetToTestnetChain)(bsc_1.default, {
    name: 'bsc_testnet',
    coinType: '60',
    networkId: 97,
    chainId: 97,
    isTestnet: true,
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
}, [
    {
        tx: 'https://testnet.bscscan.com/tx/{hash}',
        address: 'https://testnet.bscscan.com/address/{address}',
        token: 'https://testnet.bscscan.com/token/{token}',
    },
], 'https://testnet.binance.org/faucet-smart');
//# sourceMappingURL=bsc.js.map