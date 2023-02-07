"use strict";
const baseDb = require('../db.connection');
const { valueEncoding } = require('../../config/database.config');
const db = baseDb.sublevel('locker');
const general = db.sublevel('general', { valueEncoding });
const requestQueue = db.sublevel('request', { valueEncoding });
const pendingRequest = db.sublevel('pending', { valueEncoding });
module.exports = {
    general,
    requestQueue,
    pendingRequest,
};
//# sourceMappingURL=index.js.map