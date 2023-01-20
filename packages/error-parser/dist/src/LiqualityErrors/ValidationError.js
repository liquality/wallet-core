"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class ValidationError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.ValidationError);
    }
    setTranslationKey() {
        this.translationKey = '';
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=ValidationError.js.map