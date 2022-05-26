import { v4 as uuidv4 } from 'uuid';
import { ActionContext, rootActionContext } from '..';
import { createHistoryNotification } from '../broker/notification';
import {
  AccountId,
  FeeLabel,
  Network,
  NFTAsset,
  NFTSendHistoryItem,
  SendStatus,
  TransactionType,
  WalletId,
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
  }: {
    network: Network;
    accountId: AccountId;
    walletId: WalletId;
    receiver: string;
    values: number[];
    fee: number;
    feeLabel: FeeLabel;
    nft: NFTAsset;
  }
): Promise<any> => {
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
    to: asset,
    from: asset,
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
  console.log('🚀 ~ file: sendNFTTransaction.ts ~ line 64 ~ transaction', transaction);

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
