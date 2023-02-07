"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateTokenSymbolError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class DuplicateTokenSymbolError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.DuplicateTokenSymbolError);
    }
}
exports.DuplicateTokenSymbolError = DuplicateTokenSymbolError;
//# sourceMappingURL=DuplicateTokenSymbolError.js.map