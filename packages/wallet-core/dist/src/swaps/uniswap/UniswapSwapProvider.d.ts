import { Client } from '@chainify/client';
import { EvmChainProvider, EvmTypes } from '@chainify/evm';
import { Transaction } from '@chainify/types';
import { CurrencyAmount, Token } from '@uniswap/sdk-core';
import BN from 'bignumber.js';
import { ActionContext } from '../../store';
import { Asset, Network, SwapHistoryItem, WalletId } from '../../store/types';
import { SwapProvider } from '../SwapProvider';
import { ActionStatus, BaseSwapProviderConfig, EstimateFeeRequest, EstimateFeeResponse, NextSwapActionRequest, QuoteRequest, SwapQuote, SwapRequest, SwapStatus } from '../types';
export interface UniswapSwapProviderConfig extends BaseSwapProviderConfig {
    routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
}
export interface UniswapSwapHistoryItem extends SwapHistoryItem {
    approveTxHash: string;
    swapTxHash: string;
    approveTx: Transaction<EvmTypes.EthersTransactionResponse>;
    swapTx: Transaction<EvmTypes.EthersTransactionResponse>;
}
interface BuildSwapQuote extends SwapQuote {
    fee?: number;
}
interface BuildSwapRequest {
    network: Network;
    walletId: WalletId;
    quote: BuildSwapQuote;
}
declare class UniswapSwapProvider extends SwapProvider {
    config: UniswapSwapProviderConfig;
    _apiCache: any;
    constructor(config: UniswapSwapProviderConfig);
    getClient(network: Network, walletId: string, asset: string, accountId: string): Client<EvmChainProvider, import("@chainify/client").Wallet<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
    getSupportedPairs(): Promise<never[]>;
    getApi(network: Network, asset: Asset): any;
    getUniswapToken(chainId: number, asset: Asset): Token;
    getMinimumOutput(outputAmount: CurrencyAmount<Token>): CurrencyAmount<Token>;
    getChainId(asset: Asset, network: Network): number;
    getQuote({ network, from, to, amount }: QuoteRequest): Promise<{
        fromAmount: string;
        toAmount: string;
    } | null>;
    requiresApproval({ network, walletId, quote }: {
        network: Network;
        walletId: WalletId;
        quote: SwapQuote;
    }): Promise<boolean>;
    buildApprovalTx({ network, walletId, quote }: BuildSwapRequest): Promise<{
        from: string;
        to: string;
        value: BN;
        data: string;
        fee: number | undefined;
    }>;
    approveTokens({ network, walletId, quote }: SwapRequest): Promise<{
        status: string;
        approveTx?: undefined;
        approveTxHash?: undefined;
    } | {
        status: string;
        approveTx: Transaction<any>;
        approveTxHash: string;
    }>;
    buildSwapTx({ network, walletId, quote }: BuildSwapRequest, supportingFeeOnTransferTokens?: boolean): Promise<{
        from: string;
        to: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
        value: BN;
        data: string;
        fee: number | undefined;
    }>;
    sendSwap({ network, walletId, quote }: SwapRequest): Promise<{
        status: string;
        swapTx: Transaction<any>;
        swapTxHash: string;
    }>;
    _sendSwap({ network, walletId, quote }: SwapRequest, supportingFeeOnTransferTokens?: boolean): Promise<Transaction<any>>;
    newSwap({ network, walletId, quote }: SwapRequest): Promise<{
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
    estimateFees({ network, walletId, asset, txType, quote, feePrices }: EstimateFeeRequest): Promise<EstimateFeeResponse>;
    getMin(_quoteRequest: QuoteRequest): Promise<BN>;
    waitForApproveConfirmations({ swap, network, walletId }: NextSwapActionRequest<UniswapSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    waitForSwapConfirmations({ swap, network, walletId }: NextSwapActionRequest<UniswapSwapHistoryItem>): Promise<ActionStatus | undefined>;
    performNextSwapAction(store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<UniswapSwapHistoryItem>): Promise<Partial<{
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
export { UniswapSwapProvider };
