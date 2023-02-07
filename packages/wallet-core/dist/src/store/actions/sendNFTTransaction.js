"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNFTTransaction = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const uuid_1 = require("uuid");
const __1 = require("..");
const notification_1 = require("../broker/notification");
const types_1 = require("../types");
const sendNFTTransaction = (context, { network, accountId, walletId, receiver, values, fee, feeLabel, nft }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { getters, commit, dispatch } = (0, __1.rootActionContext)(context);
    const account = getters.accountItem(accountId);
    const asset = (0, cryptoassets_1.getChain)(network, account.chain).nativeAsset[0].code;
    const client = getters.client({ network, walletId, chainId: account.chain, accountId });
    const tx = yield client.nft.transfer(nft.asset_contract.address, receiver, [nft.token_id], values);
    const transaction = {
        id: (0, uuid_1.v4)(),
        type: types_1.TransactionType.NFT,
        network,
        walletId,
        to: asset,
        from: asset,
        toAddress: receiver,
        fee,
        tx,
        nft,
        txHash: tx.hash,
        startTime: Date.now(),
        status: types_1.SendStatus.WAITING_FOR_CONFIRMATIONS,
        accountId,
        feeLabel,
    };
    commit.NEW_NFT_TRASACTION({
        network,
        walletId,
        transaction,
    });
    dispatch.performNextAction({
        network,
        walletId,
        id: transaction.id,
    });
    (0, notification_1.createHistoryNotification)(transaction);
    return tx;
});
exports.sendNFTTransaction = sendNFTTransaction;
//# sourceMappingURL=sendNFTTransaction.js.map