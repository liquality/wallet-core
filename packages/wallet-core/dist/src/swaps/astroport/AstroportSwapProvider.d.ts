import { TerraTypes } from '@chainify/terra';
import { Transaction } from '@chainify/types';
import { IAsset } from '@liquality/cryptoassets';
import { LCDClient } from '@terra-money/terra.js';
import BN from 'bignumber.js';
import { ActionContext } from '../../store';
import { SwapHistoryItem } from '../../store/types';
import { SwapProvider } from '../SwapProvider';
import { EstimateFeeRequest, EstimateFeeResponse, NextSwapActionRequest, QuoteRequest, SwapRequest, SwapStatus } from '../types';
interface RateResponse {
    amount: number;
    return_amount: number;
}
interface AstroportSwapHistoryItem extends SwapHistoryItem {
    swapTxHash: string;
    swapTx: Transaction<TerraTypes.TerraTxRequest>;
    fromTokenAddress: string;
    toTokenAddress: string;
    pairAddress: string;
}
declare class AstroportSwapProvider extends SwapProvider {
    getSupportedPairs(): Promise<never[]>;
    getQuote(quoteRequest: QuoteRequest): Promise<{
        fromAmount: string;
        toAmount: string;
        fromTokenAddress: string | undefined;
        toTokenAddress: string | undefined;
        pairAddress: string;
    } | null>;
    newSwap({ network, walletId, quote }: SwapRequest<AstroportSwapHistoryItem>): Promise<{
        status: string;
        swapTx: any;
        swapTxHash: any;
        id: string;
        fee: number;
        slippage: number;
    }>;
    waitForSwapConfirmations({ swap, network, walletId }: NextSwapActionRequest<AstroportSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    performNextSwapAction(_store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<AstroportSwapHistoryItem>): Promise<Partial<{
        endTime: number;
        status: string;
    }> | undefined>;
    getSwapLimit(): number;
    estimateFees({ asset, txType, quote, feePrices, network }: EstimateFeeRequest): Promise<EstimateFeeResponse>;
    getMin(_quoteRequest: QuoteRequest): Promise<BN>;
    _getRPC(): LCDClient;
    _getDenom(asset: string): string | undefined;
    _getSwapRate(fromAmount: string, fromInfo: IAsset, toInfo: IAsset): Promise<{
        rate: RateResponse;
        fromTokenAddress: string | undefined;
        toTokenAddress: string | undefined;
        pairAddress: string;
    }>;
    _getPairAddress(tokenAddress: string): Promise<string>;
    protected _getStatuses(): Record<string, SwapStatus>;
    protected _txTypes(): {
        SWAP: string;
    };
    protected _fromTxType(): string;
    protected _toTxType(): null;
    protected _timelineDiagramSteps(): string[];
    protected _totalSteps(): number;
}
export { AstroportSwapProvider };
