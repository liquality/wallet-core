"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TESTNET_UTXO_CHAINS = void 0;
const tslib_1 = require("tslib");
const types_1 = require("../../types");
const bitcoin_1 = tslib_1.__importDefault(require("./utxo/bitcoin"));
exports.TESTNET_UTXO_CHAINS = {
    [types_1.ChainId.Bitcoin]: bitcoin_1.default,
};
//# sourceMappingURL=UtxoChains.js.map