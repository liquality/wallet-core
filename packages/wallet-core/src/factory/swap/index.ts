import buildConfig from '../../build.config';
import { Network, SwapProviderType } from '../../store/types';
import { AstroportSwapProvider } from '../../swaps/astroport/AstroportSwapProvider';
import { FastBTCDepositSwapProvider } from '../../swaps/fastbtc/FastBTCDepositSwapProvider';
import { FastBTCWithdrawSwapProvider } from '../../swaps/fastbtc/FastBTCWithdrawSwapProvider';
import { HopSwapProvider } from '../../swaps/hop/HopSwapProvider';
import { JupiterSwapProvider } from '../../swaps/jupiter/JupiterSwapProvider';
import { LiqualitySwapProvider } from '../../swaps/liquality/LiqualitySwapProvider';
import { LiqualityBoostERC20toNative } from '../../swaps/liqualityboost/liqualityBoostERC20toNative/LiqualityBoostERC20toNative';
import { LiqualityBoostNativeToERC20 } from '../../swaps/liqualityboost/liqualityBoostNativeToERC20/LiqualityBoostNativeToERC20';
import { OneinchSwapProvider } from '../../swaps/oneinch/OneinchSwapProvider';
import { SymbiosisSwapProvider } from '../../swaps/symbiosis/SymbiosisSwapProvider';
import { SovrynSwapProvider } from '../../swaps/sovryn/SovrynSwapProvider';
import { SwapProvider } from '../../swaps/SwapProvider';
import { ThorchainSwapProvider } from '../../swaps/thorchain/ThorchainSwapProvider';
import { UniswapSwapProvider } from '../../swaps/uniswap/UniswapSwapProvider';

const providers = {
  [SwapProviderType.Liquality]: LiqualitySwapProvider,
  [SwapProviderType.UniswapV2]: UniswapSwapProvider,
  [SwapProviderType.OneInch]: OneinchSwapProvider,
  [SwapProviderType.Thorchain]: ThorchainSwapProvider,
  [SwapProviderType.LiqualityBoostNativeToERC20]: LiqualityBoostNativeToERC20,
  [SwapProviderType.LiqualityBoostERC20ToNative]: LiqualityBoostERC20toNative,
  [SwapProviderType.FastBTCDeposit]: FastBTCDepositSwapProvider,
  [SwapProviderType.FastBTCWithdraw]: FastBTCWithdrawSwapProvider,
  [SwapProviderType.Sovryn]: SovrynSwapProvider,
  [SwapProviderType.Astroport]: AstroportSwapProvider,
  [SwapProviderType.Hop]: HopSwapProvider,
  [SwapProviderType.Jupiter]: JupiterSwapProvider,
  [SwapProviderType.Symbiosis]: SymbiosisSwapProvider,
};

const createSwapProvider = (network: Network, providerId: SwapProviderType) => {
  const swapProviderConfig = buildConfig.swapProviders[network][providerId];
  if (!swapProviderConfig) {
    throw new Error(`Failed to retrieve swap provider config for \`${providerId}\` on ${network}`);
  }
  const SwapProvider = providers[swapProviderConfig.type];
  // @ts-ignore TODO: i'll fix it
  return new SwapProvider({ ...swapProviderConfig, providerId });
};

const mapLegacyProvidersToSupported: { [index: string]: string } = {
  oneinchV3: 'oneinchV4',
  liqualityBoost: 'liqualityBoostNativeToERC20',
};

const swapProviderCache: { [key: string]: SwapProvider } = {};

function getSwapProvider(network: Network, providerId: SwapProviderType): SwapProvider {
  const supportedProviderId = mapLegacyProvidersToSupported[providerId]
    ? (mapLegacyProvidersToSupported[providerId] as SwapProviderType)
    : providerId;
  const cacheKey = [network, supportedProviderId].join('-');

  const cachedSwapProvider = swapProviderCache[cacheKey];
  if (cachedSwapProvider) return cachedSwapProvider;

  const swapProvider = createSwapProvider(network, supportedProviderId);
  swapProviderCache[cacheKey] = swapProvider;

  return swapProvider;
}

export { getSwapProvider };
