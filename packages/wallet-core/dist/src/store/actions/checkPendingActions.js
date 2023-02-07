"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPendingActions = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const networks_1 = require("../../utils/networks");
const COMPLETED_STATES = ['SUCCESS', 'REFUNDED'];
const checkPendingActions = (context, { walletId }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { state, dispatch } = (0, __1.rootActionContext)(context);
    networks_1.Networks.forEach((network) => {
        var _a;
        const history = (_a = state.history[network]) === null || _a === void 0 ? void 0 : _a[walletId];
        if (!history)
            return;
        history.forEach((item) => {
            if (item.error)
                return;
            if (!COMPLETED_STATES.includes(item.status)) {
                dispatch.performNextAction({ network, walletId, id: item.id });
            }
        });
    });
});
exports.checkPendingActions = checkPendingActions;
//# sourceMappingURL=checkPendingActions.js.map