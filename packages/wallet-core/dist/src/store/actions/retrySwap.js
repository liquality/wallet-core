"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrySwap = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const retrySwap = (context, { swap }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit, dispatch } = (0, __1.rootActionContext)(context);
    commit.UPDATE_HISTORY({
        network: swap.network,
        walletId: swap.walletId,
        id: swap.id,
        updates: {
            error: undefined,
        },
    });
    return (yield dispatch.performNextAction({
        network: swap.network,
        walletId: swap.walletId,
        id: swap.id,
    }));
});
exports.retrySwap = retrySwap;
//# sourceMappingURL=retrySwap.js.map