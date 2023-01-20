"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DappNotConnectedError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class DappNotConnectedError extends LiqualityError_1.LiqualityError {
    constructor(data) {
        super(config_1.ERROR_NAMES.DappNotConnectedError, data);
    }
    setTranslationKey() {
        this.translationKey = '';
    }
}
exports.DappNotConnectedError = DappNotConnectedError;
//# sourceMappingURL=DappNotConnectedError.js.map