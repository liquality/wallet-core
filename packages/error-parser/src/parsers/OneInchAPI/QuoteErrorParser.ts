import { OneInchSwapErrorParser } from './SwapErrorParser';
import { oneInchSwapSourceName } from '.';

export class OneInchQuoteErrorParser extends OneInchSwapErrorParser {
  public static readonly errorSource = oneInchSwapSourceName;
}
