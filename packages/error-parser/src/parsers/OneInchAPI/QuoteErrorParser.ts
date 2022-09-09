import { OneInchSwapErrorParser } from './SwapErrorParser';

export class OneInchQuoteErrorParser extends OneInchSwapErrorParser {}

OneInchQuoteErrorParser.prototype.errorSource = 'OneInchQuoteAPI';
