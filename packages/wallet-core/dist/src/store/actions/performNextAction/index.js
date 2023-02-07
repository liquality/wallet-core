"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performNextAction = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("@liquality/error-parser/dist/src/utils");
const __1 = require("../..");
const swap_1 = require("../../../factory/swap");
const notification_1 = require("../../broker/notification");
const types_1 = require("../../types");
const send_1 = require("./send");
const sendNFT_1 = require("./sendNFT");
const performNextAction = (context, { network, walletId, id }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { dispatch, commit, getters } = (0, __1.rootActionContext)(context);
    const item = getters.historyItemById(network, walletId, id);
    if (!item)
        return;
    if (!item.status)
        return;
    let updates;
    try {
        if (item.type === types_1.TransactionType.Swap) {
            const swapProvider = (0, swap_1.getSwapProvider)(network, item.provider);
            updates = yield swapProvider.performNextSwapAction(context, {
                network,
                walletId,
                swap: item,
            });
        }
        if (item.type === types_1.TransactionType.Send) {
            updates = yield (0, send_1.performNextTransactionAction)(context, {
                network,
                walletId,
                transaction: item,
            });
        }
        if (item.type === types_1.TransactionType.NFT) {
            updates = yield (0, sendNFT_1.performNextNFTTransactionAction)(context, {
                network,
                walletId,
                transaction: item,
            });
        }
    }
    catch (e) {
        updates = { error: (0, utils_1.errorToLiqualityErrorString)(e) };
    }
    if (updates) {
        if (!updates.error) {
            updates.error = null;
        }
        commit.UPDATE_HISTORY({
            network,
            walletId,
            id,
            updates,
        });
        (0, notification_1.createHistoryNotification)(Object.assign(Object.assign({}, item), updates));
        if (!updates.error) {
            dispatch.performNextAction({ network, walletId, id });
        }
    }
    return updates;
});
exports.performNextAction = performNextAction;
//# sourceMappingURL=index.js.map