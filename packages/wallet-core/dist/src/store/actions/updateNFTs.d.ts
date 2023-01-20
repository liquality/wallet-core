import { ActionContext } from '..';
import { AccountId, Network, NFT, WalletId } from '../types';
export declare const updateNFTs: (context: ActionContext, { walletId, network, accountIds, }: {
    walletId: WalletId;
    network: Network;
    accountIds: AccountId[];
}) => Promise<NFT[][]>;
