"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withInterval = exports.withLock = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const utils_1 = require("../../utils");
function withLock({ dispatch }, { item, network, walletId, asset }, func) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const lock = yield dispatch('getLockForAsset', {
            item,
            network,
            walletId,
            asset,
        });
        try {
            return yield func();
        }
        finally {
            (0, utils_1.unlockAsset)(lock);
        }
    });
}
exports.withLock = withLock;
function withInterval(func) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const updates = yield func();
        if (updates) {
            return updates;
        }
        return new Promise((resolve) => {
            const interval = setInterval(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const updates = yield func();
                if (updates) {
                    clearInterval(interval);
                    resolve(updates);
                }
            }), (0, lodash_1.random)(15000, 30000));
        });
    });
}
exports.withInterval = withInterval;
//# sourceMappingURL=utils.js.map