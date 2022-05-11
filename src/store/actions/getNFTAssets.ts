import { ActionContext, rootActionContext } from '..';
import { Network, WalletId } from '../types';

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
  console.log('🚀 ~ file: getNFTAssets.ts ~ line 20 ~ fetch', client.nft.fetch());

  const nft = await client.nft.fetch()

  nft.assets.forEach((asset: any) => {
    if (state.starredNFTs) {
      asset['starred'] = state.starredNFTs.filter(
        (item) => item.asset_contract.address === asset.asset_contract.address && item.id === asset.id
      ).length
        ? true
        : false;
    } else {
      asset['starred'] = false;
    }
  });

  commit.SET_NFT_ASSETS_NUMBER(nft.assets.length);

  const result = nft.assets.reduce(function (r: any, a: any) {
    r[a.collection.name] = r[a.collection.name] || [];
    r[a.collection.name].push(a);
    r[a.collection.name].sort(function (a: any, b: any) {
      return a.starred === b.starred ? 0 : a.starred ? -1 : 1;
    });
    return r;
  }, Object.create(null));

  commit.SET_NFT_ASSETS(result);

  return result;
};
