import { ChainId } from '@liquality/cryptoassets';
import { Account, AccountDefinition, Network, WalletId } from '../store/types';
export declare const accountCreator: (payload: {
    network: Network;
    walletId: WalletId;
    account: AccountDefinition;
}) => Account;
export declare const accountColors: string[];
export declare const getNextAccountColor: (chain: ChainId, index: number) => string;
export declare const ACCOUNT_TYPE_OPTIONS: {
    name: string;
    label: string;
    type: string;
    chain: ChainId;
    blockchain: string;
}[];
