import { Transaction } from '@chainify/types';
import { ChainifyErrorParser, CUSTOM_ERRORS, getErrorParser, wrapCustomError } from '@liquality/error-parser';
import { isObject } from 'lodash';
import { ActionContext, rootActionContext } from '..';
import { getSwapProvider } from '../../factory/swap';
import { LiqualitySwapHistoryItem, LiqualitySwapProvider } from '../../swaps/liquality/LiqualitySwapProvider';
import { Asset, HistoryItem, Network, TransactionType, WalletId } from '../types';
import { unlockAsset } from '../utils';

export const updateTransactionFee = async (
  context: ActionContext,
  {
    network,
    walletId,
    asset,
    id,
    hash,
    newFee,
  }: { network: Network; walletId: WalletId; asset: Asset; id: string; hash: string; newFee: number }
): Promise<Transaction> => {
  const { dispatch, commit, getters } = rootActionContext(context);
  const item = getters.historyItemById(network, walletId, id);

  if (!item) {
    throw wrapCustomError(CUSTOM_ERRORS.NotFound.History.Item);
  }

  const hashKey = Object.keys(item).find((key: keyof HistoryItem) => item[key] === hash);

  // @ts-ignore TODO: this needs refactoring to be more typescripty
  const txKey = Object.keys(item).find((key: keyof HistoryItem) => isObject(item[key]) && item[key].hash === hash);

  if (!hashKey || !txKey) {
    throw wrapCustomError(CUSTOM_ERRORS.NotFound.History.Transaction);
  }

  const feeKey = {
    tx: 'fee',
    fromFundTx: 'fee',
    toClaimTx: 'claimFee',
    refundTx: 'fee',
  }[txKey] as string;

  const accountId = item.type === TransactionType.Swap ? item.fromAccountId : item.accountId;
  const account = getters.accountItem(accountId)!;

  const client = getters.client({
    network,
    walletId,
    chainId: account.chain,
    accountId,
  });

  const oldTx = (item as any)[txKey] as Transaction | string;

  let newTx;
  const lock = await dispatch.getLockForAsset({
    item,
    network,
    walletId,
    asset,
  });
  try {
    const parser = getErrorParser(ChainifyErrorParser);
    if (client.swap.canUpdateFee()) {
      newTx = (await parser.wrapAsync(async () => await client.swap.updateTransactionFee(oldTx, newFee), null)) as any;
    } else {
      newTx = (await parser.wrapAsync(
        async () => await client.wallet.updateTransactionFee(oldTx, newFee),
        null
      )) as any;
    }
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
    if (item.type !== TransactionType.Swap) {
      throw wrapCustomError(CUSTOM_ERRORS.Invalid.Default);
    }
    // TODO: this should be the function of any swap? Should be able to bump any tx
    const swapProvider = getSwapProvider(network, item.provider) as LiqualitySwapProvider;
    await swapProvider.updateOrder(item as LiqualitySwapHistoryItem);
  }

  return newTx;
};
