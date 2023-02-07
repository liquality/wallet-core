"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyError = void 0;
const config_1 = require("../config");
const LiqualityError_1 = require("./LiqualityError");
const { PLAIN, PLACEHOLDER, SWAP_ACTIVITY, UNKNOWN_ACTIVITY } = config_1.TRANSLATION_KEYS;
class ThirdPartyError extends LiqualityError_1.LiqualityError {
    constructor(data) {
        super(config_1.ERROR_NAMES.ThirdPartyError, data);
        this.reportable = true;
    }
    setTranslationKey(data) {
        this.translationKey = `${this.name}.${PLAIN}`;
        if ((data === null || data === void 0 ? void 0 : data.activity) === LiqualityError_1.UserActivity.SWAP) {
            this.translationKey = `${this.name}.${PLACEHOLDER}.${SWAP_ACTIVITY}`;
        }
        else {
            this.translationKey = `${this.name}.${PLAIN}.${UNKNOWN_ACTIVITY}`;
        }
    }
}
exports.ThirdPartyError = ThirdPartyError;
//# sourceMappingURL=ThirdPartyError.js.map