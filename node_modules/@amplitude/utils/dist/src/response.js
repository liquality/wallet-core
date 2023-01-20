Object.defineProperty(exports, "__esModule", { value: true });
exports.mapJSONToResponse = exports.mapHttpMessageToResponse = exports.collectInvalidEventIndices = void 0;
var types_1 = require("@amplitude/types");
var status_1 = require("./status");
/**
 * Collects the invalid event indices off a HTTP API v2 response
 * and returns them in increasing order.
 *
 * @param response A Response from sending an event payload
 * @returns An concatenated array of indices
 */
exports.collectInvalidEventIndices = function (response) {
    var invalidEventIndices = new Set();
    if (response.status === types_1.Status.Invalid && response.body !== undefined) {
        var _a = response.body, eventsWithInvalidFields_1 = _a.eventsWithInvalidFields, eventsWithMissingFields_1 = _a.eventsWithMissingFields;
        Object.keys(eventsWithInvalidFields_1).forEach(function (field) {
            var _a;
            var eventIndices = (_a = eventsWithInvalidFields_1[field]) !== null && _a !== void 0 ? _a : [];
            eventIndices.forEach(function (index) {
                invalidEventIndices.add(index);
            });
        });
        Object.keys(eventsWithMissingFields_1).forEach(function (field) {
            var _a;
            var eventIndices = (_a = eventsWithMissingFields_1[field]) !== null && _a !== void 0 ? _a : [];
            eventIndices.forEach(function (index) {
                invalidEventIndices.add(index);
            });
        });
    }
    return Array.from(invalidEventIndices).sort(function (numberOne, numberTwo) { return numberOne - numberTwo; });
};
/**
 * Converts a http.IncomingMessage object into a Response object.
 *
 * @param httpRes The http response from the HTTP API.
 * @returns Response a nicely typed and cased response object.
 */
exports.mapHttpMessageToResponse = function (httpRes) {
    var statusCode = httpRes.statusCode === undefined ? 0 : httpRes.statusCode;
    var status = status_1.mapHttpCodeToStatus(statusCode);
    return {
        status: status,
        statusCode: statusCode,
    };
};
/**
 * Converts the response from the HTTP V2 API into a Response object.
 * Should be used only if we are pointed towards the v2 api.
 *
 * @param responseJSON The response body from the HTTP V2 API, as a JSON blob
 * @returns Response a nicely typed and cased response object.
 */
exports.mapJSONToResponse = function (responseJSON) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    if (typeof responseJSON !== 'object') {
        return null;
    }
    var status = status_1.mapHttpCodeToStatus(responseJSON.code);
    var statusCode = responseJSON.code;
    switch (status) {
        case types_1.Status.Success:
            return {
                status: status,
                statusCode: statusCode,
                body: {
                    eventsIngested: responseJSON.events_ingested,
                    payloadSizeBytes: responseJSON.payload_size_bytes,
                    serverUploadTime: responseJSON.server_upload_time,
                },
            };
        case types_1.Status.Invalid:
            return {
                status: status,
                statusCode: statusCode,
                body: {
                    error: (_a = responseJSON.error) !== null && _a !== void 0 ? _a : '',
                    missingField: (_b = responseJSON.missing_field) !== null && _b !== void 0 ? _b : null,
                    eventsWithInvalidFields: (_c = responseJSON.events_with_invalid_fields) !== null && _c !== void 0 ? _c : {},
                    eventsWithMissingFields: (_d = responseJSON.events_with_missing_fields) !== null && _d !== void 0 ? _d : {},
                },
            };
        case types_1.Status.PayloadTooLarge:
            return {
                status: status,
                statusCode: statusCode,
                body: {
                    error: (_e = responseJSON.error) !== null && _e !== void 0 ? _e : '',
                },
            };
        case types_1.Status.RateLimit:
            return {
                status: status,
                statusCode: statusCode,
                body: {
                    error: (_f = responseJSON.error) !== null && _f !== void 0 ? _f : '',
                    epsThreshold: responseJSON.eps_threshold,
                    throttledDevices: (_g = responseJSON.throttled_devices) !== null && _g !== void 0 ? _g : {},
                    throttledUsers: (_h = responseJSON.throttled_users) !== null && _h !== void 0 ? _h : {},
                    exceededDailyQuotaDevices: (_j = responseJSON.exceeded_daily_quota_devices) !== null && _j !== void 0 ? _j : {},
                    exceededDailyQuotaUsers: (_k = responseJSON.exceeded_daily_quota_users) !== null && _k !== void 0 ? _k : {},
                    throttledEvents: (_l = responseJSON.throttled_events) !== null && _l !== void 0 ? _l : [],
                },
            };
        case types_1.Status.Timeout:
        default:
            return {
                status: status,
                statusCode: statusCode,
            };
    }
};
//# sourceMappingURL=response.js.map