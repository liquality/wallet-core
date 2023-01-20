"use strict";
const tslib_1 = require("tslib");
const { general: generalDb } = require('.');
const slashLocker = require('./slash-locker');
const slashUser = require('./slash-user');
function setLastCheckedBitcoinBlock(blockNumber, taskName = 'teleport') {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return generalDb.put(`lastCheckedBitcoinBlock:${taskName}`, blockNumber);
    });
}
function getLastCheckedBitcoinBlock(taskName = 'teleport') {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let blockNumber = yield generalDb.get(`lastCheckedBitcoinBlock:${taskName}`).catch((err) => {
            if (err.notFound)
                return null;
            throw err;
        });
        return blockNumber || 0;
    });
}
function setLastCheckedEthBlock(blockNumber, taskName = 'teleport') {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return generalDb.put(`lastCheckedEthBlock:${taskName}`, blockNumber);
    });
}
function getLastCheckedEthBlock(taskName = 'teleport') {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let blockNumber = yield generalDb.get(`lastCheckedEthBlock:${taskName}`).catch((err) => {
            if (err.notFound)
                return null;
            throw err;
        });
        return blockNumber || 0;
    });
}
module.exports = {
    general: {
        setLastCheckedBitcoinBlock,
        getLastCheckedBitcoinBlock,
        setLastCheckedEthBlock,
        getLastCheckedEthBlock,
    },
    slashUser,
    slashLocker,
};
//# sourceMappingURL=methods.js.map