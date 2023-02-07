"use strict";
const { WinstonLogger } = require('@sinatdt/utils').logger;
const nconf = require('./.envs.nconf');
const environment = nconf.get('NODE_ENV') || 'development';
const logLevel = nconf.get('LOGGER:LOG_LEVEL') || 'info';
let myLogger = new WinstonLogger({
    environment,
    logLevel,
});
let getLogger = (spec) => myLogger.getLogger(spec);
let logger = myLogger.logger;
let createLogger = (loggerName) => myLogger.createLoggerAndTransports(loggerName);
module.exports = { getLogger, logger, createLogger };
//# sourceMappingURL=logger.js.map