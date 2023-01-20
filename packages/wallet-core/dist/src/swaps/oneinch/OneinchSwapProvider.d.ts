import { Client } from '@chainify/client';
import { EvmChainProvider, EvmTypes } from '@chainify/evm';
import { Transaction } from '@chainify/types';
import { ChainId } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import { ActionContext } from '../../store';
import { Network, SwapHistoryItem } from '../../store/types';
import { SwapProvider } from '../SwapProvider';
import { BaseSwapProviderConfig, EstimateFeeRequest, EstimateFeeResponse, NextSwapActionRequest, QuoteRequest, SwapRequest, SwapStatus } from '../types';
export interface OneinchSwapHistoryItem extends SwapHistoryItem {
    approveTxHash: string;
    swapTxHash: string;
    approveTx: Transaction<EvmTypes.EthersTransactionResponse>;
    swapTx: Transaction<EvmTypes.EthersTransactionResponse>;
    slippagePercentage: number;
}
export interface OneinchSwapProviderConfig extends BaseSwapProviderConfig {
    agent: string;
    routerAddress: string;
    referrerAddress: {
        [key in ChainId]?: string;
    };
    referrerFee: number;
}
declare class OneinchSwapProvider extends SwapProvider {
    config: OneinchSwapProviderConfig;
    private _httpClient;
    constructor(config: OneinchSwapProviderConfig);
    getSupportedPairs(): Promise<never[]>;
    getClient(network: Network, walletId: string, asset: string, accountId: string): Client<EvmChainProvider, import("@chainify/client").Wallet<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
    getQuote({ network, from, to, amount }: QuoteRequest): Promise<{
        fromAmount: string;
        toAmount: string;
    } | null>;
    approveTokens({ network, walletId, quote }: SwapRequest<OneinchSwapHistoryItem>): Promise<{
        status: string;
        approveTx: Transaction<any>;
        approveTxHash: string;
    }>;
    sendSwap({ network, walletId, quote }: SwapRequest<OneinchSwapHistoryItem>): Promise<{
        status: string;
        swapTx: Transaction<any>;
        swapTxHash: string;
    }>;
    newSwap({ network, walletId, quote }: SwapRequest<OneinchSwapHistoryItem>): Promise<{
        status: string;
        approveTx: Transaction<any>;
        approveTxHash: string;
        id: string;
        fee: number;
        slippage: number;
    } | {
        status: string;
        swapTx: Transaction<any>;
        swapTxHash: string;
        id: string;
        fee: number;
        slippage: number;
    }>;
    estimateFees({ network, txType, quote, feePrices, feePricesL1, }: EstimateFeeRequest<string, OneinchSwapHistoryItem>): Promise<EstimateFeeResponse | null>;
    getMin(_quoteRequest: QuoteRequest): Promise<BN>;
    private _getQuote;
    private _buildApproval;
    private _buildSwap;
    waitForApproveConfirmations({ swap, network, walletId }: NextSwapActionRequest<OneinchSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    waitForSwapConfirmations({ swap, network, walletId }: NextSwapActionRequest<OneinchSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    performNextSwapAction(store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<OneinchSwapHistoryItem>): Promise<Partial<{
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
export { OneinchSwapProvider };
