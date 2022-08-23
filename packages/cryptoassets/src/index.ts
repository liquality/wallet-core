import BigNumber from 'bignumber.js';
import { MAINNET_ASSETS } from './assets';
import { dappChains } from './dapps';
import { Asset, AssetType, AssetTypes, ChainId } from './types';

function unitToCurrency(asset: Asset, value: number | BigNumber): BigNumber {
  const multiplier = new BigNumber(10).pow(asset.decimals);
  return new BigNumber(value).dividedBy(multiplier);
}

function currencyToUnit(asset: Asset, value: number | BigNumber): BigNumber {
  const multiplier = new BigNumber(10).pow(asset.decimals);
  return new BigNumber(value).times(multiplier);
}

export * from './chains';
export { MAINNET_ASSETS, dappChains, unitToCurrency, currencyToUnit, Asset, AssetType, AssetTypes, ChainId };
