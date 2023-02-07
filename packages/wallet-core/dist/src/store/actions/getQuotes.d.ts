import { ActionContext } from '..';
import { GetQuotesRequest, SwapQuote } from '../../swaps/types';
export declare type RequestId = string;
export declare type SlowQuotesCallback = (quotes: SwapQuote[]) => void;
export interface GetQuotesResult {
    requestId: RequestId;
    hasSlowQuotes: boolean;
    quotes: SwapQuote[];
}
export declare const getQuotes: (_context: ActionContext, { network, from, to, fromAccountId, toAccountId, walletId, amount, slowQuoteThreshold, }: GetQuotesRequest) => Promise<GetQuotesResult>;
export declare const getSlowQuotes: (_context: ActionContext, { requestId }: {
    requestId: RequestId;
}) => Promise<SwapQuote[]>;
