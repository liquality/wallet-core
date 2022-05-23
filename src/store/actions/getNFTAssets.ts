import { ActionContext, rootActionContext } from '..';
import { Network, NFTAsset, WalletId } from '../types';

export const getNFTAssets = async (
  context: ActionContext,
  {
    network,
    walletId,
  }: {
    network: Network;
    walletId: WalletId;
  }
): Promise<any> => {
  const { state, commit, getters } = rootActionContext(context);
  const client = getters.client({
    network,
    walletId,
    asset: 'ETH',
  });

  const nft = await client.nft.fetch();

  const nftAssets: NFTAsset[] = [];
  nft.assets.forEach((asset: any) => {
    if (state.starredNFTs) {
      asset['starred'] = state.starredNFTs.filter(
        (item) => item.asset_contract.address === asset.asset_contract.address && item.id === asset.id
      ).length
        ? true
        : false;
      nftAssets.push(asset);
    } else {
      asset['starred'] = false;
      nftAssets.push(asset);
    }
  });
  console.log('🚀 ~ file: getNFTAssets.ts ~ line 34 ~ nftAssets ~ nftAssets', nftAssets);

  commit.SET_NFT_ASSETS({ nftAssets, network, walletId });

  return nftAssets;
};
