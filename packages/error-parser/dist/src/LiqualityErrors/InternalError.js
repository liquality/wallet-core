"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class InternalError extends LiqualityError_1.LiqualityError {
    constructor(rawError) {
        super(config_1.ERROR_NAMES.InternalError);
        this.reportable = true;
        if (rawError)
            this.rawError = rawError;
    }
}
exports.InternalError = InternalError;
//# sourceMappingURL=InternalError.js.map