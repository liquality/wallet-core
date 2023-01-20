"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerDeviceNotUpdatedError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class LedgerDeviceNotUpdatedError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.LedgerDeviceNotUpdatedError);
    }
}
exports.LedgerDeviceNotUpdatedError = LedgerDeviceNotUpdatedError;
//# sourceMappingURL=LedgerDeviceNotUpdatedError.js.map