"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const utils_1 = require("../../utils");
const TOKENS = {
    SOV: {
        name: 'Sovryn',
        code: 'SOV',
        decimals: 18,
        contractAddress: '0x6a9A07972D07E58f0daF5122D11e069288A375fB',
        color: '#000000',
        priceSource: {
            coinGeckoId: 'sovryn',
        },
    },
};
exports.default = (0, utils_1.transformTokenMap)(TOKENS, types_1.ChainId.Rootstock);
//# sourceMappingURL=rsk-tokens.js.map