import { ActionContext } from '../..';
import { Network, WalletId } from '../../types';
export declare const removeAccount: (context: ActionContext, { network, walletId, id }: {
    network: Network;
    walletId: WalletId;
    id: string;
}) => Promise<string>;
