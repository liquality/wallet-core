"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTransactionNotFoundError = void 0;
const errors_1 = require("@chainify/errors");
const error_parser_1 = require("@liquality/error-parser");
function isTransactionNotFoundError(error) {
    var _a;
    if (error instanceof error_parser_1.LiqualityError) {
        return ((_a = error.rawError) === null || _a === void 0 ? void 0 : _a.name) === errors_1.TxNotFoundError.prototype.name;
    }
    else {
        return error.name === errors_1.TxNotFoundError.prototype.name;
    }
}
exports.isTransactionNotFoundError = isTransactionNotFoundError;
//# sourceMappingURL=isTransactionNotFoundError.js.map