Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
/** The status of an event. */
var Status;
(function (Status) {
    /** The status could not be determined. */
    Status["Unknown"] = "unknown";
    /** The event was skipped due to configuration or callbacks. */
    Status["Skipped"] = "skipped";
    /** The event was sent successfully. */
    Status["Success"] = "success";
    /** A user or device in the payload is currently rate limited and should try again later. */
    Status["RateLimit"] = "rate_limit";
    /** The sent payload was too large to be processed. */
    Status["PayloadTooLarge"] = "payload_too_large";
    /** The event could not be processed. */
    Status["Invalid"] = "invalid";
    /** A server-side error ocurred during submission. */
    Status["Failed"] = "failed";
    /** a server or client side error occuring when a request takes too long and is cancelled */
    Status["Timeout"] = "Timeout";
    /** NodeJS runtime environment error.. E.g. disconnected from network */
    Status["SystemError"] = "SystemError";
})(Status = exports.Status || (exports.Status = {}));
//# sourceMappingURL=status.js.map