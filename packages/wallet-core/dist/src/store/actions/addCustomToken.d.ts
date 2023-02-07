import { ChainId } from '@liquality/cryptoassets';
import { ActionContext } from '..';
import { Network, WalletId } from '../types';
export declare const addCustomToken: (context: ActionContext, { network, walletId, chain, symbol, name, contractAddress, decimals, }: {
    network: Network;
    walletId: WalletId;
    chain: ChainId;
    symbol: string;
    name: string;
    contractAddress: string;
    decimals: number;
}) => Promise<void>;
