"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDeclinedError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class UserDeclinedError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.UserDeclinedError);
    }
    setTranslationKey() {
        this.translationKey = '';
    }
}
exports.UserDeclinedError = UserDeclinedError;
//# sourceMappingURL=UserDeclinedError.js.map