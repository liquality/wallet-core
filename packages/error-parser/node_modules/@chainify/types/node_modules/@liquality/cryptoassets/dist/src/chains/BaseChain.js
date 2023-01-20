"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseChain = void 0;
class BaseChain {
    constructor(chain) {
        Object.assign(this, chain);
    }
    formatAddressUI(address) {
        return this.formatAddress(address);
    }
}
exports.BaseChain = BaseChain;
//# sourceMappingURL=BaseChain.js.map