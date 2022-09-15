import { TxStatus } from '@chainify/types';
import { getAsset } from '@liquality/cryptoassets';
import { ActionContext, rootActionContext } from '../..';
import { Network, NFTSendHistoryItem, SendStatus, WalletId } from '../../types';
import { withInterval } from './utils';

function txStatusToSendStatus(txStatus: TxStatus) {
  switch (txStatus) {
    case TxStatus.Success:
      return SendStatus.SUCCESS;
    case TxStatus.Failed:
      return SendStatus.FAILED;
    case TxStatus.Pending:
      return SendStatus.WAITING_FOR_CONFIRMATIONS;
  }
}

async function waitForConfirmations(
  context: ActionContext,
  { transaction, network, walletId }: { transaction: NFTSendHistoryItem; network: Network; walletId: WalletId }
): Promise<Partial<NFTSendHistoryItem> | undefined> {
  const { getters, dispatch } = rootActionContext(context);
  const { from, accountId } = transaction;
  const chainId = getAsset(network, from).chain;
  const client = getters.client({ network, walletId, chainId, accountId });
  try {
    const tx = await client.chain.getTransactionByHash(transaction.txHash);
    if (tx && tx.confirmations && tx.confirmations > 0) {
      await dispatch.updateNFTs({ network, walletId, accountIds: [transaction.accountId] });

      return {
        endTime: Date.now(),
        status: txStatusToSendStatus(tx.status!),
      };
    }
  } catch (e) {
    if (e.name === 'TxNotFoundError') console.warn(e);
    else throw e;
  }
}

export const performNextNFTTransactionAction = async (
  context: ActionContext,
  { network, walletId, transaction }: { network: Network; walletId: WalletId; transaction: NFTSendHistoryItem }
) => {
  if (transaction.status === SendStatus.WAITING_FOR_CONFIRMATIONS) {
    return withInterval(async () => waitForConfirmations(context, { transaction, network, walletId }));
  }
};
