"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlippageTooHighError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class SlippageTooHighError extends LiqualityError_1.LiqualityError {
    constructor(data) {
        super(config_1.ERROR_NAMES.SlippageTooHighError, data);
    }
}
exports.SlippageTooHighError = SlippageTooHighError;
//# sourceMappingURL=SlippageTooHighError.js.map