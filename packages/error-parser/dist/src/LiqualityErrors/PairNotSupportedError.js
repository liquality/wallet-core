"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PairNotSupportedError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class PairNotSupportedError extends LiqualityError_1.LiqualityError {
    constructor(data) {
        super(config_1.ERROR_NAMES.PairNotSupportedError, data);
    }
}
exports.PairNotSupportedError = PairNotSupportedError;
//# sourceMappingURL=PairNotSupportedError.js.map