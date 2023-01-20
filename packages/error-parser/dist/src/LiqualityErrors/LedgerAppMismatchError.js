"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerAppMismatchError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class LedgerAppMismatchError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.LedgerAppMismatchError);
    }
}
exports.LedgerAppMismatchError = LedgerAppMismatchError;
//# sourceMappingURL=LedgerAppMismatchError.js.map