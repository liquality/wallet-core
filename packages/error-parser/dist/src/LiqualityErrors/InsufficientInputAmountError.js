"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsufficientInputAmountError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class InsufficientInputAmountError extends LiqualityError_1.LiqualityError {
    constructor(data) {
        super(config_1.ERROR_NAMES.InsufficientInputAmountError, data);
    }
}
exports.InsufficientInputAmountError = InsufficientInputAmountError;
//# sourceMappingURL=InsufficientInputAmountError.js.map