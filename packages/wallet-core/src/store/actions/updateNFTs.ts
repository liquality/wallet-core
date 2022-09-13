import Bluebird from 'bluebird';
import { ActionContext, rootActionContext } from '..';
import { Account, Network, NFT, WalletId } from '../types';

export const updateNFTs = async (
  context: ActionContext,
  {
    walletId,
    network,
  }: {
    walletId: WalletId;
    network: Network;
  }
): Promise<NFT[][]> => {
  const { commit, getters } = rootActionContext(context);
  const accountIds = getters.accountsData.map((account) => {
    return account.id;
  });

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
        // const image = nftAsset.image_original_url.includes('ipfs://')
        //   ? parsed.image_original_url.replace('ipfs://', 'https://ipfs.io/ipfs/')
        //   : parsed.image_original_url;
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
