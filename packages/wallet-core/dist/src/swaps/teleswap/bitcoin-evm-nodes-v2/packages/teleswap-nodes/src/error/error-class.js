"use strict";
const tslib_1 = require("tslib");
const { PRIORITY } = require('./error-constant');
class ErrorHandler {
    constructor({ defaultPriority = PRIORITY.IMPORTANT, sendToAdminPriorityThd = PRIORITY.IMPORTANT }, logger = undefined) {
        this.defaultPriority = defaultPriority;
        this.sendToAdminPriorityThd = sendToAdminPriorityThd;
        this.logger = logger;
    }
    logWarn(message) {
        if (this.logger) {
            this.logger.log(message);
            return;
        }
        console.log(message);
    }
    logError(message) {
        if (this.logger) {
            this.logger.error(message);
            return;
        }
        console.log(message);
    }
    logErrorMessage(err, extraMoreInfo) {
        try {
            let moreInfo = JSON.stringify(extraMoreInfo || err.moreInfo, null, 2);
            if (moreInfo) {
                this.logError(`error more info : ${moreInfo}`);
            }
            let errorPriority = err.priority || PRIORITY.IMPORTANT;
            let errorMessage = (err === null || err === void 0 ? void 0 : err.stack) || JSON.stringify(err, null, 4);
            if (errorPriority <= PRIORITY.WARNING) {
                this.logWarn(`error : ${errorMessage}`);
                this.logWarn(`error priority: ${errorPriority}`);
            }
            else {
                this.logError(`error : ${errorMessage}`);
                this.logError(`error priority: ${errorPriority}`);
            }
        }
        catch (internalError) {
            console.log(`something bad happened while logging error. error ${internalError.message}`);
        }
    }
    checkAndSendErrorToAdmin(err, extraMoreInfo) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let moreInfo = JSON.stringify(extraMoreInfo || err.moreInfo, null, 2);
                let errorMessage = err.message || (err === null || err === void 0 ? void 0 : err.stack)
                    ? err.stack.split('\n').slice(0, 3).join('\n')
                    : JSON.stringify(err, null, 4);
                let moreInfoMessage = moreInfo ? `more info: ${moreInfo || ''}` : '';
                let message = `time: ${new Date().toLocaleString()}
     ${errorMessage} 
     ${moreInfoMessage} 
      `;
                let errorPriority = err.priority || this.defaultPriority;
                if (errorPriority >= this.sendToAdminPriorityThd)
                    yield this.sendErrorToAdminByPriority(message, errorPriority);
            }
            catch (internalError) {
                console.log(`something bad happened while sending error to admin. error ${internalError.stack}`);
            }
        });
    }
    handleError(err, moreInfo) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logErrorMessage(err, moreInfo);
            yield this.checkAndSendErrorToAdmin(err, moreInfo);
        });
    }
    handleErrorAndExit(err, moreInfo) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.handleError(err, moreInfo);
            process.exit();
        });
    }
    sendErrorToAdminByPriority(message, errorPriority) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
}
module.exports = ErrorHandler;
//# sourceMappingURL=error-class.js.map