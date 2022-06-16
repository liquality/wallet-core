import { chains } from '@liquality/cryptoassets';
import Bluebird from 'bluebird';
import { ActionContext, rootActionContext } from '..';
import { AccountId, Network, NFT, WalletId } from '../types';

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
      const account = getters.accountItem(accountId)!;
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
      const nftAssetsFetched = await client.nft.fetch();
      const nfts = nftAssetsFetched.map((nftAsset) => {
        const nftAssetStoredInState = nftAssetsStoredInState.find((asset) => asset.id === nftAsset.id);
        const starred = nftAssetStoredInState ? nftAssetStoredInState.starred : false;
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
