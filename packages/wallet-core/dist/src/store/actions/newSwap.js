"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newSwap = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const swap_1 = require("../../factory/swap");
const types_1 = require("../types");
const newSwap = (context, { network, walletId, quote, fee, claimFee, feeLabel, claimFeeLabel, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit, dispatch } = (0, __1.rootActionContext)(context);
    const swap = Object.assign(Object.assign({}, quote), { type: types_1.TransactionType.Swap, network, startTime: Date.now(), walletId,
        claimFee,
        fee });
    const swapProvider = (0, swap_1.getSwapProvider)(network, swap.provider);
    const initiationParams = yield swapProvider.newSwap({
        network,
        walletId,
        quote: swap,
    });
    const createdSwap = Object.assign(Object.assign(Object.assign({}, swap), initiationParams), { feeLabel,
        claimFeeLabel });
    commit.NEW_SWAP({
        network,
        walletId,
        swap: createdSwap,
    });
    dispatch.performNextAction({
        network,
        walletId,
        id: createdSwap.id,
    });
    return createdSwap;
});
exports.newSwap = newSwap;
//# sourceMappingURL=newSwap.js.map