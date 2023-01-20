import { Transaction } from '@chainify/types';
import BN from 'bignumber.js';
import { ActionContext } from '../../store';
import { EvmSwapHistoryItem, EvmSwapProvider, EvmSwapProviderConfig } from '../EvmSwapProvider';
import { EstimateFeeRequest, EstimateFeeResponse, NextSwapActionRequest, QuoteRequest, SwapRequest, SwapStatus } from '../types';
export declare enum LiqualityTxTypes {
    SWAP_INITIATION = "SWAP_INITIATION",
    SWAP_CLAIM = "SWAP_CLAIM"
}
export interface LiqualityMarketData {
    from: string;
    to: string;
    status: string;
    updatedAt: Date;
    createdAt: Date;
    max: number;
    min: number;
    minConf: number;
    rate: number;
}
export interface LiqualitySwapHistoryItem extends EvmSwapHistoryItem {
    orderId: string;
    fromAddress: string;
    toAddress: string;
    fromCounterPartyAddress: string;
    toCounterPartyAddress: string;
    secretHash: string;
    secret: string;
    expiresAt: number;
    swapExpiration: number;
    nodeSwapExpiration: number;
    fromFundHash: string;
    fromFundTx: Transaction;
    refundTx: Transaction;
    refundHash: string;
    toClaimTx: Transaction;
    toClaimHash: string;
    toFundHash: string;
}
export interface LiqualitySwapProviderConfig extends EvmSwapProviderConfig {
    agent: string;
}
export declare class LiqualitySwapProvider extends EvmSwapProvider {
    config: LiqualitySwapProviderConfig;
    private _httpClient;
    constructor(config: LiqualitySwapProviderConfig);
    private getMarketInfo;
    getAssetLiquidity(asset: string): Promise<number>;
    getSupportedPairs(): Promise<{
        from: string;
        to: string;
        min: string;
        max: string;
        rate: string;
    }[]>;
    getQuote({ network, from, to, amount }: QuoteRequest): Promise<{
        fromAmount: string;
        toAmount: string;
        min: BN;
        max: BN;
    } | null>;
    newSwap(swapRequest: SwapRequest<LiqualitySwapHistoryItem>): Promise<{
        status: string;
        approveTx: Transaction<any>;
        approveTxHash: string;
        id: string;
    } | {
        status: string;
        approveTx?: undefined;
        approveTxHash?: undefined;
        id: string;
    }>;
    private initiateSwap;
    estimateFees({ network, walletId, asset, txType, quote, feePrices, max, }: EstimateFeeRequest<LiqualityTxTypes>): Promise<EstimateFeeResponse>;
    getMin(quoteRequest: QuoteRequest): Promise<BN>;
    updateOrder(order: LiqualitySwapHistoryItem): Promise<any>;
    waitForClaimConfirmations({ swap, network, walletId }: NextSwapActionRequest<LiqualitySwapHistoryItem>): Promise<{
        status: string;
    } | {
        endTime: number;
        status: string;
    } | undefined>;
    performNextSwapAction(store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<LiqualitySwapHistoryItem>): Promise<Partial<{
        status: string;
    }> | undefined>;
    protected _getStatuses(): Record<string, SwapStatus>;
    protected _txTypes(): typeof LiqualityTxTypes;
    protected _fromTxType(): LiqualityTxTypes | null;
    protected _toTxType(): LiqualityTxTypes | null;
    protected _timelineDiagramSteps(): string[];
    protected _totalSteps(): number;
    private _getQuote;
    private waitForRefund;
    private waitForRefundConfirmations;
    private refundSwap;
    private reportInitiation;
    private confirmInitiation;
    private findCounterPartyInitiation;
    private confirmCounterPartyInitiation;
    private claimSwap;
    private hasQuoteExpired;
    private hasChainTimePassed;
    private canRefund;
    private hasSwapExpired;
    private handleExpirations;
    private feeUnits;
}
