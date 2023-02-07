import { ActionContext } from '..';
import { Wallet } from '../types';
export declare const createWallet: (context: ActionContext, { key, mnemonic, imported }: {
    key: string;
    mnemonic: string;
    imported?: boolean | undefined;
}) => Promise<Wallet>;
