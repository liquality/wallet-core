"use strict";
const { Level } = require('level');
const { path, valueEncoding } = require('../config/database.config');
const db = new Level(path, { valueEncoding });
module.exports = db;
//# sourceMappingURL=db.connection.js.map