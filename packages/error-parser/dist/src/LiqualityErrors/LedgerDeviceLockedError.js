"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerDeviceLockedError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class LedgerDeviceLockedError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.LedgerDeviceLockedError);
    }
}
exports.LedgerDeviceLockedError = LedgerDeviceLockedError;
//# sourceMappingURL=LedgerDeviceLockedError.js.map