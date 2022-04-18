import { ActionContext, rootActionContext } from '../..';
import { Network, SendHistoryItem, WalletId } from '../../types';
import { withInterval } from './utils';

async function waitForConfirmations(
  context: ActionContext,
  { transaction, network, walletId }: { transaction: SendHistoryItem; network: Network; walletId: WalletId }
) {
  const { getters, dispatch } = rootActionContext(context);
  const client = getters.client({
    network,
    walletId,
    asset: transaction.from,
    accountId: transaction.accountId,
  });
  try {
    const tx = await client.chain.getTransactionByHash(transaction.txHash);
    if (tx && tx.confirmations && tx.confirmations > 0) {
      dispatch.updateBalances({
        network,
        walletId,
        assets: [transaction.from],
      });

      return {
        endTime: Date.now(),
        status: tx.status,
      };
    }
  } catch (e) {
    if (e.name === 'TxNotFoundError') console.warn(e);
    else throw e;
  }
}

export const performNextTransactionAction = async (
  context: ActionContext,
  { network, walletId, transaction }: { network: Network; walletId: WalletId; transaction: SendHistoryItem }
) => {
  let updates;

  if (transaction.status === 'WAITING_FOR_CONFIRMATIONS') {
    updates = await withInterval(async () => waitForConfirmations(context, { transaction, network, walletId }));
  }

  return updates;
};
