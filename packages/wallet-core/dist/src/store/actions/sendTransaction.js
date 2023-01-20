"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransaction = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const uuid_1 = require("uuid");
const __1 = require("..");
const chainify_1 = require("../../utils/chainify");
const notification_1 = require("../broker/notification");
const types_1 = require("../types");
const sendTransaction = (context, { network, walletId, accountId, asset, to, amount, data, fee, feeAsset, gas, feeLabel, fiatRate, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { dispatch, commit, getters } = (0, __1.rootActionContext)(context);
    const chainId = getters.cryptoassets[asset].chain;
    const client = getters.client({ network, walletId, chainId, accountId });
    const _asset = (0, chainify_1.assetsAdapter)(asset)[0];
    const _feeAsset = (0, chainify_1.assetsAdapter)(feeAsset)[0] || _asset;
    const tx = yield client.wallet.sendTransaction({
        to: (0, cryptoassets_1.getChain)(network, chainId).formatAddress(to),
        value: new bignumber_js_1.default(amount),
        data,
        gasLimit: gas,
        fee,
        asset: _asset,
        feeAsset: _feeAsset,
    });
    const transaction = {
        id: (0, uuid_1.v4)(),
        type: types_1.TransactionType.Send,
        network,
        walletId,
        to: asset,
        from: asset,
        toAddress: to,
        amount: new bignumber_js_1.default(amount).toFixed(),
        fee,
        tx,
        txHash: tx.hash,
        startTime: Date.now(),
        status: types_1.SendStatus.WAITING_FOR_CONFIRMATIONS,
        accountId,
        feeLabel,
        fiatRate,
    };
    commit.NEW_TRASACTION({ network, walletId, transaction });
    dispatch.performNextAction({ network, walletId, id: transaction.id });
    (0, notification_1.createHistoryNotification)(transaction);
    return transaction;
});
exports.sendTransaction = sendTransaction;
//# sourceMappingURL=sendTransaction.js.map