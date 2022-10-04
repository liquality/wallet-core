import { Transaction } from '@chainify/types';
import { getChain } from '@liquality/cryptoassets';
import { getErrorParser, ChainifyErrorParser } from '@liquality/error-parser';
import { v4 as uuidv4 } from 'uuid';
import { ActionContext, rootActionContext } from '..';
import { createHistoryNotification } from '../broker/notification';
import { Account, NFTSendHistoryItem, NFTSendTransactionParams, SendStatus, TransactionType } from '../types';

export const sendNFTTransaction = async (
  context: ActionContext,
  { network, accountId, walletId, receiver, values, fee, feeLabel, nft }: NFTSendTransactionParams
): Promise<Transaction> => {
  const { getters, commit, dispatch } = rootActionContext(context);
  const account: Account = getters.accountItem(accountId)!;
  const asset = getChain(network, account.chain).nativeAsset[0].code;
  const client = getters.client({ network, walletId, chainId: account.chain, accountId });

  const parser = getErrorParser(ChainifyErrorParser);
  const tx = (await parser.wrapAsync(
    async () => await client.nft.transfer(nft.asset_contract!.address!, receiver, [nft.token_id!], values),
    null
  )) as any;

  const transaction: NFTSendHistoryItem = {
    id: uuidv4(),
    type: TransactionType.NFT,
    network,
    walletId,
    to: asset,
    from: asset,
    toAddress: receiver,
    fee,
    tx,
    nft,
    txHash: tx.hash,
    startTime: Date.now(),
    status: SendStatus.WAITING_FOR_CONFIRMATIONS,
    accountId,
    feeLabel,
  };

  commit.NEW_NFT_TRASACTION({
    network,
    walletId,
    transaction,
  });

  dispatch.performNextAction({
    network,
    walletId,
    id: transaction.id,
  });

  createHistoryNotification(transaction);

  return tx;
};
