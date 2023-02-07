"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportLiqualityError = exports.updateErrorReporterConfig = void 0;
const LiqualityErrors_1 = require("../LiqualityErrors");
const utils_1 = require("../utils");
const LiqualityError_1 = require("../LiqualityErrors/LiqualityError");
const types_1 = require("../types");
const console_1 = require("./console");
const discord_1 = require("./discord");
const reporterConfig = new (class ReporterConfig {
    constructor() {
        this.useReporter = false;
        this.callback = false;
    }
})();
function updateErrorReporterConfig({ useReporter, callback, }) {
    if (typeof useReporter !== 'undefined')
        reporterConfig.useReporter = useReporter;
    if (callback) {
        reporterConfig.callback = callback;
    }
}
exports.updateErrorReporterConfig = updateErrorReporterConfig;
function reportLiqualityError(error) {
    if (reporterConfig.useReporter) {
        const liqualityError = errorToLiqualityErrorObj(error);
        if (!liqualityError.reportable || liqualityError.reported)
            return;
        const reportTargets = process.env.VUE_APP_REPORT_TARGETS;
        if (reportTargets === null || reportTargets === void 0 ? void 0 : reportTargets.includes(types_1.ReportTargets.Console))
            (0, console_1.reportToConsole)(liqualityError);
        if (reportTargets === null || reportTargets === void 0 ? void 0 : reportTargets.includes(types_1.ReportTargets.Discord))
            (0, discord_1.reportToDiscord)(liqualityError);
        liqualityError.reported = true;
    }
    reporterConfig.callback && reporterConfig.callback((0, utils_1.liqualityErrorStringToJson)((0, utils_1.errorToLiqualityErrorString)(error)));
}
exports.reportLiqualityError = reportLiqualityError;
function errorToLiqualityErrorObj(error) {
    if (error instanceof LiqualityError_1.LiqualityError)
        return error;
    else if (error instanceof Error && (0, utils_1.isLiqualityErrorString)(error.message))
        return (0, utils_1.liqualityErrorStringToJson)(error.message);
    else
        return new LiqualityErrors_1.InternalError(LiqualityErrors_1.CUSTOM_ERRORS.Unknown(error));
}
//# sourceMappingURL=index.js.map