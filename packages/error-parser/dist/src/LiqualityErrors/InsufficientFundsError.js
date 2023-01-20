"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsufficientFundsError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class InsufficientFundsError extends LiqualityError_1.LiqualityError {
    constructor(data) {
        super(config_1.ERROR_NAMES.InsufficientFundsError, data);
    }
}
exports.InsufficientFundsError = InsufficientFundsError;
//# sourceMappingURL=InsufficientFundsError.js.map