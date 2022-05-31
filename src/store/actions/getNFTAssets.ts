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

  // set new nft assets to a new map
  const newNftAssetsMap: {
    [id: string]: NFTAsset;
  } = {};
  for (const asset of nftAssetsFetched) {
    newNftAssetsMap[asset.id] = asset;
  }

  // remove nft assets in state that are not in the fetched list
  const arrayToBeReturned: NFTAsset[] = [];
  for (const asset of nftAssetsStoredInState) {
    if (newNftAssetsMap[asset.id]) {
      arrayToBeReturned.push(asset);
    } else {
      continue;
    }
  }

  const objToBeRetured: {
    [id: string]: NFTAsset;
  } = {};
  
  // add new nft assets to the map
  for (const asset of arrayToBeReturned) {
    objToBeRetured[asset.id] = asset;
  }

  // add new nft assets to the map and set the 'starred' property to false by default
  for (const [key, value] of Object.entries(newNftAssetsMap)) {
    if (objToBeRetured[key]) {
      newNftAssetsMap[key] = objToBeRetured[key];
    } else {
      newNftAssetsMap[key] = { ...value, starred: false };
    }
  }

  const nftAssets: NFTAsset[] = [];

  // add new nft assets to the array
  for (const [key, value] of Object.entries(newNftAssetsMap)) {
    console.log(key);
    nftAssets.push(value);
  }

  nftAssets.reverse();

  // update the account with the new nft assets
  commit.SET_NFT_ASSETS({ nftAssets, network, walletId, accountId });

  return nftAssets;
};
