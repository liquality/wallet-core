import BN from 'bignumber.js';
import { SwapProvider } from '../SwapProvider';
import { BaseSwapProviderConfig, EstimateFeeRequest, EstimateFeeResponse, NextSwapActionRequest, QuoteRequest, SwapQuote, SwapStatus } from '../types';
import { Network, SwapHistoryItem, WalletId } from '../../store/types';
import { Transaction } from '@chainify/types';
import { EvmChainProvider, EvmTypes } from '@chainify/evm';
import { ActionContext } from '../../store';
import { Client } from '@chainify/client';
import { DebridgeAPIErrorParser } from '@liquality/error-parser';
interface BuildSwapQuote extends SwapQuote {
    fee?: number;
}
interface BuildSwapRequest {
    network: Network;
    walletId: WalletId;
    quote: BuildSwapQuote;
}
export interface DebridgeSwapHistoryItem extends SwapHistoryItem {
    approveTxHash: string;
    approveTx: Transaction<EvmTypes.EthersTransactionResponse>;
    fromFundHash: string;
    fromFundTx: Transaction<EvmTypes.EthersTransactionResponse>;
}
export interface DebridgeSwapProviderConfig extends BaseSwapProviderConfig {
    routerAddress: string;
    chains: {
        [key in number]: {
            deBridgeGateAddress: string;
            signatureVerifier: string;
            minBlockConfirmation: number;
        };
    };
}
declare class DeBridgeSwapProvider extends SwapProvider {
    config: DebridgeSwapProviderConfig;
    debridgeApiErrorParser: DebridgeAPIErrorParser;
    constructor(config: DebridgeSwapProviderConfig);
    getQuote({ network, from, to, amount }: QuoteRequest): Promise<{
        from: string;
        to: string;
        fromAmount: string;
        toAmount: string;
    } | null>;
    estimateFees({ network, walletId, asset, quote, feePrices }: EstimateFeeRequest): Promise<EstimateFeeResponse | null>;
    newSwap({ network, walletId, quote }: BuildSwapRequest): Promise<{
        status: string;
        approveTx?: undefined;
        approveTxHash?: undefined;
        id: string;
        fee: number | undefined;
        slippage: number;
    } | {
        status: string;
        approveTx: Transaction<any>;
        approveTxHash: string;
        id: string;
        fee: number | undefined;
        slippage: number;
    } | {
        status: string;
        fromFundTx: Transaction<any>;
        fromFundHash: string;
        id: string;
        fee: number | undefined;
        slippage: number;
    }>;
    performNextSwapAction(store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<DebridgeSwapHistoryItem>): Promise<Partial<{
        endTime: number;
        status: string;
    }> | undefined>;
    waitForSwapConfirmations({ swap, network, walletId }: NextSwapActionRequest<DebridgeSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    private getConfirmationsCount;
    getSupportedPairs(): Promise<never[]>;
    getMin(_quoteRequest: QuoteRequest): Promise<BN>;
    getClient(network: Network, walletId: string, asset: string, accountId: string): Client<EvmChainProvider, import("@chainify/client").Wallet<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
    private buildApprovalTx;
    private requiresApproval;
    private approveTokens;
    private loadSwapTx;
    private sendSwap;
    private waitForApproveConfirmations;
    private waitForSwapExecution;
    private getFullSubmissionInfo;
    private getSubmissionId;
    protected _txTypes(): {
        SWAP: string;
    };
    protected _fromTxType(): string | null;
    protected _toTxType(): string | null;
    protected _totalSteps(): number;
    protected _timelineDiagramSteps(): string[];
    protected _getStatuses(): Record<string, SwapStatus>;
    private getGasLimit;
}
export { DeBridgeSwapProvider };
