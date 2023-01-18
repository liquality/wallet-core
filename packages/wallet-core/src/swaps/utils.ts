import buildConfig from '../build.config';
import { getSwapProvider } from '../factory';
import { Network, SwapProviderType } from '../store/types';
import astroportInfo from './astroport/info.json';
import fastbtcInfo from './fastbtc/info.json';
import hopInfo from './hop/info.json';
import lifiInfo from './lifi/info.json';
import jupiterInfo from './jupiter/info.json';
import liqualityInfo from './liquality/info.json';
import liqualityBoostERC20toNativeInfo from './liqualityboost/liqualityBoostERC20toNative/info.json';
import liqualityBoostNativeToERC20Info from './liqualityboost/liqualityBoostNativeToERC20/info.json';
import oneinchInfo from './oneinch/info.json';
import sovrynInfo from './sovryn/info.json';
import thorchainInfo from './thorchain/info.json';
import uniswapInfo from './uniswap/info.json';
import debridgeInfo from './debridge/info.json';
import teleswapInfo from './teleswap/info.json';
import { LiqualitySwapProvider } from './liquality/LiqualitySwapProvider';
import { CUSTOM_ERRORS, createInternalError } from '@liquality/error-parser';

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
  [SwapProviderType.DeBridge]: debridgeInfo,
  [SwapProviderType.LiFi]: lifiInfo,
  [SwapProviderType.TeleSwap]: teleswapInfo,
};

function getSwapProviderConfig(network: Network, providerId: SwapProviderType) {
  return buildConfig.swapProviders[network][providerId];
}

function getSwapProviderInfo(network: Network, providerId: SwapProviderType) {
  const config = getSwapProviderConfig(network, providerId);
  if (!config) {
    throw createInternalError(CUSTOM_ERRORS.NotFound.SwapProvider.Config(providerId, network));
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
