"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class UnknownError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.UnknownError);
        this.reportable = true;
    }
}
exports.UnknownError = UnknownError;
//# sourceMappingURL=UnknownError.js.map