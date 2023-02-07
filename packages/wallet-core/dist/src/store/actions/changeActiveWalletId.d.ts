import { ActionContext } from '..';
import { WalletId } from '../types';
export declare const changeActiveWalletId: (context: ActionContext, { walletId }: {
    walletId: WalletId;
}) => Promise<void>;
