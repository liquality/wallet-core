"use strict";
const tslib_1 = require("tslib");
const slashUserDb = require('.').slashUser;
function getUserNearestDeadline(userAddress) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return slashUserDb.get(userAddress).catch((err) => {
            if (err.notFound)
                return null;
            throw err;
        });
    });
}
function getUsersWithPassedDeadline(blockNumber) {
    var e_1, _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let users = [];
        try {
            for (var _b = tslib_1.__asyncValues(slashUserDb.iterator()), _c; _c = yield _b.next(), !_c.done;) {
                const [key, value] = _c.value;
                if (+value <= +blockNumber)
                    users.push(key);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return users;
    });
}
function deleteUser(user) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return slashUserDb.del(user);
    });
}
function setOrUpdateUserDeadline(user, deadline) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return slashUserDb.put(user, deadline);
    });
}
function checkCurrentDeadlineAndUpdateNearestDeadline(user, deadline) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let currentDeadline = yield getUserNearestDeadline(user);
        if (+deadline < +currentDeadline)
            return slashUserDb.put(user, deadline);
        return null;
    });
}
module.exports = {
    getUserNearestDeadline,
    getUsersWithPassedDeadline,
    deleteUser,
    setOrUpdateUserDeadline,
    checkCurrentDeadlineAndUpdateNearestDeadline,
};
//# sourceMappingURL=slash-user.js.map