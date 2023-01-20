"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addExternalConnection = void 0;
const __1 = require("..");
const addExternalConnection = (context, { origin, chain, accountId, setDefaultEthereum, }) => {
    const { state, commit } = (0, __1.rootActionContext)(context);
    const { activeWalletId } = state;
    commit.ADD_EXTERNAL_CONNECTION({ origin, activeWalletId, accountId, chain });
    if (setDefaultEthereum)
        commit.SET_EXTERNAL_CONNECTION_DEFAULT({ origin, activeWalletId, accountId });
};
exports.addExternalConnection = addExternalConnection;
//# sourceMappingURL=addExternalConnection.js.map