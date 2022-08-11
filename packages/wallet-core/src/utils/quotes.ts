import { unitToCurrency } from '@liquality/cryptoassets';
import BN, { BigNumber } from 'bignumber.js';
import { Network } from '../store/types';
import { SwapQuote } from '../swaps/types';
import cryptoassets from './cryptoassets';

export function calculateQuoteRate(quote: SwapQuote) {
  const fromAmount = unitToCurrency(cryptoassets[quote.from], new BigNumber(quote.fromAmount));
  const toAmount = unitToCurrency(cryptoassets[quote.to], new BigNumber(quote.toAmount));
  return toAmount.div(fromAmount);
}

export function sortQuotes(quotes: SwapQuote[], _network: Network) {
  return quotes.slice(0).sort((a, b) => {
    return new BN(b.toAmount).minus(a.toAmount).toNumber();
  });
}
