import { Transaction } from '@chainify/types';
import { ActionContext } from '..';
import { NFTSendTransactionParams } from '../types';
export declare const sendNFTTransaction: (context: ActionContext, { network, accountId, walletId, receiver, values, fee, feeLabel, nft }: NFTSendTransactionParams) => Promise<Transaction>;
