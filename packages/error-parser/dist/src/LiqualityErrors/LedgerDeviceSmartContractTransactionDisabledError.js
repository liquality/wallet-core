"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerDeviceSmartContractTransactionDisabledError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class LedgerDeviceSmartContractTransactionDisabledError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.LedgerDeviceSmartContractTransactionDisabledError);
    }
}
exports.LedgerDeviceSmartContractTransactionDisabledError = LedgerDeviceSmartContractTransactionDisabledError;
//# sourceMappingURL=LedgerDeviceSmartContractTransactionDisabledError.js.map