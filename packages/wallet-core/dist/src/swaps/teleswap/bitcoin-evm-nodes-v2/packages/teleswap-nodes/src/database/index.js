"use strict";
const lockerDb = require('./locker');
const lockerDbMethods = require('./locker/methods');
const teleporterDb = require('./teleporter');
const teleporterDbMethods = require('./teleporter/methods');
module.exports = {
    locker: {
        db: lockerDb,
        methods: lockerDbMethods,
    },
    teleporter: {
        db: teleporterDb,
        methods: teleporterDbMethods,
    },
};
//# sourceMappingURL=index.js.map