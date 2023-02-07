"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighInputAmountError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class HighInputAmountError extends LiqualityError_1.LiqualityError {
    constructor(data) {
        super(config_1.ERROR_NAMES.HighInputAmountError, data);
    }
    setTranslationKey() {
        this.translationKey = '';
    }
}
exports.HighInputAmountError = HighInputAmountError;
//# sourceMappingURL=HighInputAmountError.js.map