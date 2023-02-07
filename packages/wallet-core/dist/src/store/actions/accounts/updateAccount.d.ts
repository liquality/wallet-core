import { ActionContext } from '../..';
import { Account, Network, WalletId } from '../../types';
export declare const updateAccount: (context: ActionContext, { network, walletId, account }: {
    network: Network;
    walletId: WalletId;
    account: Account;
}) => Promise<{
    updatedAt: number;
    id: string;
    walletId: string;
    createdAt: number;
    enabled: boolean;
    derivationPath: string;
    chainCode?: string | undefined;
    publicKey?: string | undefined;
    nfts?: import("../../types").NFT[] | undefined;
    type: import("../../types").AccountType;
    name: string;
    alias?: string | undefined;
    chain: import("@liquality/cryptoassets").ChainId;
    index: number;
    addresses: string[];
    assets: string[];
    balances: Record<string, string>;
    color: string;
}>;
