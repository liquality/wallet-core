import { TxStatus } from '@chainify/types';
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
  console.log('waitForConfirmations: transaction', transaction);
  const { getters } = rootActionContext(context);
  console.log('after rootActionContext');
  const client = getters.client({
    network,
    walletId,
    asset: transaction.from,
    accountId: transaction.accountId,
  });
  console.log('🚀 ~ file: sendNFT.ts ~ line 21 ~ afterClient transaction', transaction);
  try {
    console.log('1');
    const tx = await client.chain.getTransactionByHash(transaction.txHash);
    console.log('2');
    if (tx && tx.confirmations && tx.confirmations > 0) {
      return {
        endTime: Date.now(),
        status: txStatusToSendStatus(tx.status!),
      };
    }
  } catch (e) {
    console.log('🚀 ~ file: sendNFT.ts ~ line 38 ~ e', e);
    if (e.name === 'TxNotFoundError') console.warn(e);
    else throw e;
  }
}

export const performNextNFTTransactionAction = async (
  context: ActionContext,
  { network, walletId, transaction }: { network: Network; walletId: WalletId; transaction: NFTSendHistoryItem }
) => {
  console.log('🚀 ~ file: sendNFT.ts ~ line 50 ~ transaction', transaction);
  if (transaction.status === SendStatus.WAITING_FOR_CONFIRMATIONS) {
    return withInterval(async () => waitForConfirmations(context, { transaction, network, walletId }));
  }
};
