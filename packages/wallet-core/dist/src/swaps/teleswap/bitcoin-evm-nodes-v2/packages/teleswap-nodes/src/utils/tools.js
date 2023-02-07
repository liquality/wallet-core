"use strict";
const tslib_1 = require("tslib");
const util = require('util');
const sleep = util.promisify(setTimeout);
function runWithRetries(action, config = {
    maxTries: 2,
    retrySleep: 1000,
}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const maxTries = config.maxTries || 2;
        const retrySleep = config.retrySleep || 1000;
        let lastError;
        for (let count = 0; count < maxTries; count += 1) {
            try {
                return yield action();
            }
            catch (error) {
                lastError = error;
            }
            yield sleep(retrySleep);
        }
        throw lastError || new Error('function failed after retries');
    });
}
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
module.exports = {
    sleep,
    runWithRetries,
    getRandomInteger,
};
//# sourceMappingURL=tools.js.map