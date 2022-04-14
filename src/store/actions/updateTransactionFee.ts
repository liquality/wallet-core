import { isObject } from 'lodash';
import { rootActionContext } from '..';
import { SwapHistoryItem } from '../types';
import { unlockAsset } from '../utils';

export const updateTransactionFee = async (context, { network, walletId, asset, id, hash, newFee }) => {
  const { dispatch, commit, getters } = rootActionContext(context);
  const item = getters.historyItemById(network, walletId, id);

  const hashKey = Object.keys(item).find((key) => item[key] === hash);

  const txKey = Object.keys(item).find((key) => isObject(item[key]) && item[key].hash === hash);

  if (!hashKey || !txKey) {
    throw new Error('Updating fee: Transaction not found');
  }

  const feeKey = {
    tx: 'fee',
    fromFundTx: 'fee',
    toClaimTx: 'claimFee',
    refundTx: 'fee',
  }[txKey] as string;

  const client = getters.client({
    network,
    walletId,
    asset,
    // @ts-ignore
    accountId: item.fromAccountId, // TODO: confirm if the from account should be used here
  });

  const oldTx = item[txKey];

  let newTx;
  const lock = await dispatch.getLockForAsset({
    item,
    network,
    walletId,
    asset,
  });
  try {
    newTx = await client.chain.updateTransactionFee(oldTx, newFee);
  } catch (e) {
    console.warn(e);
    throw e;
  } finally {
    unlockAsset(lock);
  }

  const updates = {
    [hashKey]: newTx.hash,
    [txKey]: newTx,
    [feeKey]: newTx.feePrice,
  };

  commit.UPDATE_HISTORY({
    network,
    walletId,
    id: id,
    updates,
  });

  const isFundingUpdate = hashKey === 'fromFundHash';
  if (isFundingUpdate) {
    // TODO: this should be the function of any swap? Should be able to bump any tx
    const swapProvider = getters.swapProvider(network, (item as SwapHistoryItem).provider);
    await swapProvider.updateOrder(item);
  }

  return newTx;
};
