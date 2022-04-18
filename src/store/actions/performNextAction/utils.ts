import { random } from 'lodash';
import { ActionContext } from '../..';
import { Asset, HistoryItem, Network, WalletId } from '../../types';
import { unlockAsset } from '../../utils';

type HistoryUpdateFunction = () => Promise<Partial<HistoryItem> | undefined>;

export async function withLock(
  { dispatch }: ActionContext,
  { item, network, walletId, asset }: { item: HistoryItem; network: Network; walletId: WalletId; asset: Asset },
  func: () => Promise<Partial<HistoryItem>>
) {
  const lock = await dispatch('getLockForAsset', {
    item,
    network,
    walletId,
    asset,
  });
  try {
    return await func();
  } finally {
    unlockAsset(lock);
  }
}

export async function withInterval(func: HistoryUpdateFunction) {
  const updates = await func();
  if (updates) {
    return updates;
  }
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const updates = await func();
      if (updates) {
        clearInterval(interval);
        resolve(updates);
      }
    }, random(15000, 30000));
  });
}
