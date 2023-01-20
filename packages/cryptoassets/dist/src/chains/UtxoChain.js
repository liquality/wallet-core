"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitcoinChain = exports.UtxoChain = void 0;
const tslib_1 = require("tslib");
const bitcoin_address_validation_1 = tslib_1.__importDefault(require("bitcoin-address-validation"));
const utils_1 = require("../utils");
const BaseChain_1 = require("./BaseChain");
class UtxoChain extends BaseChain_1.BaseChain {
    formatAddress(address) {
        return address;
    }
    isValidTransactionHash(hash) {
        return /^([A-Fa-f0-9]{64})$/.test(hash);
    }
    formatTransactionHash(hash) {
        return (0, utils_1.ensure0x)(hash).toLowerCase();
    }
}
exports.UtxoChain = UtxoChain;
class BitcoinChain extends UtxoChain {
    isValidAddress(address) {
        return !!(0, bitcoin_address_validation_1.default)(address, String(this.network.networkId));
    }
}
exports.BitcoinChain = BitcoinChain;
//# sourceMappingURL=UtxoChain.js.map