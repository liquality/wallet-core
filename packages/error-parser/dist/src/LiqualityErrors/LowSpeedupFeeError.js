"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LowSpeedupFeeError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class LowSpeedupFeeError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.LowSpeedupFeeError);
    }
}
exports.LowSpeedupFeeError = LowSpeedupFeeError;
//# sourceMappingURL=LowSpeedupFeeError.js.map