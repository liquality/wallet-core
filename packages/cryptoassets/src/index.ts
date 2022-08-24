import BigNumber from 'bignumber.js';
import {
  assets,
  chainToTestnetTokenAddressMap,
  chainToTokenAddressMap,
  getSendGasLimitERC20,
  testnetAssets,
} from './assets';
import { chains, hasTokens, isEthereumChain, isMultiLayeredChain, supportCustomFees } from './chains';
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

export {
  assets,
  chainToTokenAddressMap,
  testnetAssets,
  chainToTestnetTokenAddressMap,
  getSendGasLimitERC20,
  chains,
  dappChains,
  isEthereumChain,
  isMultiLayeredChain,
  hasTokens,
  supportCustomFees,
  unitToCurrency,
  currencyToUnit,
  Asset,
  AssetType,
  AssetTypes,
  ChainId,
};
