"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeryLowTipError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class VeryLowTipError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.VeryLowTipError);
    }
}
exports.VeryLowTipError = VeryLowTipError;
//# sourceMappingURL=VeryLowTipError.js.map