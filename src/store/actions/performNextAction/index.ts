import { ActionContext, rootActionContext } from '../..';
import { getSwapProvider } from '../../../factory/swap';
import { createHistoryNotification } from '../../broker/notification';
import { HistoryItem, Network, TransactionType, WalletId } from '../../types';
import { performNextTransactionAction } from './send';

export const performNextAction = async (
  context: ActionContext,
  { network, walletId, id }: { network: Network; walletId: WalletId; id: string }
): Promise<Partial<HistoryItem> | undefined> => {
  const { dispatch, commit, getters } = rootActionContext(context);
  const item = getters.historyItemById(network, walletId, id);
  if (!item) return;
  if (!item.status) return;

  let updates;
  try {
    if (item.type === TransactionType.Swap) {
      const swapProvider = getSwapProvider(network, item.provider);

      // TODO: should it take typed context?
      updates = await swapProvider.performNextSwapAction(context, {
        network,
        walletId,
        swap: item,
      });
    }
    if (item.type === TransactionType.Send) {
      updates = await performNextTransactionAction(context, {
        network,
        walletId,
        transaction: item,
      });
    }
  } catch (e) {
    updates = { error: e.toString() };
  }
  if (updates) {
    commit.UPDATE_HISTORY({
      network,
      walletId,
      id,
      updates,
    });

    createHistoryNotification({
      ...item,
      ...updates,
    } as HistoryItem);
    if (!updates.error) {
      dispatch.performNextAction({ network, walletId, id });
    }
  }

  return updates;
};
