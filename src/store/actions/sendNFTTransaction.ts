import { Address } from '@liquality/types';
import BN from 'bignumber.js';
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
    contract,
    receiver,
    tokenIDs,
    values,
    fee,
    feeLabel,
    fiatRate,
    nft,
  }: // data,
  {
    network: Network;
    accountId: AccountId;
    walletId: WalletId;
    contract: Address | string;
    receiver: string;
    tokenIDs: number[];
    values: number[];
    fee: number;
    feeLabel: FeeLabel;
    fiatRate: number;
    nft: NFTAsset;
    // data: string;
  }
): Promise<any> => {
  const asset = 'ETH';
  const { getters, commit, dispatch } = rootActionContext(context);
  const client = getters.client({
    network,
    walletId,
    asset,
  });
  const tx = await client.nft.transfer(contract, receiver, tokenIDs, values);

  const transaction: NFTSendHistoryItem = {
    id: uuidv4(),
    type: TransactionType.NFT,
    network,
    walletId,
    to: asset,
    from: asset,
    toAddress: receiver,
    amount: new BN(0).toFixed(),
    fee,
    tx,
    nft,
    txHash: tx.hash,
    startTime: Date.now(),
    status: SendStatus.WAITING_FOR_CONFIRMATIONS,
    accountId,
    feeLabel,
    fiatRate,
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
