"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionFee = void 0;
const tslib_1 = require("tslib");
const error_parser_1 = require("@liquality/error-parser");
const lodash_1 = require("lodash");
const __1 = require("..");
const swap_1 = require("../../factory/swap");
const types_1 = require("../types");
const utils_1 = require("../utils");
const updateTransactionFee = (context, { network, walletId, asset, id, hash, newFee, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { dispatch, commit, getters } = (0, __1.rootActionContext)(context);
    const item = getters.historyItemById(network, walletId, id);
    if (!item) {
        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.History.Item);
    }
    const hashKey = Object.keys(item).find((key) => item[key] === hash);
    const txKey = Object.keys(item).find((key) => (0, lodash_1.isObject)(item[key]) && item[key].hash === hash);
    if (!hashKey || !txKey) {
        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.History.Transaction);
    }
    const feeKey = {
        tx: 'fee',
        fromFundTx: 'fee',
        toClaimTx: 'claimFee',
        refundTx: 'fee',
    }[txKey];
    const accountId = item.type === types_1.TransactionType.Swap ? item.fromAccountId : item.accountId;
    const account = getters.accountItem(accountId);
    const client = getters.client({
        network,
        walletId,
        chainId: account.chain,
        accountId,
    });
    const oldTx = item[txKey];
    let newTx;
    const lock = yield dispatch.getLockForAsset({
        item,
        network,
        walletId,
        asset,
    });
    try {
        if (client.swap.canUpdateFee()) {
            newTx = yield client.swap.updateTransactionFee(oldTx, newFee);
        }
        else {
            newTx = yield client.wallet.updateTransactionFee(oldTx, newFee);
        }
    }
    catch (e) {
        console.warn(e);
        throw e;
    }
    finally {
        (0, utils_1.unlockAsset)(lock);
    }
    const updates = {
        [hashKey]: newTx.hash,
        [txKey]: newTx,
        [feeKey]: newTx.feePrice,
    };
    commit.UPDATE_HISTORY({
        network,
        walletId,
        id: id,
        updates,
    });
    const isFundingUpdate = hashKey === 'fromFundHash';
    if (isFundingUpdate) {
        if (item.type !== types_1.TransactionType.Swap) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Invalid.Default);
        }
        const swapProvider = (0, swap_1.getSwapProvider)(network, item.provider);
        yield swapProvider.updateOrder(item);
    }
    return newTx;
});
exports.updateTransactionFee = updateTransactionFee;
//# sourceMappingURL=updateTransactionFee.js.map