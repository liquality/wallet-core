import buildConfig from '../build.config';
import { SwapProviderType } from '../swaps/types';

const swapProviderRoot = {
  [SwapProviderType.LIQUALITY]: 'swaps/liquality',
  [SwapProviderType.UNISWAPV2]: 'swaps/uniswap',
  [SwapProviderType.ONEINCHV4]: 'swaps/oneinch',
  [SwapProviderType.THORCHAIN]: 'swaps/thorchain',
  [SwapProviderType.FASTBTC]: 'swaps/fastbtc',
  [SwapProviderType.LIQUALITYBOOST]: 'swaps/liqualityboost',
  [SwapProviderType.SOVRYN]: 'swaps/sovryn',
  [SwapProviderType.ASTROPORT]: 'swaps/astroport',
};

export function getSwapProviderConfig(network, providerId) {
  return buildConfig.swapProviders[network][providerId];
}

export function getSwapProviderIcon(network, providerId) {
  const config = getSwapProviderConfig(network, providerId);
  return require(`../assets/icons/swapProviders/${config.icon}`);
}

export function getSwapProviderInfo(network, providerId) {
  const config = getSwapProviderConfig(network, providerId);
  const root = swapProviderRoot[config.type];
  return require(`../${root}/info.json`);
}
