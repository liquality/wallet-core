"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performNextNFTTransactionAction = void 0;
const tslib_1 = require("tslib");
const types_1 = require("@chainify/types");
const isTransactionNotFoundError_1 = require("../../../utils/isTransactionNotFoundError");
const __1 = require("../..");
const types_2 = require("../../types");
const utils_1 = require("./utils");
function txStatusToSendStatus(txStatus) {
    switch (txStatus) {
        case types_1.TxStatus.Success:
            return types_2.SendStatus.SUCCESS;
        case types_1.TxStatus.Failed:
            return types_2.SendStatus.FAILED;
        case types_1.TxStatus.Pending:
            return types_2.SendStatus.WAITING_FOR_CONFIRMATIONS;
    }
}
function waitForConfirmations(context, { transaction, network, walletId }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { getters, dispatch } = (0, __1.rootActionContext)(context);
        const { from, accountId } = transaction;
        const chainId = getters.cryptoassets[from].chain;
        const client = getters.client({ network, walletId, chainId, accountId });
        try {
            const tx = yield client.chain.getTransactionByHash(transaction.txHash);
            if (tx && tx.confirmations && tx.confirmations > 0) {
                yield dispatch.updateNFTs({ network, walletId, accountIds: [transaction.accountId] });
                return {
                    endTime: Date.now(),
                    status: txStatusToSendStatus(tx.status),
                };
            }
        }
        catch (e) {
            if ((0, isTransactionNotFoundError_1.isTransactionNotFoundError)(e))
                console.warn(e);
            else
                throw e;
        }
    });
}
const performNextNFTTransactionAction = (context, { network, walletId, transaction }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (transaction.status === types_2.SendStatus.WAITING_FOR_CONFIRMATIONS) {
        return (0, utils_1.withInterval)(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return waitForConfirmations(context, { transaction, network, walletId }); }));
    }
});
exports.performNextNFTTransactionAction = performNextNFTTransactionAction;
//# sourceMappingURL=sendNFT.js.map