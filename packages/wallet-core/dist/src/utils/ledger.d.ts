import { AccountType } from '../store/types';
export declare const LEDGER_BITCOIN_OPTIONS: {
    name: AccountType;
    label: string;
    addressType: import("@chainify/bitcoin/dist/lib/types").AddressType;
}[];
export declare const LEDGER_OPTIONS: {
    name: string;
    label: string;
    types: AccountType[];
    chain: string;
}[];
