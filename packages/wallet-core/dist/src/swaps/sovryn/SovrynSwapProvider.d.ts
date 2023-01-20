import { Client } from '@chainify/client';
import { EvmChainProvider, EvmTypes } from '@chainify/evm';
import { Transaction } from '@chainify/types';
import BN from 'bignumber.js';
import * as ethers from 'ethers';
import { ActionContext } from '../../store';
import { Asset, Network, SwapHistoryItem } from '../../store/types';
import { SwapProvider } from '../SwapProvider';
import { BaseSwapProviderConfig, EstimateFeeRequest, EstimateFeeResponse, NextSwapActionRequest, QuoteRequest, SwapRequest, SwapStatus } from '../types';
export interface SovrynSwapProviderConfig extends BaseSwapProviderConfig {
    routerAddress: string;
    routerAddressRBTC: string;
    rpcURL: string;
}
export interface SovrynSwapHistoryItem extends SwapHistoryItem {
    approveTxHash: string;
    swapTxHash: string;
    approveTx: Transaction<EvmTypes.EthersTransactionResponse>;
    swapTx: Transaction<EvmTypes.EthersTransactionResponse>;
}
declare class SovrynSwapProvider extends SwapProvider {
    config: SovrynSwapProviderConfig;
    _apiCache: {
        [key: number]: ethers.ethers.providers.StaticJsonRpcProvider;
    };
    constructor(config: SovrynSwapProviderConfig);
    getSupportedPairs(): Promise<never[]>;
    getClient(network: Network, walletId: string, asset: string, accountId: string): Client<EvmChainProvider, import("@chainify/client").Wallet<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
    getQuote({ network, from, to, amount }: QuoteRequest): Promise<{
        fromAmount: string;
        toAmount: string;
        path: any;
    } | null>;
    newSwap({ network, walletId, quote }: SwapRequest<SovrynSwapHistoryItem>): Promise<{
        status: string;
        approveTx?: undefined;
        approveTxHash?: undefined;
        id: string;
        fee: number;
        slippage: number;
    } | {
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
    requiresApproval({ network, walletId, quote }: SwapRequest<SovrynSwapHistoryItem>): Promise<boolean>;
    buildApprovalTx({ network, walletId, quote }: SwapRequest<SovrynSwapHistoryItem>): Promise<{
        from: string;
        to: string;
        value: BN;
        data: string;
        fee: number;
    }>;
    approveTokens({ network, walletId, quote }: SwapRequest<SovrynSwapHistoryItem>): Promise<{
        status: string;
        approveTx?: undefined;
        approveTxHash?: undefined;
    } | {
        status: string;
        approveTx: Transaction<any>;
        approveTxHash: string;
    }>;
    buildSwapTx({ network, walletId, quote }: SwapRequest<SovrynSwapHistoryItem>): Promise<{
        from: string;
        to: string;
        value: BN;
        data: string;
        fee: number;
    }>;
    sendSwap({ network, walletId, quote }: SwapRequest<SovrynSwapHistoryItem>): Promise<{
        status: string;
        swapTx: Transaction<any>;
        swapTxHash: string;
    }>;
    estimateFees({ network, walletId, asset, txType, quote, feePrices, }: EstimateFeeRequest<string, SovrynSwapHistoryItem>): Promise<EstimateFeeResponse>;
    getMin(_quoteRequest: QuoteRequest): Promise<BN>;
    waitForApproveConfirmations({ swap, network, walletId }: NextSwapActionRequest<SovrynSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    waitForSwapConfirmations({ swap, network, walletId }: NextSwapActionRequest<SovrynSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    performNextSwapAction(store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<SovrynSwapHistoryItem>): Promise<Partial<{
        endTime: number;
        status: string;
    }> | undefined>;
    _getApi(network: Network, asset: Asset): ethers.ethers.providers.StaticJsonRpcProvider;
    _calculateSlippage(amount: string): string;
    protected _getStatuses(): Record<string, SwapStatus>;
    protected _txTypes(): {
        SWAP: string;
    };
    protected _fromTxType(): string | null;
    protected _toTxType(): string | null;
    protected _timelineDiagramSteps(): string[];
    protected _totalSteps(): number;
}
export { SovrynSwapProvider };
