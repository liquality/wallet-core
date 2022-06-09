import { chains } from '@liquality/cryptoassets';
import { ActionContext, rootActionContext } from '..';
import buildConfig from '../../build.config';
import { Network, NFTAsset, WalletId } from '../types';

export const getNFTAssets = async (
  context: ActionContext,
  {
    walletId,
    network,
  }: {
    walletId: WalletId;
    network: Network;
  }
): Promise<void> => {
  const { state, commit, getters } = rootActionContext(context);
  const { supportedNFTChains } = buildConfig;

  supportedNFTChains[network].forEach(async (chain) => {
    const asset = chains[chain].nativeAsset;
    const account = state.accounts[walletId]![network].find((account) => account.chain === chain);
    const _client = getters.client({
      network,
      walletId,
      asset,
      accountId: account?.id,
    });
    const nft: any = await _client.nft?.fetch();
    const nftAssetsStoredInState: NFTAsset[] = account?.nftAssets || [];
    const nftAssetsFetched: NFTAsset[] = nft?.assets;
    const nftAssets: NFTAsset[] = nftAssetsFetched.map((nftAsset) => {
      const nftAssetStoredInState = nftAssetsStoredInState.find((asset) => asset.id === nftAsset.id);
      if (nftAssetStoredInState) {
        nftAsset.starred = nftAssetStoredInState.starred;
        nftAsset.chain = nftAssetStoredInState.chain;
      } else {
        nftAsset.starred = false;
        nftAsset.chain = account?.chain;
      }
      return nftAsset;
    });
    commit.SET_NFT_ASSETS({ nftAssets, network, walletId, accountId: account?.id });
  });
};
