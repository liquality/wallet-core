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
        if (!nftAsset.token_id && nftAsset.name) {
          const hash = nftAsset.name.match(/#(\d+)/);
          if (hash) {
            nftAsset.token_id = hash[1];
          }
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
