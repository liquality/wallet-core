import { ActionContext } from '..';
import { AccountId, Network, WalletId } from '../types';
export declare const updateAccountBalance: (context: ActionContext, { network, walletId, accountId }: {
    network: Network;
    walletId: WalletId;
    accountId: AccountId;
}) => Promise<void>;
