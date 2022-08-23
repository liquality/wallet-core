import { ActionContext, rootActionContext } from '..';
import { AccountId, Network, NFT, WalletId } from '../types';

export const toggleNFTStarred = (
  context: ActionContext,
  { network, walletId, accountId, nft }: { network: Network; walletId: WalletId; accountId: AccountId; nft: NFT }
) => {
  const { commit } = rootActionContext(context);
  commit.NFT_TOGGLE_STARRED({ network, walletId, accountId, nft });
};
