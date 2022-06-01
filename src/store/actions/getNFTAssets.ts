import { ActionContext, rootActionContext } from '..';
import { Asset, Network, NFTAsset, WalletId } from '../types';

export const getNFTAssets = async (
  context: ActionContext,
  {
    network,
    walletId,
    asset,
    accountId
  }: {
    network: Network;
    walletId: WalletId;
    asset: Asset;
    accountId: string;
  }
): Promise<any> => {
  const { state, commit, getters } = rootActionContext(context);
  const client = getters.client({
    network,
    walletId,
    asset,
  });

  const nft = await client.nft.fetch();

  const account =  state.accounts[walletId]![network].find((a) => a.id === accountId);

  const nftAssetsStoredInState: NFTAsset[] = account?.nftAssets || [];
  const nftAssetsFetched: NFTAsset[] = nft.assets;

  const nftAssets: NFTAsset[] = [];

  nftAssetsFetched.forEach((nftAsset) => {
    const nftAssetStoredInState = nftAssetsStoredInState.find((a) => a.id === nftAsset.id);
    if (nftAssetStoredInState) {
      nftAsset.starred = nftAssetStoredInState.starred;
    }
    nftAssets.push(nftAsset);
  });

  commit.SET_NFT_ASSETS({ nftAssets, network, walletId, accountId });

  return nftAssets;
};
