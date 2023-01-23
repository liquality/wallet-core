"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const utils_1 = require("../../utils");
const TOKENS = {
    PWETH: {
        name: 'Polygon Wrapped Ether',
        code: 'PWETH',
        decimals: 18,
        contractAddress: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
        color: '#5b3159',
        matchingAsset: 'WETH',
        priceSource: {
            coinGeckoId: 'weth',
        },
    },
    TELEBTC: {
        name: 'TeleportDAO BTC',
        code: 'TELEBTC',
        decimals: 8,
        contractAddress: '0x19c650e2C6E9f5DEB9FaB3078fD1b11FAD1E54Ee',
        color: '#5b3159',
        matchingAsset: 'BTC',
        priceSource: {
            coinGeckoId: 'bitcoin',
        },
    },
};
exports.default = (0, utils_1.transformTokenMap)(TOKENS, types_1.ChainId.Polygon);
//# sourceMappingURL=polygon-tokens.js.map