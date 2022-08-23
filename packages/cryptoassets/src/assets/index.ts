import { chainToTestnetTokenAddressMap, chainToTokenAddressMap, erc20Assets } from './erc20';
import { MAINNET_NATIVE_ASSETS } from './mainnet/native';

const assets = {
  ...MAINNET_NATIVE_ASSETS,
  ...erc20Assets,
};

export { assets, chainToTokenAddressMap, chainToTestnetTokenAddressMap };
