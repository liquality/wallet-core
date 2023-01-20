import { Status } from './status';
/** The Response to expect if a request might have been sent but it was skipped
 *  e.g. no events to flush, user has opted out and nothing should be sent.
 */
export var SKIPPED_RESPONSE = {
    status: Status.Skipped,
    statusCode: 0,
};
//# sourceMappingURL=response.js.map