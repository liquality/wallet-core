import { Nullable, TokenDetails } from '@chainify/types';
import { ChainId } from '@liquality/cryptoassets';
import { ActionContext } from '..';
import { Network, WalletId } from '../types';
export declare type FetchTokenDetailsRequest = {
    walletId: WalletId;
    network: Network;
    chain: ChainId;
    contractAddress: string;
};
export declare const fetchTokenDetails: (context: ActionContext, tokenDetailsRequest: FetchTokenDetailsRequest) => Promise<Nullable<TokenDetails>>;
