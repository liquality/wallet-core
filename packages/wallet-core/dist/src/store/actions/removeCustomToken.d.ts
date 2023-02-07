import { ActionContext } from '..';
import { Network, WalletId } from '../types';
export declare const removeCustomToken: (context: ActionContext, { network, walletId, symbol }: {
    network: Network;
    walletId: WalletId;
    symbol: string;
}) => Promise<void>;
