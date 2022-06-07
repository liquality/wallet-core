import { chains } from '@liquality/cryptoassets';
import { ActionContext, rootActionContext } from '..';
import buildConfig from '../../build.config';
import { NFTAsset, WalletId } from '../types';

export const getNFTAssets = async (
  context: ActionContext,
  {
    walletId,
  }: {
    walletId: WalletId;
  }
): Promise<void> => {
  const { state, commit, getters } = rootActionContext(context);
  const { networks, nftAssets } = buildConfig;

  networks.forEach((network) => {
    const assetKeys = nftAssets[network];
    assetKeys.forEach(async (chain) => {
      const asset = chains[chain].nativeAsset;
      const account = state.accounts[walletId]![network].find((a) => a.assets.includes(asset));
      const _client = getters.client({
        network,
        walletId,
        asset,
        accountId: account?.id,
      });

      const nft: any = await _client.nft?.fetch();

      const nftAssetsStoredInState: NFTAsset[] = account?.nftAssets || [];
      const nftAssetsFetched: NFTAsset[] = nft.assets;

      const nftAssets: NFTAsset[] = nftAssetsFetched.map((nftAsset) => {
        const nftAssetStoredInState = nftAssetsStoredInState.find((asset) => asset.id === nftAsset.id);
        if (nftAssetStoredInState) {
          nftAsset.starred = nftAssetStoredInState.starred || false;
          nftAsset.asset = nftAssetStoredInState.asset || asset;
          nftAsset.chain = nftAssetStoredInState.chain || account?.chain;
        }
        return nftAsset;
      });

      commit.SET_NFT_ASSETS({ nftAssets, network, walletId, accountId: account?.id });
    });
  });
};
