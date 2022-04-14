import { unitToCurrency } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import { Network } from '../store/types';
import { SwapQuote } from '../swaps/SwapProvider';
import cryptoassets from './cryptoassets';
import { SwapProviderType } from './swapProviderType';
import { getSwapProviderConfig } from './swaps';

export function calculateQuoteRate(quote: SwapQuote) {
  const fromAmount = unitToCurrency(cryptoassets[quote.from], quote.fromAmount);
  const toAmount = unitToCurrency(cryptoassets[quote.to], quote.toAmount);
  return toAmount.div(fromAmount);
}

export function sortQuotes(quotes: SwapQuote[], network: Network) {
  return quotes.slice(0).sort((a, b) => {
    const isCrossChain = cryptoassets[a.from].chain !== cryptoassets[a.to].chain;
    if (isCrossChain) {
      // Prefer Liquality for crosschain swaps where liquidity is available
      if (getSwapProviderConfig(network, a.provider).type === SwapProviderType.LIQUALITY) return -1;
      else if (getSwapProviderConfig(network, b.provider).type === SwapProviderType.LIQUALITY) return 1;
    }

    return new BN(b.toAmount).minus(a.toAmount).toNumber();
  });
}
