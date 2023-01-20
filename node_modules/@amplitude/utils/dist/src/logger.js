Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var types_1 = require("@amplitude/types");
var misc_1 = require("./misc");
// TODO: Type the global constant
var globalNamespace = misc_1.getGlobalAmplitudeNamespace();
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
        if (logLevel === void 0) { logLevel = types_1.LogLevel.Warn; }
        this._logLevel = logLevel;
    };
    /** JSDoc */
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._logLevel < types_1.LogLevel.Verbose) {
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
        if (this._logLevel < types_1.LogLevel.Warn) {
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
        if (this._logLevel < types_1.LogLevel.Error) {
            return;
        }
        global.console.error(PREFIX + "[Error]: " + args.join(' ')); // tslint:disable-line:no-console
    };
    return Logger;
}());
// Ensure we only have a single logger instance, even if multiple versions of @amplitude/utils are being used
var logger = globalNamespace.logger;
exports.logger = logger;
if (logger === undefined) {
    exports.logger = logger = new Logger();
    globalNamespace.logger = logger;
}
//# sourceMappingURL=logger.js.map