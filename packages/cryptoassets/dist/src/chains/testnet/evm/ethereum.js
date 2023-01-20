"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("../../../types");
const ethereum_1 = tslib_1.__importDefault(require("../../mainnet/evm/ethereum"));
const utils_1 = require("../../utils");
exports.default = (0, utils_1.transformMainnetToTestnetChain)(ethereum_1.default, {
    name: 'goerli',
    coinType: '60',
    networkId: 5,
    chainId: 5,
    isTestnet: true,
    rpcUrls: ['https://goerli.infura.io/v3/a2ad6f8c0e57453ca4918331f16de87d'],
}, [
    {
        tx: 'https://goerli.etherscan.io/tx/{hash}',
        address: 'https://goerli.etherscan.io/address/{address}',
        token: 'https://goerli.etherscan.io/token/{token}',
    },
], 'https://faucet.paradigm.xyz/', types_1.NftProviderType.Moralis);
//# sourceMappingURL=ethereum.js.map