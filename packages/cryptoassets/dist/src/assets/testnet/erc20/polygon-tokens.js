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
        name: 'teleBTC',
        code: 'TELEBTC',
        decimals: 8,
        contractAddress: '0x515D720B9D219f1931205D5B8D842bE1Fe2FeBDE',
        color: '#5b3159',
        matchingAsset: 'BTC',
        priceSource: {
            coinGeckoId: 'bitcoin',
        },
    },
};
exports.default = (0, utils_1.transformTokenMap)(TOKENS, types_1.ChainId.Polygon);
//# sourceMappingURL=polygon-tokens.js.map