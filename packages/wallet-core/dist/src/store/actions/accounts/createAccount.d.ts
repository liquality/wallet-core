import { ActionContext } from '../..';
import { Account, Network, WalletId } from '../../types';
export declare const createAccount: (context: ActionContext, { walletId, network, account }: {
    walletId: WalletId;
    network: Network;
    account: Account;
}) => Promise<Account>;
