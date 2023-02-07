"use strict";
const { WinstonLogger } = require("@sinatdt/utils").logger;
let myLogger = new WinstonLogger({});
let getLogger = (spec) => myLogger.getLogger(spec);
let logger = myLogger.logger;
module.exports = {
    logger,
    getLogger,
};
//# sourceMappingURL=logger.js.map