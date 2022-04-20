import BigNumber from 'bignumber.js';
import Bluebird from 'bluebird';
import { ActionContext, rootActionContext } from '..';
import buildConfig from '../../build.config';
import { SwapQuote } from '../../swaps/types';
import { AccountId, Asset, Network } from '../types';

export const getQuotes = async (
  context: ActionContext,
  {
    network,
    from,
    to,
    fromAccountId,
    toAccountId,
    // Amount is string because in some contexts, it is passed over messages not supporting full objects
    amount,
  }: { network: Network; from: Asset; to: Asset; fromAccountId: AccountId; toAccountId: AccountId; amount: string }
): Promise<SwapQuote[]> => {
  if (!amount) {
    return [];
  }
  const { getters } = rootActionContext(context);
  const quotes = await Bluebird.map(
    Object.keys(buildConfig.swapProviders[network]),
    async (provider) => {
      const swapProvider = getters.swapProvider(network, provider);
      // Quote errors should not halt the process
      const quote = await swapProvider
        .getQuote({ network, from, to, amount: new BigNumber(amount) })
        .catch(console.error);
      return quote ? { ...quote, provider, fromAccountId, toAccountId } : null;
    },
    { concurrency: 5 }
  );

  // Null quotes filtered
  return quotes.filter((quote) => quote) as SwapQuote[];
};
