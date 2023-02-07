"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const utils_1 = require("../../utils");
const TOKENS = {
    OPSNX: {
        name: 'Optimism Synthetix',
        code: 'OPSNX',
        decimals: 18,
        contractAddress: '0x0064A673267696049938AA47595dD0B3C2e705A1',
        matchingAsset: 'SNX',
        priceSource: {
            coinGeckoId: 'havven',
        },
    },
    OPDAI: {
        name: 'Optimism Dai stable coin',
        code: 'OPDAI',
        decimals: 18,
        contractAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        color: '#AB7E21',
        matchingAsset: 'DAI',
        priceSource: {
            coinGeckoId: 'dai',
        },
    },
    OPUSDT: {
        name: 'Optimism Tether USD',
        code: 'OPUSDT',
        decimals: 6,
        contractAddress: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        color: '#26a17b',
        matchingAsset: 'USDT',
        priceSource: {
            coinGeckoId: 'tether',
        },
    },
    OPWBTC: {
        name: 'Optimism Wrapped BTC',
        code: 'OPWBTC',
        decimals: 8,
        contractAddress: '0x2382a8f65b9120E554d1836a504808aC864E169d',
        matchingAsset: 'WBTC',
        priceSource: {
            coinGeckoId: 'wrapped-bitcoin',
        },
    },
};
exports.default = (0, utils_1.transformTokenMap)(TOKENS, types_1.ChainId.Optimism);
//# sourceMappingURL=optimism-tokens.js.map