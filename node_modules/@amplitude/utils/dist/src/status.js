Object.defineProperty(exports, "__esModule", { value: true });
exports.mapHttpCodeToStatus = void 0;
var types_1 = require("@amplitude/types");
/**
 * Converts a HTTP status code into a {@link Status}.
 *
 * @param code The HTTP response status code.
 * @returns The send status or {@link Status.Unknown}.
 */
function mapHttpCodeToStatus(code) {
    if (code >= 200 && code < 300) {
        return types_1.Status.Success;
    }
    if (code === 429) {
        return types_1.Status.RateLimit;
    }
    if (code === 413) {
        return types_1.Status.PayloadTooLarge;
    }
    if (code === 408) {
        return types_1.Status.Timeout;
    }
    if (code >= 400 && code < 500) {
        return types_1.Status.Invalid;
    }
    if (code >= 500) {
        return types_1.Status.Failed;
    }
    return types_1.Status.Unknown;
}
exports.mapHttpCodeToStatus = mapHttpCodeToStatus;
//# sourceMappingURL=status.js.map