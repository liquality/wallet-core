"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeryLowMaxFeeError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class VeryLowMaxFeeError extends LiqualityError_1.LiqualityError {
    constructor(data) {
        super(config_1.ERROR_NAMES.VeryLowMaxFeeError, data);
    }
}
exports.VeryLowMaxFeeError = VeryLowMaxFeeError;
//# sourceMappingURL=VeryLowMaxFeeError.js.map