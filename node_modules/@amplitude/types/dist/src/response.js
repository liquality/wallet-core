Object.defineProperty(exports, "__esModule", { value: true });
exports.SKIPPED_RESPONSE = void 0;
var status_1 = require("./status");
/** The Response to expect if a request might have been sent but it was skipped
 *  e.g. no events to flush, user has opted out and nothing should be sent.
 */
exports.SKIPPED_RESPONSE = {
    status: status_1.Status.Skipped,
    statusCode: 0,
};
//# sourceMappingURL=response.js.map