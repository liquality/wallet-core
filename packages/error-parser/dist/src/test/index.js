"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorAsync = exports.getError = exports.FAKE_ERROR = void 0;
const tslib_1 = require("tslib");
exports.FAKE_ERROR = 'Fake Error';
function getError(func) {
    try {
        return func();
    }
    catch (error) {
        return error;
    }
}
exports.getError = getError;
function getErrorAsync(func) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            return yield func();
        }
        catch (error) {
            return error;
        }
    });
}
exports.getErrorAsync = getErrorAsync;
//# sourceMappingURL=index.js.map