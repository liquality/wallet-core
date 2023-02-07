"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoActiveWalletError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class NoActiveWalletError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.NoActiveWalletError);
    }
    setTranslationKey() {
        this.translationKey = '';
    }
}
exports.NoActiveWalletError = NoActiveWalletError;
//# sourceMappingURL=NoActiveWalletError.js.map