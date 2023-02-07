"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const utils_1 = require("../../utils");
const TOKENS = {
    ANC: {
        name: 'ANC',
        code: 'ANC',
        decimals: 6,
        contractAddress: 'terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc',
        priceSource: {
            coinGeckoId: 'anchor-protocol',
        },
    },
};
exports.default = (0, utils_1.transformTokenMap)(TOKENS, types_1.ChainId.Terra);
//# sourceMappingURL=terra-tokens.js.map