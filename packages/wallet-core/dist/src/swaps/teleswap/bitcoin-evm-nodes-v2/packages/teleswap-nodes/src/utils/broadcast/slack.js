"use strict";
const tslib_1 = require("tslib");
const { getAxiosInstance } = require('../tools');
const { generateAttachment } = require('./broadcast-utils/slack-attachments');
class Slack {
    constructor({ channelWebHook, channelName, defaultTitle = '' }, enabled = true) {
        this.enabled = enabled;
        this.channelWebHook = channelWebHook;
        this.channelName = channelName;
        this.defaultTitle = defaultTitle;
        this.PRIORITY = {
            NOT_IMPORTANT: 0,
            NORMAL: 1,
            WARNING: 2,
            HIGH: 3,
            CRITICAL: 4,
        };
    }
    sendMessageToSlackChannel({ message, title = this.defaultTitle, priority = this.PRIORITY.NORMAL, isError = false, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.enabled) {
                return {
                    status: false,
                    message: 'slack is disabled',
                };
            }
            let axios = getAxiosInstance({
                baseUrl: this.channelWebHook,
            });
            let attachments = generateAttachment({ message, priority, isError });
            yield axios.post(this.channelWebHook, {
                text: title,
                attachments,
            });
            return {
                status: true,
                message: 'send message successfully',
            };
        });
    }
}
module.exports = Slack;
//# sourceMappingURL=slack.js.map