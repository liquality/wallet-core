import { ActionContext } from '..';
import { SwapHistoryItem } from '../types';
export declare const retrySwap: (context: ActionContext, { swap }: {
    swap: SwapHistoryItem;
}) => Promise<Partial<SwapHistoryItem> | undefined>;
