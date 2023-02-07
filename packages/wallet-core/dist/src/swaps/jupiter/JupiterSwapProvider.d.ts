import BN from 'bignumber.js';
import { ActionContext } from '../../store';
import { SwapHistoryItem } from '../../store/types';
import { SwapProvider } from '../SwapProvider';
import { EstimateFeeRequest, EstimateFeeResponse, NextSwapActionRequest, QuoteRequest, SwapRequest, SwapStatus } from '../types';
export interface JupiterSwapHistoryItem extends SwapHistoryItem {
    info: object;
    swapTxHash: string;
}
declare class JupiterSwapProvider extends SwapProvider {
    protected _getStatuses(): Record<string, SwapStatus>;
    protected _txTypes(): Record<string, string | null>;
    protected _fromTxType(): string | null;
    protected _toTxType(): string | null;
    protected _totalSteps(): number;
    protected _timelineDiagramSteps(): string[];
    getSupportedPairs(): Promise<never[]>;
    getQuote(quoteRequest: QuoteRequest): Promise<{
        from: string;
        to: string;
        fromAmount: string;
        toAmount: any;
        info: any;
    } | null>;
    newSwap(quoteInput: SwapRequest<JupiterSwapHistoryItem>): Promise<{
        status: string;
        swapTx: import("@chainify/types").Transaction<any> | undefined;
        swapTxHash: string | undefined;
        id: string;
        fee: number;
        slippage: number;
    }>;
    estimateFees({ txType, feePrices, asset, network, }: EstimateFeeRequest<string, JupiterSwapHistoryItem>): Promise<EstimateFeeResponse | null>;
    getExtraAmountToExtractFromBalance(): number;
    performNextSwapAction(_store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<JupiterSwapHistoryItem>): Promise<Partial<{
        endTime: number;
        status: string;
    }> | undefined>;
    getMin(_quoteRequest: QuoteRequest): Promise<BN>;
    waitForSwapConfirmations({ swap, network, walletId }: NextSwapActionRequest<JupiterSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    private _getTransactions;
}
export { JupiterSwapProvider };
