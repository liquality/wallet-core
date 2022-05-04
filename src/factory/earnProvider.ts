import buildConfig from '../build.config';
import { AnchorEarnProvider } from '../earn/anchor/AnchorEarnProvider';
import { EarnProvider } from '../earn/EarnProvider';
import { EarnProviderType, Network } from '../store/types';

const providers = {
  [EarnProviderType.Anchor]: AnchorEarnProvider,
};

const createEarnProvider = (network: Network, asset: string) => {
  const earnProviderConfig = buildConfig.earnProviders[network][asset];
  const EarnProvider = providers[earnProviderConfig.type];
  // @ts-ignore TODO: i'll fix it
  return new EarnProvider({ ...swapProviderConfig, asset });
};

const earnProviderCache: { [key: string]: EarnProvider } = {};

function getEarnProvider(network: Network, asset: string): EarnProvider {
  const cacheKey = [network, asset].join('-');

  const cachedEarnProvider = earnProviderCache[cacheKey];
  if (cachedEarnProvider) return cachedEarnProvider;

  const earnProvider = createEarnProvider(network, asset);
  earnProviderCache[cacheKey] = earnProvider;

  return earnProvider;
}

export { getEarnProvider };
