import { ChainId } from '@liquality/cryptoassets';
import { ActionContext } from '..';
import { AccountId } from '../types';
export declare const addExternalConnection: (context: ActionContext, { origin, chain, accountId, setDefaultEthereum, }: {
    origin: string;
    chain: ChainId;
    accountId: AccountId;
    setDefaultEthereum: boolean;
}) => void;
