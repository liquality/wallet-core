import { ChainId } from '@liquality/cryptoassets';
import { ActionContext } from '..';
export declare const setEthereumInjectionChain: (context: ActionContext, { chain }: {
    chain: ChainId;
}) => Promise<void>;
