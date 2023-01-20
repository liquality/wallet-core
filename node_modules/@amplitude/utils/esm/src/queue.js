import { __awaiter, __generator } from "tslib";
/**
 * Helper utility that processes promises one by one in the order they arrive,
 * with an optional time-out value.
 */
var AsyncQueue = /** @class */ (function () {
    function AsyncQueue() {
        this._promiseQueue = [];
        this._promiseInProgress = false;
    }
    // Awaits the finish of all promises that have been queued up before it
    // And will expire itself (reject the promise) after waiting limit ms
    // or never expire, if limit is not set
    AsyncQueue.prototype.addToQueue = function (promiseGenerator) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            // The callback that will start the promise resolution
                            var startPromise = function () { return __awaiter(_this, void 0, void 0, function () {
                                var resp, err_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            this._promiseInProgress = true;
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, 4, 5]);
                                            return [4 /*yield*/, promiseGenerator()];
                                        case 2:
                                            resp = _a.sent();
                                            resolve(resp);
                                            return [3 /*break*/, 5];
                                        case 3:
                                            err_1 = _a.sent();
                                            reject(err_1);
                                            return [3 /*break*/, 5];
                                        case 4:
                                            this._notifyUploadFinish();
                                            return [7 /*endfinally*/];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); };
                            // If there is no promise in progress
                            // Return immediately
                            if (!_this._promiseInProgress) {
                                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                startPromise();
                                return;
                            }
                            var queueObject = {
                                startPromise: startPromise,
                            };
                            _this._promiseQueue.push(queueObject);
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Notify the oldest awaiting promise that the queue is ready to process another promise
    AsyncQueue.prototype._notifyUploadFinish = function () {
        this._promiseInProgress = false;
        var oldestPromise = this._promiseQueue.shift();
        if (oldestPromise !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            oldestPromise.startPromise();
        }
    };
    return AsyncQueue;
}());
export { AsyncQueue };
//# sourceMappingURL=queue.js.map