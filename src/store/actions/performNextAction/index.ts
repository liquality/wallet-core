import { ActionContext, rootActionContext } from '../..';
import { createHistoryNotification } from '../../broker/notification';
import { BaseHistoryItem, Network, WalletId } from '../../types';
import { performNextTransactionAction } from './send';

export const performNextAction = async (
  context: ActionContext,
  { network, walletId, id }: { network: Network; walletId: WalletId; id: string }
): Promise<Partial<BaseHistoryItem> | undefined> => {
  const { dispatch, commit, getters } = rootActionContext(context);
  const item = getters.historyItemById(network, walletId, id);
  if (!item) return;
  if (!item.status) return;

  let updates;
  try {
    if (item.type === 'SWAP') {
      const swapProvider = getters.swapProvider(network, item.provider);

      // TODO: should it take typed context?
      updates = await swapProvider.performNextSwapAction(context, {
        network,
        walletId,
        swap: item,
      });
    }
    if (item.type === 'SEND') {
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
    });
    if (!updates.error) {
      dispatch.performNextAction({ network, walletId, id });
    }
  }

  return updates;
};
