import { ActionContext } from '..';
import { WalletId } from '../types';
export declare const checkPendingActions: (context: ActionContext, { walletId }: {
    walletId: WalletId;
}) => Promise<void>;
