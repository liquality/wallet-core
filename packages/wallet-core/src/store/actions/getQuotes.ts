import { sleep } from '@chainify/utils';
import BigNumber from 'bignumber.js';
import Bluebird from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { ActionContext } from '..';
import buildConfig from '../../build.config';
import { getSwapProvider } from '../../factory/swap';
import { QuoteRequestUIData, SwapQuote } from '../../swaps/types';
import { SwapProviderType } from '../types';

export type RequestId = string;

export type SlowQuotesCallback = (quotes: SwapQuote[]) => void;

export interface GetQuotesResult {
  requestId: RequestId;
  quotes: SwapQuote[];
}

const slowQuotesCallbacks: {
  [requestId: RequestId]: SlowQuotesCallback;
} = {};

// TODO: is this an action at this point? Or should it be in utils
// Get all quotes that can be resolved before `slowQuoteThreshold``. Slow quotes can be retrieved using `getSlowQuotes`
export const getQuotes = async (
  _context: ActionContext,
  {
    network,
    from,
    to,
    fromAccountId,
    toAccountId,
    walletId,
    // Amount is string because in some contexts, it is passed over messages not supporting full objects
    amount,
    slowQuoteThreshold = 5000,
  }: QuoteRequestUIData
): Promise<GetQuotesResult> => {
  const requestId = uuidv4();
  if (!amount) {
    return {
      requestId,
      quotes: [],
    };
  }

  const quotes: SwapQuote[] = [];
  const slowQuotes: SwapQuote[] = [];
  let hasSlowQuotes = false;

  const getAllQuotes = (async () => {
    return Bluebird.map(
      Object.keys(buildConfig.swapProviders[network]),
      async (provider: SwapProviderType) => {
        const swapProvider = getSwapProvider(network, provider);
        // Quote errors should not halt the process
        const quote = await swapProvider
          .getQuote({ network, from, to, amount: new BigNumber(amount), fromAccountId, toAccountId, walletId })
          .catch(console.error);

        if (!quote) {
          return null;
        }

        const result = { ...quote, from, to, provider, fromAccountId, toAccountId };

        if (quote) {
          if (hasSlowQuotes) {
            slowQuotes.push(result);
          } else {
            quotes.push(result);
          }
        }

        return result;
      },
      { concurrency: 5 }
    );
  })().then(() => {
    if (hasSlowQuotes && slowQuotesCallbacks[requestId]) {
      slowQuotesCallbacks[requestId](slowQuotes);
      delete slowQuotesCallbacks[requestId];
    }
  });

  const fastQuotes = await Promise.race([
    // Resolve this promise maximum at `slowQuoteThreshold` and leave slower quotes to the secondary `getSlowQuotes` function
    getAllQuotes.then(() => false),
    sleep(slowQuoteThreshold).then(() => true),
  ]).then((timedOut) => {
    hasSlowQuotes = timedOut;
    return quotes;
  });

  return {
    requestId,
    quotes: fastQuotes,
  };
};

export const getSlowQuotes = async (
  _context: ActionContext,
  { requestId }: { requestId: RequestId }
): Promise<SwapQuote[]> => {
  return new Promise((resolve, _reject) => {
    slowQuotesCallbacks[requestId] = (quotes) => resolve(quotes);
  });
};
