"use strict";
const nconf = require('./.envs.nconf');
const config = {
    email: {
        enabled: nconf.get('EMAIL:ENABLED'),
        host: nconf.get('EMAIL:HOST'),
        port: nconf.get('EMAIL:PORT'),
        username: nconf.get('EMAIL:USERNAME'),
        password: nconf.get('EMAIL:PASSWORD'),
        from: nconf.get('EMAIL:FROM'),
        adminAddresses: nconf.get('EMAIL:ADMIN_ADDRESSES'),
    },
    slack: {
        enabled: nconf.get('SLACK:ENABLED'),
        webhookUrl: nconf.get('SLACK:WEBHOOK_URL'),
    },
};
module.exports = config;
//# sourceMappingURL=notification.config.js.map