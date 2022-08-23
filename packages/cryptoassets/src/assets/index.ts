import { chainToTestnetTokenAddressMap, chainToTokenAddressMap, erc20Assets, testnetErc20Assets } from './erc20';
import { nativeAssets, testnetNativeAssets } from './native';
import { getSendGasLimitERC20 } from './sendGasLimits';

const assets = {
  ...nativeAssets,
  ...erc20Assets,
};

const testnetAssets = {
  ...testnetNativeAssets,
  ...testnetErc20Assets,
};

export { assets, testnetAssets, chainToTokenAddressMap, chainToTestnetTokenAddressMap, getSendGasLimitERC20 };
