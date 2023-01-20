"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActivity = exports.LiqualityError = void 0;
const randomBytes = require("randombytes");
const config_1 = require("../config");
const utils_1 = require("../utils");
const { PLAIN, PLACEHOLDER } = config_1.TRANSLATION_KEYS;
class LiqualityError extends Error {
    constructor(name, data) {
        super();
        this.reported = false;
        this.reportable = false;
        this.name = name;
        this.setTranslationKey(data);
        if (!data)
            data = {};
        this.data = Object.assign(Object.assign({}, data), { errorId: randomBytes(config_1.ERROR_ID_LENGTH).toString('hex') });
    }
    setTranslationKey(data) {
        if (data) {
            this.translationKey = `${this.name}.${PLACEHOLDER}`;
        }
        else {
            this.translationKey = `${this.name}.${PLAIN}`;
        }
    }
    toString() {
        const jsonifiedErrorWithoutStack = JSON.parse(JSON.stringify(this));
        const jsonifiedErrorWithStack = Object.assign(Object.assign({}, jsonifiedErrorWithoutStack), { stack: this.stack });
        return `${utils_1.LIQUALITY_ERROR_STRING_STARTER}${JSON.stringify(jsonifiedErrorWithStack)}`;
    }
}
exports.LiqualityError = LiqualityError;
var UserActivity;
(function (UserActivity) {
    UserActivity["SWAP"] = "SWAP";
    UserActivity["UNKNOWN"] = "UNKNOWN";
})(UserActivity = exports.UserActivity || (exports.UserActivity = {}));
//# sourceMappingURL=LiqualityError.js.map