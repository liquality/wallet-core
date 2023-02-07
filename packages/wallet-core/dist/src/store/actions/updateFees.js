"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFees = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const updateFees = (context, { asset }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit, getters, state } = (0, __1.rootActionContext)(context);
    const network = state.activeNetwork;
    const walletId = state.activeWalletId;
    const chainId = getters.cryptoassets[asset].chain;
    const fees = yield getters.client({ network, walletId, chainId }).chain.getFees();
    commit.UPDATE_FEES({ network, walletId, asset, fees });
    return fees;
});
exports.updateFees = updateFees;
//# sourceMappingURL=updateFees.js.map