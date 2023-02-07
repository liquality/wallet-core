"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const arbitrum_1 = tslib_1.__importDefault(require("../../mainnet/evm/arbitrum"));
const utils_1 = require("../../utils");
exports.default = (0, utils_1.transformMainnetToTestnetChain)(arbitrum_1.default, {
    name: 'arbitrum_testnet',
    coinType: '60',
    networkId: 421613,
    chainId: 421613,
    isTestnet: true,
    rpcUrls: ['https://arbitrum-goerli.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f'],
}, [
    {
        tx: 'https://goerli.arbiscan.io/tx/{hash}',
        address: 'https://goerli.arbiscan.io/address/{address}',
        token: 'https://goerli.arbiscan.io/token/{token}',
    },
], 'https://goerlifaucet.com/');
//# sourceMappingURL=arbitrum.js.map