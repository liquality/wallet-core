"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorParser = void 0;
const tslib_1 = require("tslib");
const reporters_1 = require("../reporters");
const LiqualityError_1 = require("../LiqualityErrors/LiqualityError");
class ErrorParser {
    wrap(func, data) {
        try {
            return func();
        }
        catch (error) {
            const liqualityError = this.parseError(error, data);
            throw liqualityError;
        }
    }
    wrapAsync(func, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return yield func();
            }
            catch (error) {
                const liqualityError = this.parseError(error, data);
                throw liqualityError;
            }
        });
    }
    parseError(error, data) {
        if (error instanceof LiqualityError_1.LiqualityError)
            return error;
        const parsedError = this._parseError(error, data);
        (0, reporters_1.reportLiqualityError)(parsedError);
        return parsedError;
    }
}
exports.ErrorParser = ErrorParser;
//# sourceMappingURL=ErrorParser.js.map