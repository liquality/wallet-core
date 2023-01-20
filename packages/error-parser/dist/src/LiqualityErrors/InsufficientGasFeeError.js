"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsufficientGasFeeError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class InsufficientGasFeeError extends LiqualityError_1.LiqualityError {
    constructor(data) {
        super(config_1.ERROR_NAMES.InsufficientGasFeeError, data);
    }
}
exports.InsufficientGasFeeError = InsufficientGasFeeError;
//# sourceMappingURL=InsufficientGasFeeError.js.map