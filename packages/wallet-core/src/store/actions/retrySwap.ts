import { ActionContext, rootActionContext } from '..';
import { SwapHistoryItem } from '../types';

export const retrySwap = async (
  context: ActionContext,
  { swap }: { swap: SwapHistoryItem }
): Promise<Partial<SwapHistoryItem> | undefined> => {
  const { commit, dispatch } = rootActionContext(context);
  commit.UPDATE_HISTORY({
    network: swap.network,
    walletId: swap.walletId,
    id: swap.id,
    updates: {
      error: undefined,
    },
  });

  return (await dispatch.performNextAction({
    network: swap.network,
    walletId: swap.walletId,
    id: swap.id,
  })) as SwapHistoryItem;
};
