import { ActionContext } from '..';
import { AccountId, Asset, Network, WalletId } from '../types';
export declare const getUnusedAddresses: (context: ActionContext, { network, walletId, assets, accountId, }: {
    network: Network;
    walletId: WalletId;
    assets: Asset[];
    accountId: AccountId;
}) => Promise<string[]>;
