"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoTipError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class NoTipError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.NoTipError);
    }
}
exports.NoTipError = NoTipError;
//# sourceMappingURL=NoTipError.js.map