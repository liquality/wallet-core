import _ from 'lodash';
import { ActionContext, rootActionContext } from '..';
import buildConfig from '../../build.config';
import { MarketData, Network } from '../types';

export const updateMarketData = async (
  context: ActionContext,
  { network }: { network: Network }
): Promise<{ network: Network; marketData: MarketData }> => {
  const { commit, getters } = rootActionContext(context);
  const supportedPairResponses = await Promise.all(
    Object.keys(buildConfig.swapProviders[network]).map((provider) => {
      const swapProvider = getters.swapProvider(network, provider);
      return swapProvider.getSupportedPairs({ network }).then((pairs) => pairs.map((pair) => ({ ...pair, provider })));
    })
  );
  const supportedPairs = _.flatten(supportedPairResponses);

  const marketData = supportedPairs;

  commit.UPDATE_MARKET_DATA({ network, marketData });

  return { network, marketData };
};
