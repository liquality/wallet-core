import buildConfig from '../../build.config';
import { AstroportSwapProvider } from '../../swaps/astroport/AstroportSwapProvider';
import { FastbtcSwapProvider } from '../../swaps/fastbtc/FastbtcSwapProvider';
import { LiqualitySwapProvider } from '../../swaps/liquality/LiqualitySwapProvider';
import { LiqualityBoostERC20toNative } from '../../swaps/liqualityboost/liqualityBoostERC20toNative/LiqualityBoostERC20toNative';
import { LiqualityBoostNativeToERC20 } from '../../swaps/liqualityboost/liqualityBoostNativeToERC20/LiqualityBoostNativeToERC20';
import { OneinchSwapProvider } from '../../swaps/oneinch/OneinchSwapProvider';
import { SovrynSwapProvider } from '../../swaps/sovryn/SovrynSwapProvider';
import { ThorchainSwapProvider } from '../../swaps/thorchain/ThorchainSwapProvider';
import { UniswapSwapProvider } from '../../swaps/uniswap/UniswapSwapProvider';
import { Network, SwapProviderType } from '../types';

const providers = {
  [SwapProviderType.Liquality]: LiqualitySwapProvider,
  [SwapProviderType.UniswapV2]: UniswapSwapProvider,
  [SwapProviderType.OneInch]: OneinchSwapProvider,
  [SwapProviderType.Thorchain]: ThorchainSwapProvider,
  [SwapProviderType.LiqualityBoostNativeToERC20]: LiqualityBoostNativeToERC20,
  [SwapProviderType.LiqualityBoostERC20ToNative]: LiqualityBoostERC20toNative,
  [SwapProviderType.FastBTC]: FastbtcSwapProvider,
  [SwapProviderType.Sovryn]: SovrynSwapProvider,
  [SwapProviderType.Astroport]: AstroportSwapProvider,
};

export const createSwapProvider = (network: Network, providerId: string) => {
  const swapProviderConfig = buildConfig.swapProviders[network][providerId];
  const SwapProvider = providers[swapProviderConfig.type];
  return new SwapProvider({ ...swapProviderConfig, providerId });
};
