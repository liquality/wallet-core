import { EthereumRpcProvider } from '@liquality/ethereum-rpc-provider';
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

  const originalEstimateGas = (client._providers[0] as EthereumRpcProvider).estimateGas;
  if (gas) {
    (client._providers[0] as EthereumRpcProvider).estimateGas = async () => {
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
    (client._providers[0] as EthereumRpcProvider).estimateGas = originalEstimateGas;
  }

  const transaction: SendHistoryItem = {
    id: uuidv4(),
    type: TransactionType.Send,
    network,
    walletId,
    to: asset,
    from: asset,
    toAddress: to,
    amount: new BN(amount).toFixed(),
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
