import { unitToCurrency } from '@liquality/cryptoassets';
import BN, { BigNumber } from 'bignumber.js';
import { Network, SwapProviderType } from '../store/types';
import { SwapQuote } from '../swaps/types';
import { getSwapProviderConfig } from '../swaps/utils';
import cryptoassets from './cryptoassets';

export function calculateQuoteRate(quote: SwapQuote) {
  const fromAmount = unitToCurrency(cryptoassets[quote.from], new BigNumber(quote.fromAmount));
  const toAmount = unitToCurrency(cryptoassets[quote.to], new BigNumber(quote.toAmount));
  return toAmount.div(fromAmount);
}

export function sortQuotes(quotes: SwapQuote[], network: Network) {
  return quotes.slice(0).sort((a, b) => {
    const isCrossChain = cryptoassets[a.from].chain !== cryptoassets[a.to].chain;
    if (isCrossChain) {
      // Prefer Liquality for crosschain swaps where liquidity is available
      if (getSwapProviderConfig(network, a.provider).type === SwapProviderType.Liquality) return -1;
      else if (getSwapProviderConfig(network, b.provider).type === SwapProviderType.Liquality) return 1;
    }

    return new BN(b.toAmount).minus(a.toAmount).toNumber();
  });
}
