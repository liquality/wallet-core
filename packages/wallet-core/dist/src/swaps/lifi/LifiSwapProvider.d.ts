import { EvmTypes } from '@chainify/evm';
import { Transaction } from '@chainify/types';
import { Order, Step } from '@lifi/sdk';
import BN from 'bignumber.js';
import { ActionContext } from '../../store';
import { EvmSwapHistoryItem, EvmSwapProvider, EvmSwapProviderConfig } from '../EvmSwapProvider';
import { EstimateFeeRequest, EstimateFeeResponse, NextSwapActionRequest, QuoteRequest, SwapRequest, SwapStatus } from '../types';
export interface LifiSwapProviderConfig extends EvmSwapProviderConfig {
    apiURL: string;
    slippage?: number;
    order?: Order;
}
export interface LifiSwapHistoryItem extends EvmSwapHistoryItem {
    fromFundHash: string;
    fromFundTx: Transaction<EvmTypes.EthersTransactionResponse>;
}
export { Action as LifiToolAction, QuoteRequest as LifiQuoteRequest } from '@lifi/sdk';
declare class LifiSwapProvider extends EvmSwapProvider {
    readonly config: LifiSwapProviderConfig;
    readonly nativeAssetAddress = "0x0000000000000000000000000000000000000000";
    private readonly _lifiClient;
    private readonly _httpClient;
    constructor(config: LifiSwapProviderConfig);
    getSupportedPairs(): Promise<never[]>;
    getQuote({ network, from, to, amount, fromAccountId, toAccountId, walletId }: QuoteRequest): Promise<{
        from: string;
        to: string;
        fromAmount: string;
        toAmount: string;
        lifiRoute: Step;
    } | null>;
    newSwap(swap: SwapRequest<LifiSwapHistoryItem>): Promise<{
        status: string;
        approveTx: Transaction<any>;
        approveTxHash: string;
        id: string;
    } | {
        status: string;
        approveTx?: undefined;
        approveTxHash?: undefined;
        id: string;
    } | {
        status: string;
        fromFundTx: Transaction<any>;
        fromFundHash: string;
        id: string;
    }>;
    private initiateSwap;
    estimateFees(feeRequest: EstimateFeeRequest<string, LifiSwapHistoryItem>): Promise<EstimateFeeResponse | null>;
    getMin(_quoteRequest: QuoteRequest): Promise<BN>;
    private getCrossChainSwapStatus;
    private getChainNameByChainID;
    private isCrossSwap;
    private getRoute;
    waitForInitiationConfirmations({ swap, network, walletId }: NextSwapActionRequest<LifiSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    waitForReceiveConfirmations({ swap, network, walletId }: NextSwapActionRequest<LifiSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    performNextSwapAction(store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<LifiSwapHistoryItem>): Promise<Partial<{
        endTime: number;
        status: string;
    }> | undefined>;
    protected _getStatuses(): Record<string, SwapStatus>;
    protected _txTypes(): {
        SWAP: string;
    };
    protected _fromTxType(): string | null;
    protected _toTxType(): string | null;
    protected _timelineDiagramSteps(): string[];
    protected _totalSteps(): number;
}
export { LifiSwapProvider };
