"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerDeviceConnectionError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class LedgerDeviceConnectionError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.LedgerDeviceConnectionError);
    }
}
exports.LedgerDeviceConnectionError = LedgerDeviceConnectionError;
//# sourceMappingURL=LedgerDeviceConnectionError.js.map