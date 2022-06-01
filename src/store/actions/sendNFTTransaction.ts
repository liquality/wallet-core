import { v4 as uuidv4 } from 'uuid';
import { ActionContext, rootActionContext } from '..';
import { createHistoryNotification } from '../broker/notification';
import { Transaction } from '@liquality/types';
import {
  NFTSendHistoryItem,
  NFTSendTransactionParams,
  SendStatus,
  TransactionType,
} from '../types';

export const sendNFTTransaction = async (
  context: ActionContext,
  {
    network,
    accountId,
    walletId,
    receiver,
    values,
    fee,
    feeLabel,
    nft,
  }: NFTSendTransactionParams
): Promise<Transaction> => {
  const asset = 'ETH';
  const { getters, commit, dispatch } = rootActionContext(context);
  const client = getters.client({
    network,
    walletId,
    asset,
  });
  const tx = await client.nft.transfer(nft.asset_contract.address, receiver, [nft.token_id], values);

  const transaction: NFTSendHistoryItem = {
    id: uuidv4(),
    type: TransactionType.NFT,
    network,
    walletId,
    toAddress: receiver,
    fee,
    tx,
    nft,
    txHash: tx.hash,
    startTime: Date.now(),
    status: SendStatus.WAITING_FOR_CONFIRMATIONS,
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

  createHistoryNotification(transaction);

  return tx;
};
