import { Transaction } from '@liquality/types';
import BN, { BigNumber } from 'bignumber.js';
import { v4 as uuidv4 } from 'uuid';
import { ActionContext, rootActionContext } from '..';
import { createHistoryNotification } from '../broker/notification';
import { AccountId, Asset, FeeLabel, Network, SendHistoryItem, SendStatus, TransactionType, WalletId } from '../types';

export const sendTransaction = async (
  context: ActionContext,
  {
    network,
    walletId,
    accountId,
    asset,
    to,
    amount,
    data,
    fee,
    gas,
    feeLabel,
    fiatRate,
  }: {
    network: Network;
    walletId: WalletId;
    accountId: AccountId;
    asset: Asset;
    to: Asset;
    amount: BigNumber;
    data: string;
    fee: number;
    gas: number;
    feeLabel: FeeLabel;
    fiatRate: number;
  }
): Promise<Transaction> => {
  const { dispatch, commit, getters } = rootActionContext(context);
  const client = getters.client({
    network,
    walletId,
    asset,
    accountId,
  });

  // @ts-ignore
  const originalEstimateGas = client._providers[0].estimateGas;
  if (gas) {
    // @ts-ignore
    client._providers[0].estimateGas = async () => {
      return gas;
    };
  }

  let tx;
  try {
    tx = await client.chain.sendTransaction({
      to,
      value: new BN(amount),
      data,
      fee,
    });
  } finally {
    // @ts-ignore
    client._providers[0].estimateGas = originalEstimateGas;
  }

  const transaction: SendHistoryItem = {
    id: uuidv4(),
    type: TransactionType.Send,
    network,
    walletId,
    to: asset,
    from: asset,
    toAddress: to,
    amount: new BN(amount).toNumber(),
    fee,
    tx,
    txHash: tx.hash,
    startTime: Date.now(),
    status: SendStatus.WAITING_FOR_CONFIRMATIONS,
    accountId,
    feeLabel,
    fiatRate,
  };

  commit.NEW_TRASACTION({
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
