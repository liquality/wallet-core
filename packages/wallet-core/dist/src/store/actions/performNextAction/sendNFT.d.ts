import { ActionContext } from '../..';
import { Network, NFTSendHistoryItem, WalletId } from '../../types';
export declare const performNextNFTTransactionAction: (context: ActionContext, { network, walletId, transaction }: {
    network: Network;
    walletId: WalletId;
    transaction: NFTSendHistoryItem;
}) => Promise<Partial<NFTSendHistoryItem> | undefined>;
