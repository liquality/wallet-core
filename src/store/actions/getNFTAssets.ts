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

  const oldAssets: NFTAsset[] = account?.nftAssets || [];
  const newAssets: NFTAsset[] = nft.assets;

  const newAssetMap: {
    [id: string]: NFTAsset;
  } = {};
  for (const asset of newAssets) {
    newAssetMap[asset.id] = asset;
  }

  const arrayToBeReturned: NFTAsset[] = [];

  for (const asset of oldAssets) {
    if (newAssetMap[asset.id]) {
      arrayToBeReturned.push(asset);
    } else {
      continue;
    }
  }

  const objToBeRetured: {
    [id: string]: NFTAsset;
  } = {};

  for (const asset of arrayToBeReturned) {
    objToBeRetured[asset.id] = asset;
  }

  for (const [key, value] of Object.entries(newAssetMap)) {
    if (objToBeRetured[key]) {
      newAssetMap[key] = objToBeRetured[key];
    } else {
      newAssetMap[key] = { ...value, starred: false };
    }
  }

  const nftAssets: NFTAsset[] = [];

  for (const [key, value] of Object.entries(newAssetMap)) {
    console.log(key);
    nftAssets.push(value);
  }

  nftAssets.reverse();

  commit.SET_NFT_ASSETS({ nftAssets, network, walletId, accountId });

  return nftAssets;
};
