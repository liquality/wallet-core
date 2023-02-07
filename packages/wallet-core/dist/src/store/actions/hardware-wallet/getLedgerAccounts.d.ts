import { ActionContext } from '../..';
import { AccountType, Asset, Network, WalletId } from '../../types';
declare type LedgerAccountEntry = {
    account: string;
    index: number;
    exists: boolean;
};
export declare const getLedgerAccounts: (context: ActionContext, { network, walletId, asset, accountType, startingIndex, numAccounts, }: {
    network: Network;
    walletId: WalletId;
    asset: Asset;
    accountType: AccountType;
    startingIndex: number;
    numAccounts: number;
}) => Promise<LedgerAccountEntry[]>;
export {};
