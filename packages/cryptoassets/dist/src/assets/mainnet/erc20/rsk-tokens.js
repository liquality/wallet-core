"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const utils_1 = require("../../utils");
const TOKENS = {
    BPRO: {
        name: 'Bit Pro',
        code: 'BPRO',
        decimals: 18,
        contractAddress: '0x440cd83c160de5c96ddb20246815ea44c7abbca8',
        color: '#ff9415',
        priceSource: {
            coinGeckoId: undefined,
        },
    },
    DOC: {
        name: 'Dollar On Chain',
        code: 'DOC',
        decimals: 18,
        contractAddress: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
        color: '#00a651',
        priceSource: {
            coinGeckoId: undefined,
        },
    },
    RIF: {
        name: 'RSK Infrastructure Framework',
        code: 'RIF',
        decimals: 18,
        contractAddress: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
        color: '#0083ff',
        priceSource: {
            coinGeckoId: 'rif-token',
        },
    },
    RDOC: {
        name: 'RIF Dollar On Chain',
        code: 'RDOC',
        decimals: 18,
        contractAddress: '0x2d919f19d4892381d58edebeca66d5642cef1a1f',
        color: '#0083ff',
        priceSource: {
            coinGeckoId: undefined,
        },
    },
    RIFP: {
        name: 'RIF Pro',
        code: 'RIFP',
        decimals: 18,
        contractAddress: '0xf4d27c56595ed59b66cc7f03cff5193e4bd74a61',
        color: '#0083ff',
        priceSource: {
            coinGeckoId: undefined,
        },
    },
    SOV: {
        name: 'Sovryn',
        code: 'SOV',
        decimals: 18,
        contractAddress: '0xefc78fc7d48b64958315949279ba181c2114abbd',
        color: '#000000',
        priceSource: {
            coinGeckoId: 'sovryn',
        },
    },
    FISH: {
        name: 'Fish',
        code: 'FISH',
        decimals: 18,
        contractAddress: '0x055a902303746382fbb7d18f6ae0df56efdc5213',
        color: '#4D9CDC',
        priceSource: {
            coinGeckoId: undefined,
        },
    },
};
exports.default = (0, utils_1.transformTokenMap)(TOKENS, types_1.ChainId.Rootstock);
//# sourceMappingURL=rsk-tokens.js.map