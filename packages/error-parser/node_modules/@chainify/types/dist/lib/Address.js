"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
class Address {
    constructor(fields) {
        this.toString = () => {
            return this.address;
        };
        if (fields) {
            Object.assign(this, fields);
        }
    }
}
exports.Address = Address;
//# sourceMappingURL=Address.js.map