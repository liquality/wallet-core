"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletLockedError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
class WalletLockedError extends LiqualityError_1.LiqualityError {
    constructor() {
        super(config_1.ERROR_NAMES.WalletLockedError);
    }
    setTranslationKey() {
        this.translationKey = '';
    }
}
exports.WalletLockedError = WalletLockedError;
//# sourceMappingURL=WalletLockedError.js.map