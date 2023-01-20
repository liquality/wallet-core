"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const utils_1 = require("../../utils");
const TOKENS = {
    sUSDT: {
        name: 'sUSDT',
        code: 'sUSDT',
        decimals: 6,
        contractAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        matchingAsset: 'USDT',
    },
    sUSDC: {
        name: 'sUSDC',
        code: 'sUSDC',
        decimals: 6,
        contractAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        matchingAsset: 'USDC',
    },
    RAY: {
        name: 'RAY',
        code: 'RAY',
        decimals: 6,
        contractAddress: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
        priceSource: {
            coinGeckoId: 'raydium',
        },
    },
    SRM: {
        name: 'SERUM',
        code: 'SRM',
        decimals: 6,
        contractAddress: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
        priceSource: {
            coinGeckoId: 'serum',
        },
    },
    LINK: {
        name: 'soLINK',
        code: 'LINK',
        decimals: 6,
        contractAddress: 'CWE8jPTUYhdCTZYWPTe1o5DFqfdjzWKc9WKz6rSjQUdG',
        matchingAsset: 'LINK',
    },
};
exports.default = (0, utils_1.transformTokenMap)(TOKENS, types_1.ChainId.Solana);
//# sourceMappingURL=solana-tokens.js.map