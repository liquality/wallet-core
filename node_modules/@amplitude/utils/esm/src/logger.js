import { LogLevel } from '@amplitude/types';
import { getGlobalAmplitudeNamespace } from './misc';
// TODO: Type the global constant
var globalNamespace = getGlobalAmplitudeNamespace();
/** Prefix for logging strings */
var PREFIX = 'Amplitude Logger ';
/** JSDoc */
var Logger = /** @class */ (function () {
    /** JSDoc */
    function Logger() {
        this._logLevel = 0;
    }
    /** JSDoc */
    Logger.prototype.disable = function () {
        this._logLevel = 0;
    };
    /** JSDoc */
    Logger.prototype.enable = function (logLevel) {
        if (logLevel === void 0) { logLevel = LogLevel.Warn; }
        this._logLevel = logLevel;
    };
    /** JSDoc */
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._logLevel < LogLevel.Verbose) {
            return;
        }
        global.console.log(PREFIX + "[Log]: " + args.join(' ')); // tslint:disable-line:no-console
    };
    /** JSDoc */
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._logLevel < LogLevel.Warn) {
            return;
        }
        global.console.warn(PREFIX + "[Warn]: " + args.join(' ')); // tslint:disable-line:no-console
    };
    /** JSDoc */
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._logLevel < LogLevel.Error) {
            return;
        }
        global.console.error(PREFIX + "[Error]: " + args.join(' ')); // tslint:disable-line:no-console
    };
    return Logger;
}());
// Ensure we only have a single logger instance, even if multiple versions of @amplitude/utils are being used
var logger = globalNamespace.logger;
if (logger === undefined) {
    logger = new Logger();
    globalNamespace.logger = logger;
}
export { logger };
//# sourceMappingURL=logger.js.map