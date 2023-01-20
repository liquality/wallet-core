"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fuse_1 = tslib_1.__importDefault(require("../../mainnet/evm/fuse"));
const utils_1 = require("../../utils");
exports.default = (0, utils_1.transformMainnetToTestnetChain)(fuse_1.default, {
    name: 'fuse_testnet',
    coinType: '60',
    networkId: 123,
    chainId: 123,
    isTestnet: true,
    rpcUrls: ['https://rpc.fusespark.io'],
}, [
    {
        tx: 'https://explorer.fusespark.io/tx/{hash}',
        address: 'https://explorer.fusespark.io/address/{address}',
        token: 'https://explorer.fusespark.io/token/{token}',
    },
], 'https://stakely.io/en/faucet/fuse-blockchain');
//# sourceMappingURL=fuse.js.map