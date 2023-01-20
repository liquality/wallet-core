import { ActionContext } from '../..';
import { Network, SendHistoryItem, WalletId } from '../../types';
export declare const performNextTransactionAction: (context: ActionContext, { network, walletId, transaction }: {
    network: Network;
    walletId: WalletId;
    transaction: SendHistoryItem;
}) => Promise<Partial<SendHistoryItem> | undefined>;
