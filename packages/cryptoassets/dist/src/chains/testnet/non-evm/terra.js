"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const terra_1 = tslib_1.__importDefault(require("../../mainnet/non-evm/terra"));
const utils_1 = require("../../utils");
exports.default = (0, utils_1.transformMainnetToTestnetChain)(terra_1.default, {
    name: 'Terra Classic Testnet',
    networkId: 'testnet',
    coinType: '330',
    isTestnet: true,
    chainId: 'bombay-12',
    rpcUrls: ['https://pisco-lcd.terra.dev'],
    scraperUrls: ['https://pisco-fcd.terra.de'],
}, [
    {
        tx: 'https://finder.terra.money/testnet/tx/{hash}',
        address: 'https://finder.terra.money/testnet/address/{address}',
    },
], 'https://faucet.terra.money/');
//# sourceMappingURL=terra.js.map