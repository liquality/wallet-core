"use strict";
const tslib_1 = require("tslib");
const lockerDb = require('.');
function setLastCheckedBitcoinBlock(blockNumber) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return lockerDb.general.put('lastCheckedBitcoinBlock', blockNumber);
    });
}
function getLastCheckedBitcoinBlock() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let blockNumber = yield lockerDb.general.get('lastCheckedBitcoinBlock').catch((err) => {
            if (err.notFound)
                return null;
            throw err;
        });
        return blockNumber || 0;
    });
}
function setLastCheckedEthBlock(blockNumber) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return lockerDb.general.put('lastCheckedEthBlock', blockNumber);
    });
}
function getLastCheckedEthBlock() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let blockNumber = yield lockerDb.general.get('lastCheckedEthBlock').catch((err) => {
            if (err.notFound)
                return null;
            throw err;
        });
        return blockNumber || 0;
    });
}
function addBurnRequestToQueue(parsedEvent) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return lockerDb.requestQueue.put(parsedEvent.requestIndex, parsedEvent);
    });
}
function removeInvalidRequestFromQueue(requestIndex) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return lockerDb.requestQueue.del(requestIndex);
    });
}
function deleteRequestAndAddPendingTxId(txId, requests) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let response = yield lockerDb.pendingRequest.put(txId, requests);
        for (let rs of requests) {
            yield lockerDb.requestQueue.del(rs.requestIndex);
        }
        return response;
    });
}
function deletePendingTxAndUpdateLastTx(txInfo) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        lockerDb.pendingRequest.del(txInfo.txId);
    });
}
function getNotProcessedRequests(limit = -1) {
    var e_1, _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let newRequests = [];
        try {
            for (var _b = tslib_1.__asyncValues(lockerDb.requestQueue.iterator({
                limit,
            })), _c; _c = yield _b.next(), !_c.done;) {
                const [_key, value] = _c.value;
                newRequests.push(value);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return newRequests;
    });
}
function getPendingRequestsIndex() {
    var e_2, _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let pendingIndex = [];
        try {
            for (var _b = tslib_1.__asyncValues(lockerDb.pendingRequest.iterator()), _c; _c = yield _b.next(), !_c.done;) {
                const [_key, value] = _c.value;
                pendingIndex.push(...value.map((v) => v.requestIndex));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return pendingIndex;
    });
}
function getPendingTransactions() {
    var e_3, _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let pendingRequests = [];
        try {
            for (var _b = tslib_1.__asyncValues(lockerDb.pendingRequest.iterator()), _c; _c = yield _b.next(), !_c.done;) {
                const [key, _value] = _c.value;
                pendingRequests.push({
                    txId: key,
                    requests: _value,
                });
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return pendingRequests;
    });
}
module.exports = {
    setLastCheckedBitcoinBlock,
    getLastCheckedBitcoinBlock,
    setLastCheckedEthBlock,
    getLastCheckedEthBlock,
    addBurnRequestToQueue,
    removeInvalidRequestFromQueue,
    getNotProcessedRequests,
    deleteRequestAndAddPendingTxId,
    deletePendingTxAndUpdateLastTx,
    getPendingRequestsIndex,
    getPendingTransactions,
};
//# sourceMappingURL=methods.js.map