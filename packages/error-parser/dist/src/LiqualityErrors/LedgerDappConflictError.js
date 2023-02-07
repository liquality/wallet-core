"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerDappConflictError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class LedgerDappConflictError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.LedgerDappConflictError);
    }
}
exports.LedgerDappConflictError = LedgerDappConflictError;
//# sourceMappingURL=LedgerDappConflictError.js.map