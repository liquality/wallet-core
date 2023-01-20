"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeryHighTipWarning = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class VeryHighTipWarning extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.VeryHighTipWarning);
    }
}
exports.VeryHighTipWarning = VeryHighTipWarning;
//# sourceMappingURL=VeryHighTipWarning.js.map