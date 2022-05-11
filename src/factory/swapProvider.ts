import buildConfig from '../build.config';
import { Network, SwapProviderType } from '../store/types';
import { AstroportSwapProvider } from '../swaps/astroport/AstroportSwapProvider';
import { FastbtcSwapProvider } from '../swaps/fastbtc/FastbtcSwapProvider';
import { LiqualitySwapProvider } from '../swaps/liquality/LiqualitySwapProvider';
import { LiqualityBoostERC20toNative } from '../swaps/liqualityboost/liqualityBoostERC20toNative/LiqualityBoostERC20toNative';
import { LiqualityBoostNativeToERC20 } from '../swaps/liqualityboost/liqualityBoostNativeToERC20/LiqualityBoostNativeToERC20';
import { OneinchSwapProvider } from '../swaps/oneinch/OneinchSwapProvider';
import { SovrynSwapProvider } from '../swaps/sovryn/SovrynSwapProvider';
import { SwapProvider } from '../swaps/SwapProvider';
import { ThorchainSwapProvider } from '../swaps/thorchain/ThorchainSwapProvider';
import { UniswapSwapProvider } from '../swaps/uniswap/UniswapSwapProvider';

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

const createSwapProvider = (network: Network, providerId: string) => {
  const swapProviderConfig = buildConfig.swapProviders[network][providerId];
  const SwapProvider = providers[swapProviderConfig.type];
  // @ts-ignore TODO: i'll fix it
  return new SwapProvider({ ...swapProviderConfig, providerId });
};

const mapLegacyProvidersToSupported: { [index: string]: string } = {
  oneinchV3: 'oneinchV4',
  liqualityBoost: 'liqualityBoostNativeToERC20',
};

const swapProviderCache: { [key: string]: SwapProvider } = {};

function getSwapProvider(network: Network, providerId: string): SwapProvider {
  const supportedProviderId = mapLegacyProvidersToSupported[providerId]
    ? mapLegacyProvidersToSupported[providerId]
    : providerId;
  const cacheKey = [network, supportedProviderId].join('-');

  const cachedSwapProvider = swapProviderCache[cacheKey];
  if (cachedSwapProvider) return cachedSwapProvider;

  const swapProvider = createSwapProvider(network, supportedProviderId);
  swapProviderCache[cacheKey] = swapProvider;

  return swapProvider;
}

export { getSwapProvider };
