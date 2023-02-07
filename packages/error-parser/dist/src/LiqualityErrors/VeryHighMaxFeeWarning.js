"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeryHighMaxFeeWarning = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class VeryHighMaxFeeWarning extends LiqualityError_1.LiqualityError {
    constructor(data) {
        super(config_1.ERROR_NAMES.VeryHighMaxFeeWarning, data);
    }
}
exports.VeryHighMaxFeeWarning = VeryHighMaxFeeWarning;
//# sourceMappingURL=VeryHighMaxFeeWarning.js.map