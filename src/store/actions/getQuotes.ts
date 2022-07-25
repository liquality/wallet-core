import BigNumber from 'bignumber.js';
import Bluebird from 'bluebird';
import { ActionContext } from '..';
import buildConfig from '../../build.config';
import { getSwapProvider } from '../../factory/swap';
import { SwapQuote } from '../../swaps/types';
import { AccountId, Asset, Network } from '../types';

// TODO: is this an action at this point? Or should it be in utils
export const getQuotes = async (
  _context: ActionContext,
  {
    network,
    from,
    to,
    fromAccountId,
    toAccountId,
    // Amount is string because in some contexts, it is passed over messages not supporting full objects
    amount,
    walletId,
  }: {
    network: Network;
    from: Asset;
    to: Asset;
    fromAccountId: AccountId;
    toAccountId: AccountId;
    amount: string;
    walletId?: string;
  }
): Promise<SwapQuote[]> => {
  if (!amount) {
    return [];
  }
  const quotes = await Bluebird.map(
    Object.keys(buildConfig.swapProviders[network]),
    async (provider) => {
      const swapProvider = getSwapProvider(network, provider);
      // Quote errors should not halt the process
      const quote = await swapProvider
        .getQuote({ network, from, to, amount: new BigNumber(amount), fromAccountId, toAccountId, walletId })
        .catch(console.error);
      return quote ? { ...quote, provider, fromAccountId, toAccountId } : null;
    },
    { concurrency: 5 }
  );

  // Null quotes filtered
  return quotes.filter((quote) => quote) as SwapQuote[];
};
