"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLockForAsset = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const utils_1 = require("../utils");
const getLockForAsset = (context, { network, walletId, asset, item }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { dispatch, commit } = (0, __1.rootActionContext)(context);
    const { key, success } = (0, utils_1.attemptToLockAsset)(network, walletId, asset);
    if (!success) {
        commit.UPDATE_HISTORY({
            network,
            walletId,
            id: item.id,
            updates: {
                waitingForLock: true,
            },
        });
        yield new Promise((resolve) => utils_1.emitter.once(`unlock:${key}`, () => resolve(null)));
        return dispatch.getLockForAsset({ network, walletId, asset, item });
    }
    commit.UPDATE_HISTORY({
        network,
        walletId,
        id: item.id,
        updates: {
            waitingForLock: false,
        },
    });
    yield (0, utils_1.waitForRandom)(3000, 5000);
    return key;
});
exports.getLockForAsset = getLockForAsset;
//# sourceMappingURL=getLockForAsset.js.map