"use strict";
const tslib_1 = require("tslib");
const { getLogger } = require('../config/logger');
const { sendMessageToSlackChannel, email } = require('./broadcast');
const logger = getLogger('SLACK-SEND_MESSAGE');
function sendErrorToAdminByPriority(message, priority = 1) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            if (priority > 2) {
                yield sendMessageToSlackChannel({
                    message,
                    title: 'New Error Occurred',
                    priority,
                    isError: true,
                });
            }
        }
        catch (error) {
            logger.error('Failed To Send Error To Admin');
        }
    });
}
function sendNotificationToAdmin(message, priority = 1, title = undefined) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield sendMessageToSlackChannel({ title, message, priority });
        }
        catch (error) {
            logger.error('Failed To Send Message To Admin');
        }
    });
}
module.exports = { sendErrorToAdminByPriority, sendNotificationToAdmin };
//# sourceMappingURL=notify-admin.js.map