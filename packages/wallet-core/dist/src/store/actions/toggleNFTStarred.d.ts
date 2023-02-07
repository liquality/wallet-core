import { ActionContext } from '..';
import { AccountId, Network, NFT, WalletId } from '../types';
export declare const toggleNFTStarred: (context: ActionContext, { network, walletId, accountId, nft }: {
    network: Network;
    walletId: WalletId;
    accountId: AccountId;
    nft: NFT;
}) => void;
