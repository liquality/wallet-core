"use strict";
const tslib_1 = require("tslib");
const ErrorHandler = require('./error-class');
const logger = require('../config/logger').getLogger('log-error');
const { sendErrorToAdminByPriority } = require('../utils/notify-admin');
class MyErrorHandler extends ErrorHandler {
    sendErrorToAdminByPriority(message, errorPriority) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return sendErrorToAdminByPriority(message, errorPriority);
        });
    }
}
let errorHandler = new MyErrorHandler({}, logger);
let handleError = (err, moreInfo) => errorHandler.handleError(err, moreInfo);
let handleErrorAndExit = (err, moreInfo) => errorHandler.handleErrorAndExit(err, moreInfo);
module.exports = {
    handleError,
    handleErrorAndExit,
};
//# sourceMappingURL=error-handler.js.map