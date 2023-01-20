"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const optimism_1 = tslib_1.__importDefault(require("../../mainnet/evm/optimism"));
const utils_1 = require("../../utils");
const optimismTestnet = (0, utils_1.transformMainnetToTestnetChain)(optimism_1.default, {
    name: 'optimism_testnet',
    coinType: '60',
    networkId: 420,
    chainId: 420,
    isTestnet: true,
    rpcUrls: ['https://optimism-goerli.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f'],
}, [
    {
        tx: 'https://goerli-optimism.etherscan.io/tx/{hash}',
        address: 'https://goerli-optimism.etherscan.io/address/{address}',
        token: 'https://goerli-optimism.etherscan.io/token/{token}',
    },
], 'https://optimismfaucet.xyz/');
exports.default = Object.assign(Object.assign({}, optimismTestnet), { gasLimit: {
        send: {
            native: 21000,
            nonNative: 100000,
        },
        sendL1: {
            native: 7500,
            nonNative: 8250,
        },
    } });
//# sourceMappingURL=optimism.js.map