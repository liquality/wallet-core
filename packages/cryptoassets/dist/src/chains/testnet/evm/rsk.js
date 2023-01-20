"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rsk_1 = tslib_1.__importDefault(require("../../mainnet/evm/rsk"));
const utils_1 = require("../../utils");
exports.default = (0, utils_1.transformMainnetToTestnetChain)(rsk_1.default, {
    name: 'rsk_testnet',
    coinType: '60',
    networkId: 31,
    chainId: 31,
    isTestnet: true,
    rpcUrls: ['https://testnet.sovryn.app/rpc'],
}, [
    {
        tx: 'https://explorer.testnet.rsk.co/tx/{hash}',
        address: 'https://explorer.testnet.rsk.co/address/{address}',
    },
], 'https://faucet.rsk.co/');
//# sourceMappingURL=rsk.js.map