"use strict";
const tslib_1 = require("tslib");
const { slashLockerBurnRequests: slashLockerBurnRequestsDb, slashLockerBurnTxs: slashLockerBurnTxsDb, } = require('.');
function addBurnRequestForLocker(parsedEvent) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return slashLockerBurnRequestsDb.put(`${parsedEvent.lockerTargetAddress}:${parsedEvent.requestIndex}`, parsedEvent);
    });
}
function getCurrentBurnRequests(blockNumber) {
    var e_1, _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let burnRequests = [];
        try {
            for (var _b = tslib_1.__asyncValues(slashLockerBurnRequestsDb.values()), _c; _c = yield _b.next(), !_c.done;) {
                const value = _c.value;
                if (+blockNumber >= +value.deadline)
                    burnRequests.push(value);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return burnRequests;
    });
}
function getPassedDeadlineRequestsEvent(blockNumber) {
    var e_2, _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let events = [];
        try {
            for (var _b = tslib_1.__asyncValues(slashLockerBurnRequestsDb.values()), _c; _c = yield _b.next(), !_c.done;) {
                const value = _c.value;
                console.log(value);
                console.log('blockNumber', blockNumber);
                if (+value.deadline < +blockNumber)
                    events.push(value);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return events;
    });
}
function deleteBurnRequest(lockerTargetAddress, index) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return slashLockerBurnRequestsDb.del(`${lockerTargetAddress}:${index}`);
    });
}
function saveBurnTransactions(tx) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return slashLockerBurnTxsDb.put(tx.transaction.txId, tx);
    });
}
function getBurnTransactions(blockNumber, deadlinePlusOne) {
    var e_3, _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let txs = [];
        console.log('blockNumber, deadlinePlusOne', blockNumber, deadlinePlusOne);
        try {
            for (var _b = tslib_1.__asyncValues(slashLockerBurnTxsDb.values()), _c; _c = yield _b.next(), !_c.done;) {
                const tx = _c.value;
                console.log('databaseTx', {
                    txId: tx.transaction.txId,
                    blockNumber: +tx.transaction.blockNumber,
                    confirmations: +blockNumber - +tx.transaction.blockNumber,
                    requiredBlock: +deadlinePlusOne - (+blockNumber - +tx.transaction.blockNumber),
                });
                if (+blockNumber - +tx.transaction.blockNumber >= +deadlinePlusOne)
                    txs.push(tx);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return txs;
    });
}
function deleteBurnTransaction(txId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return slashLockerBurnTxsDb.del(txId);
    });
}
module.exports = {
    addBurnRequestForLocker,
    getPassedDeadlineRequestsEvent,
    getCurrentBurnRequests,
    deleteBurnRequest,
    saveBurnTransactions,
    getBurnTransactions,
    deleteBurnTransaction,
};
//# sourceMappingURL=slash-locker.js.map