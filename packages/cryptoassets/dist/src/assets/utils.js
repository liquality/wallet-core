"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformChainToTokenAddress = exports.transformTokenMap = void 0;
const types_1 = require("../types");
const transformTokenMap = (tokens, chain) => {
    return Object.values(tokens).reduce((result, token) => {
        result[token.code] = Object.assign(Object.assign({}, token), { type: types_1.AssetTypes.erc20, chain });
        return result;
    }, {});
};
exports.transformTokenMap = transformTokenMap;
const transformChainToTokenAddress = (tokens) => {
    return Object.values(tokens).reduce((result, token) => {
        result[token.chain] = Object.assign(Object.assign({}, result[token.chain]), { [String(token.contractAddress)]: Object.assign({}, token) });
        return result;
    }, {});
};
exports.transformChainToTokenAddress = transformChainToTokenAddress;
//# sourceMappingURL=utils.js.map