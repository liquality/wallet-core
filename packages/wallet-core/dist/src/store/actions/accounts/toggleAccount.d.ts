import { ActionContext } from '../..';
import { AccountId, Network, WalletId } from '../../types';
export declare const toggleAccount: (context: ActionContext, { network, walletId, accounts, enable, }: {
    network: Network;
    walletId: WalletId;
    accounts: AccountId[];
    enable: boolean;
}) => void;
