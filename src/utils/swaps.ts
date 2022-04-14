import buildConfig from '../build.config';
import astroportInfo from '../swaps/astroport/info.json';
import fastbtcInfo from '../swaps/fastbtc/info.json';
import liqualityInfo from '../swaps/liquality/info.json';
import liqualityBoostERC20toNativeInfo from '../swaps/liqualityboost/liqualityBoostERC20toNative/info.json';
import liqualityBoostNativeToERC20Info from '../swaps/liqualityboost/liqualityBoostNativeToERC20/info.json';
import oneinchInfo from '../swaps/oneinch/info.json';
import sovrynInfo from '../swaps/sovryn/info.json';
import thorchainInfo from '../swaps/thorchain/info.json';
import uniswapInfo from '../swaps/uniswap/info.json';
import { SwapProviderType } from './swapProviderType';

const swapProviderInfo = {
  [SwapProviderType.LIQUALITY]: liqualityInfo,
  [SwapProviderType.UNISWAPV2]: uniswapInfo,
  [SwapProviderType.ONEINCHV4]: oneinchInfo,
  [SwapProviderType.THORCHAIN]: thorchainInfo,
  [SwapProviderType.FASTBTC]: fastbtcInfo,
  [SwapProviderType.LIQUALITYBOOST_NATIVE_TO_ERC20]: liqualityBoostNativeToERC20Info,
  [SwapProviderType.LIQUALITYBOOST_ERC20_TO_NATIVE]: liqualityBoostERC20toNativeInfo,
  [SwapProviderType.SOVRYN]: sovrynInfo,
  [SwapProviderType.ASTROPORT]: astroportInfo,
};

export function getSwapProviderConfig(network, providerId) {
  return buildConfig.swapProviders[network][providerId];
}

export function getSwapProviderInfo(network, providerId) {
  const config = getSwapProviderConfig(network, providerId);
  return swapProviderInfo[config.type];
}
