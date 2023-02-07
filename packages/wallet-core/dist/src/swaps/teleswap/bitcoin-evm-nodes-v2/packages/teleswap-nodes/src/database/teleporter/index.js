"use strict";
const baseDb = require('../db.connection');
const { valueEncoding } = require('../../config/database.config');
const db = baseDb.sublevel('teleporter');
const general = db.sublevel('general', { valueEncoding });
const slashUser = db.sublevel('slash-user', { valueEncoding });
const slashLockerBurnRequests = db.sublevel('slash-locker-requests', { valueEncoding });
const slashLockerBurnTxs = db.sublevel('slash-locker-txs', { valueEncoding });
module.exports = {
    general,
    slashUser,
    slashLockerBurnRequests,
    slashLockerBurnTxs,
};
//# sourceMappingURL=index.js.map