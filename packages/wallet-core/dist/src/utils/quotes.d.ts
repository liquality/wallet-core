import BN from 'bignumber.js';
import { Network } from '../store/types';
import { SwapQuote } from '../swaps/types';
export declare function calculateQuoteRate(quote: SwapQuote): BN;
export declare function sortQuotes(quotes: SwapQuote[], _network: Network): SwapQuote[];
