import BN from 'bignumber.js';
import { v4 as uuidv4 } from 'uuid';
import { ActionContext, rootActionContext } from '..';
import { getEarnProvider } from '../../factory/earnProvider';
import { AccountId, FeeLabel, Network, SendHistoryItem, SendStatus, TransactionType, WalletId } from '../types';

export const getApy = async (
  context: ActionContext,
  { network, asset }: { network: Network; asset: string }
): Promise<string> => {
  const earnProvider = getEarnProvider(network, asset);

  return earnProvider.getApy();
};

export const getDepositedAmount = async (
  context: ActionContext,
  { network, asset }: { network: Network; asset: string }
): Promise<number> => {
  const earnProvider = getEarnProvider(network, asset);

  return earnProvider.getDepositedAmount();
};

export const makeDeposit = async (
  context: ActionContext,
  {
    network,
    walletId,
    accountId,
    asset,
    amount,
    fee,
    feeLabel,
    fiatRate,
  }: {
    network: Network;
    walletId: WalletId;
    accountId: AccountId;
    asset: string;
    amount: string;
    fee: number;
    feeLabel: FeeLabel;
    fiatRate: number;
  }
): Promise<string> => {
  const { dispatch, commit, getters } = rootActionContext(context);
  const client = getters.client({
    network,
    walletId,
    asset,
    accountId,
  });
  const earnProvider = getEarnProvider(network, asset);

  const transaction = await earnProvider.withdraw(amount);

  const parsedTransaction = await client.chain.getTransactionByHash(transaction.hash);

  const historyItem: SendHistoryItem = {
    id: uuidv4(),
    type: TransactionType.Send,
    network,
    walletId,
    to: asset,
    from: asset,
    toAddress: 'test', // TODO: add recipient address
    amount: new BN(amount).toFixed(),
    fee,
    tx: transaction,
    txHash: parsedTransaction.hash,
    startTime: Date.now(),
    status: SendStatus.WAITING_FOR_CONFIRMATIONS,
    accountId,
    feeLabel,
    fiatRate,
  };

  commit.NEW_TRASACTION({
    network,
    walletId,
    transaction: historyItem,
  });

  dispatch.performNextAction({
    network,
    walletId,
    id: historyItem.id,
  });

  return transaction;
};

export const makeWithdraw = async (
  context: ActionContext,
  {
    network,
    walletId,
    accountId,
    asset,
    amount,
    fee,
    feeLabel,
    fiatRate,
  }: {
    network: Network;
    walletId: WalletId;
    accountId: AccountId;
    asset: string;
    amount: string;
    fee: number;
    feeLabel: FeeLabel;
    fiatRate: number;
  }
): Promise<string> => {
  const { dispatch, commit, getters } = rootActionContext(context);
  const client = getters.client({
    network,
    walletId,
    asset,
    accountId,
  });
  const earnProvider = getEarnProvider(network, asset);

  const transaction = await earnProvider.withdraw(amount);

  const parsedTransaction = await client.chain.getTransactionByHash(transaction.hash);

  const historyItem: SendHistoryItem = {
    id: uuidv4(),
    type: TransactionType.Send,
    network,
    walletId,
    to: asset,
    from: asset,
    toAddress: 'test', // TODO: add recipient address
    amount: new BN(amount).toFixed(),
    fee,
    tx: transaction,
    txHash: parsedTransaction.hash,
    startTime: Date.now(),
    status: SendStatus.WAITING_FOR_CONFIRMATIONS,
    accountId,
    feeLabel,
    fiatRate,
  };

  commit.NEW_TRASACTION({
    network,
    walletId,
    transaction: historyItem,
  });

  dispatch.performNextAction({
    network,
    walletId,
    id: historyItem.id,
  });

  return transaction;
};
