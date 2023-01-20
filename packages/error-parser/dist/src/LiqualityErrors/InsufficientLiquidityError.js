"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsufficientLiquidityError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class InsufficientLiquidityError extends LiqualityError_1.LiqualityError {
    constructor(data) {
        super(config_1.ERROR_NAMES.InsufficientLiquidityError, data);
    }
    setTranslationKey() {
        this.translationKey = '';
    }
}
exports.InsufficientLiquidityError = InsufficientLiquidityError;
//# sourceMappingURL=InsufficientLiquidityError.js.map