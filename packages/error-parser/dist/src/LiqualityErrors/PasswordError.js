"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class PasswordError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.PasswordError);
    }
}
exports.PasswordError = PasswordError;
//# sourceMappingURL=PasswordError.js.map