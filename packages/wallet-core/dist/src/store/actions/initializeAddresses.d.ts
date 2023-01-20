import { ActionContext } from '..';
import { Network, WalletId } from '../types';
export declare const initializeAddresses: (context: ActionContext, { network, walletId }: {
    network: Network;
    walletId: WalletId;
}) => Promise<void>;
