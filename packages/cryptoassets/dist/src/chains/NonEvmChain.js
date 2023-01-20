"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerraChain = exports.NearChain = exports.SolanaChain = exports.NonEvmChain = void 0;
const tslib_1 = require("tslib");
const bs58_1 = tslib_1.__importDefault(require("bs58"));
const EvmChain_1 = require("./EvmChain");
const BASE58_LENGTH = 32;
class NonEvmChain extends EvmChain_1.EvmChain {
    formatAddress(address) {
        return address;
    }
    formatTransactionHash(hash) {
        return hash;
    }
}
exports.NonEvmChain = NonEvmChain;
class SolanaChain extends NonEvmChain {
    isValidAddress(address) {
        try {
            const PUBLIC_KEY_LENGTH = 32;
            const publicKey = bs58_1.default.decode(address);
            return publicKey.length === PUBLIC_KEY_LENGTH;
        }
        catch (error) {
            return false;
        }
    }
    isValidTransactionHash(_hash) {
        return true;
    }
}
exports.SolanaChain = SolanaChain;
class NearChain extends NonEvmChain {
    isValidAddress(address) {
        return address.endsWith('.near') || /^[0-9a-fA-F]{64}$/.test(address);
    }
    isValidTransactionHash(hash) {
        try {
            const [txHash, address] = hash.split('_');
            return bs58_1.default.decode(txHash).length === BASE58_LENGTH && this.isValidAddress(address);
        }
        catch (e) {
            return false;
        }
    }
}
exports.NearChain = NearChain;
class TerraChain extends NonEvmChain {
    isValidAddress(address) {
        return address.length === 44;
    }
    isValidTransactionHash(hash) {
        return typeof hash === 'string' && hash.length === 64;
    }
}
exports.TerraChain = TerraChain;
//# sourceMappingURL=NonEvmChain.js.map