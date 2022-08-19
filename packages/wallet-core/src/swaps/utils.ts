import buildConfig from '../build.config';
import { getSwapProvider } from '../factory';
import { Network, SwapProviderType } from '../store/types';
import astroportInfo from '../swaps/astroport/info.json';
import fastbtcInfo from '../swaps/fastbtc/info.json';
import hopInfo from '../swaps/hop/info.json';
import jupiterInfo from '../swaps/jupiter/info.json';
import liqualityInfo from '../swaps/liquality/info.json';
import liqualityBoostERC20toNativeInfo from '../swaps/liqualityboost/liqualityBoostERC20toNative/info.json';
import liqualityBoostNativeToERC20Info from '../swaps/liqualityboost/liqualityBoostNativeToERC20/info.json';
import oneinchInfo from '../swaps/oneinch/info.json';
import sovrynInfo from '../swaps/sovryn/info.json';
import symbiosisInfo from '../swaps/symbiosis/info.json';
import thorchainInfo from '../swaps/thorchain/info.json';
import uniswapInfo from '../swaps/uniswap/info.json';
import { LiqualitySwapProvider } from './liquality/LiqualitySwapProvider';

const swapProviderInfo = {
  [SwapProviderType.Liquality]: liqualityInfo,
  [SwapProviderType.UniswapV2]: uniswapInfo,
  [SwapProviderType.OneInch]: oneinchInfo,
  [SwapProviderType.Thorchain]: thorchainInfo,
  [SwapProviderType.FastBTCDeposit]: fastbtcInfo,
  [SwapProviderType.FastBTCWithdraw]: fastbtcInfo,
  [SwapProviderType.LiqualityBoostNativeToERC20]: liqualityBoostNativeToERC20Info,
  [SwapProviderType.LiqualityBoostERC20ToNative]: liqualityBoostERC20toNativeInfo,
  [SwapProviderType.Sovryn]: sovrynInfo,
  [SwapProviderType.Astroport]: astroportInfo,
  [SwapProviderType.Hop]: hopInfo,
  [SwapProviderType.Jupiter]: jupiterInfo,
  [SwapProviderType.Symbiosis]: symbiosisInfo,
};

function getSwapProviderConfig(network: Network, providerId: SwapProviderType) {
  return buildConfig.swapProviders[network][providerId];
}

function getSwapProviderInfo(network: Network, providerId: SwapProviderType) {
  const config = getSwapProviderConfig(network, providerId);
  if (!config) {
    throw new Error(`Failed to retrieve swap provider config for \`${providerId}\` on ${network}`);
  }
  return swapProviderInfo[config.type];
}

const getLiqualityLiquidityForAsset = async ({
  asset,
  network,
}: {
  asset: string;
  network: Network;
}): Promise<number> => {
  const swapProvider = getSwapProvider(network, SwapProviderType.Liquality) as LiqualitySwapProvider;

  return swapProvider.getAssetLiquidity(asset);
};

export { getSwapProviderConfig, getSwapProviderInfo, getLiqualityLiquidityForAsset };
