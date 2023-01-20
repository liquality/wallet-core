import { ActionContext } from '..';
import { AccountId, Network, WalletId } from '../types';
declare type UpdateBalanceRequestType = {
    walletId: WalletId;
    network: Network;
    accountIds?: AccountId[];
};
export declare const updateBalances: (context: ActionContext, request: UpdateBalanceRequestType) => Promise<void>;
export {};
