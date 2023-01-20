import { ActionContext } from '../..';
import { HistoryItem, Network, WalletId } from '../../types';
export declare const performNextAction: (context: ActionContext, { network, walletId, id }: {
    network: Network;
    walletId: WalletId;
    id: string;
}) => Promise<Partial<HistoryItem> | undefined>;
