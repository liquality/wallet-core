"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetDappConnections = void 0;
const __1 = require("..");
const forgetDappConnections = (context) => {
    const { commit, state } = (0, __1.rootActionContext)(context);
    const { activeWalletId } = state;
    commit.REMOVE_EXTERNAL_CONNECTIONS({ activeWalletId });
};
exports.forgetDappConnections = forgetDappConnections;
//# sourceMappingURL=forgetDappConnections.js.map