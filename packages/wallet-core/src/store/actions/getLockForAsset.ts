import { ActionContext, rootActionContext } from '..';
import { Asset, BaseHistoryItem, Network, WalletId } from '../types';
import { attemptToLockAsset, emitter, waitForRandom } from '../utils';

export const getLockForAsset = async (
  context: ActionContext,
  { network, walletId, asset, item }: { network: Network; walletId: WalletId; asset: Asset; item: BaseHistoryItem }
): Promise<string> => {
  const { dispatch, commit } = rootActionContext(context);
  const { key, success } = attemptToLockAsset(network, walletId, asset);

  if (!success) {
    commit.UPDATE_HISTORY({
      network,
      walletId,
      id: item.id,
      updates: {
        waitingForLock: true,
      },
    });

    await new Promise((resolve) => emitter.once(`unlock:${key}`, () => resolve(null)));

    return dispatch.getLockForAsset({ network, walletId, asset, item });
  }

  commit.UPDATE_HISTORY({
    network,
    walletId,
    id: item.id,
    updates: {
      waitingForLock: false,
    },
  });

  await waitForRandom(3000, 5000);

  return key;
};
