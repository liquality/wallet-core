"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is1006NotFoundError = exports.is1001ValidationError = exports.errorName = exports.errorToLiqualityErrorString = exports.createInternalError = exports.LIQUALITY_ERROR_STRING_STARTER = exports.liqualityErrorStringToJson = exports.isLiqualityErrorString = void 0;
const LiqualityErrors_1 = require("../LiqualityErrors");
const reporters_1 = require("../reporters");
function isLiqualityErrorString(error) {
    return error.startsWith(exports.LIQUALITY_ERROR_STRING_STARTER);
}
exports.isLiqualityErrorString = isLiqualityErrorString;
function liqualityErrorStringToJson(error) {
    return JSON.parse(error.replace(exports.LIQUALITY_ERROR_STRING_STARTER, ''));
}
exports.liqualityErrorStringToJson = liqualityErrorStringToJson;
exports.LIQUALITY_ERROR_STRING_STARTER = 'LIQUALITY_ERROR_FROM_ERROR_PARSER_PACKAGE';
function createInternalError(customError) {
    const internalError = new LiqualityErrors_1.InternalError(customError);
    (0, reporters_1.reportLiqualityError)(internalError);
    return internalError;
}
exports.createInternalError = createInternalError;
function errorToLiqualityErrorString(error) {
    if (error instanceof LiqualityErrors_1.LiqualityError)
        return error.toString();
    else if (error instanceof Error && isLiqualityErrorString(error.message))
        return error.message;
    else
        return createInternalError(LiqualityErrors_1.CUSTOM_ERRORS.Unknown(error)).toString();
}
exports.errorToLiqualityErrorString = errorToLiqualityErrorString;
function errorName(error) {
    if (error instanceof LiqualityErrors_1.LiqualityError)
        return error.name;
    else if (error instanceof Error && isLiqualityErrorString(error.message))
        return liqualityErrorStringToJson(error.message).name;
    else
        return '';
}
exports.errorName = errorName;
function is1001ValidationError(error) {
    return error.code === 1001 && error.name === 'ValidationError';
}
exports.is1001ValidationError = is1001ValidationError;
function is1006NotFoundError(error) {
    return error.code === 1006 && error.name === 'NotFoundError';
}
exports.is1006NotFoundError = is1006NotFoundError;
//# sourceMappingURL=index.js.map