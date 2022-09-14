import Bluebird from 'bluebird';
import { ActionContext, rootActionContext } from '..';
import { Account, AccountId, Network, NFT, WalletId } from '../types';

export const updateNFTs = async (
  context: ActionContext,
  {
    walletId,
    network,
    accountIds,
  }: {
    walletId: WalletId;
    network: Network;
    accountIds: AccountId[];
  }
): Promise<NFT[][]> => {
  const { commit, getters } = rootActionContext(context);

  const nfts = await Bluebird.map(
    accountIds,
    async (accountId) => {
      const account: Account = getters.accountItem(accountId)!;
      const client = getters.client({
        network,
        walletId,
        chainId: account.chain,
        accountId: account.id,
      });

      if (!client.nft) {
        return [];
      }

      const nftAssetsStoredInState = account.nfts || [];
      const nftAssetsFetched = await client.nft.fetch();
      const nfts = nftAssetsFetched.map((nftAsset: NFT) => {
        const nftAssetStoredInState = nftAssetsStoredInState.find((asset: NFT) => asset.token_id === nftAsset.token_id);
        const starred = nftAssetStoredInState ? nftAssetStoredInState.starred : false;
        const replaceIPFSUrl = (url: string) => {
          return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
        };
        if (nftAsset.image_original_url) {
          nftAsset.image_original_url = replaceIPFSUrl(nftAsset.image_original_url);
        }
        if (nftAsset.image_thumbnail_url) {
          nftAsset.image_thumbnail_url = replaceIPFSUrl(nftAsset.image_thumbnail_url);
        }
        if (nftAsset.image_preview_url) {
          nftAsset.image_preview_url = replaceIPFSUrl(nftAsset.image_preview_url);
        }

        return {
          ...nftAsset,
          starred,
        };
      });

      commit.UPDATE_NFTS({ network, walletId, accountId: account.id, nfts });

      return nfts;
    },
    { concurrency: 3 }
  );

  return nfts;
};
