"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RskChain = exports.EvmChain = void 0;
const ethereumjs_util_1 = require("ethereumjs-util");
const utils_1 = require("../utils");
const BaseChain_1 = require("./BaseChain");
class EvmChain extends BaseChain_1.BaseChain {
    isValidAddress(address) {
        return (0, ethereumjs_util_1.isValidAddress)(address);
    }
    formatAddress(address) {
        return (0, ethereumjs_util_1.toChecksumAddress)(address);
    }
    isValidTransactionHash(hash) {
        return /^(0x)?([A-Fa-f0-9]{64})$/.test(hash);
    }
    formatTransactionHash(hash) {
        return (0, utils_1.ensure0x)(hash).toLowerCase();
    }
}
exports.EvmChain = EvmChain;
class RskChain extends EvmChain {
    formatAddressUI(address) {
        return (0, ethereumjs_util_1.toChecksumAddress)((0, utils_1.ensure0x)(address), this.network.chainId);
    }
}
exports.RskChain = RskChain;
//# sourceMappingURL=EvmChain.js.map