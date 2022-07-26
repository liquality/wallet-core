import { chains } from '@liquality/cryptoassets';
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
      const asset = chains[account.chain].nativeAsset;
      const client = getters.client({
        network,
        walletId,
        asset,
        accountId: account.id,
      });

      if (!client.nft) {
        return [];
      }

      const nftAssetsStoredInState = account.nfts || [];
      console.log('🚀 ~ file: updateNFTs.ts ~ line 37 ~ nftAssetsStoredInState', nftAssetsStoredInState);
      const nftAssetsFetched = await client.nft.fetch();
      console.log('🚀 ~ file: updateNFTs.ts ~ line 38 ~ nftAssetsFetched', nftAssetsFetched);
      const nfts = nftAssetsFetched.map((nftAsset: NFT) => {
        const nftAssetStoredInState = nftAssetsStoredInState.find((asset: NFT) => asset.token_id === nftAsset.token_id);
        const starred = nftAssetStoredInState ? nftAssetStoredInState.starred : false;
        const image = nftAsset?.image_original_url?.includes('ipfs://')
          ? nftAsset?.image_original_url.replace('ipfs://', 'https://ipfs.io/ipfs/')
          : nftAsset.image_original_url;
        return {
          ...nftAsset,
          image_original_url: image,
          image_preview_url: image,
          image_thumbnail_url: image,
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
