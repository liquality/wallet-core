var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prototypeJsFix = exports.asyncSleep = exports.getGlobalAmplitudeNamespace = exports.getGlobalObject = exports.isBrowserEnv = exports.isNodeEnv = void 0;
var tslib_1 = require("tslib");
/**
 * Checks whether we're in a Node.js environment
 *
 * @returns Answer to given question
 */
function isNodeEnv() {
    var _a;
    return typeof process === 'object' && ((_a = process === null || process === void 0 ? void 0 : process.versions) === null || _a === void 0 ? void 0 : _a.node) !== undefined;
}
exports.isNodeEnv = isNodeEnv;
/**
 * Checks whether we're in a browser environment
 *
 * @returns Answer to given question
 */
function isBrowserEnv() {
    return typeof window === 'object' && (window === null || window === void 0 ? void 0 : window.document) !== undefined;
}
exports.isBrowserEnv = isBrowserEnv;
var fallbackGlobalObject = {};
/**
 * Safely get global scope object
 *
 * @returns Global scope object
 */
exports.getGlobalObject = function () {
    if (isNodeEnv()) {
        return global;
    }
    else if (typeof window !== 'undefined') {
        return window;
    }
    else if (typeof self !== 'undefined') {
        return self;
    }
    else {
        return fallbackGlobalObject;
    }
};
exports.getGlobalAmplitudeNamespace = function () {
    var global = exports.getGlobalObject();
    if (global.__AMPLITUDE__ === undefined) {
        global.__AMPLITUDE__ = {};
    }
    return global.__AMPLITUDE__;
};
/**
 * A promise-based way to sleep for x millseconds, then queue ourselves back to the
 * JS event loop.
 *
 * @param milliseconds The number of milliseconds to wait for
 */
exports.asyncSleep = function (milliseconds) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, milliseconds); })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * Fixes browser edge case where Prototype.js injects Array.prototype.toJSON and breaks the built-in JSON.stringify()
 *
 * @returns true if Array.prototype.toJSON was deleted, false if not
 */
exports.prototypeJsFix = function () {
    var _a;
    if (isBrowserEnv()) {
        var augmentedWindow = window;
        var augmentedArray = Array;
        if (augmentedWindow.Prototype !== undefined && ((_a = augmentedArray.prototype) === null || _a === void 0 ? void 0 : _a.toJSON) !== undefined) {
            delete augmentedArray.prototype.toJSON;
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=misc.js.map