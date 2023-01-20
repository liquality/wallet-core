import { Transaction } from '@chainify/types';
import { ThorchainAPIErrorParser } from '@liquality/error-parser';
import BN, { BigNumber } from 'bignumber.js';
import { ActionContext } from '../../store';
import { Asset, Network, SwapHistoryItem, WalletId } from '../../store/types';
import { SwapProvider } from '../SwapProvider';
import { BaseSwapProviderConfig, EstimateFeeRequest, EstimateFeeResponse, NextSwapActionRequest, QuoteRequest, SwapQuote, SwapRequest, SwapStatus } from '../types';
export interface ThorchainSwapProviderConfig extends BaseSwapProviderConfig {
    thornode: string;
}
export interface ThorchainPool {
    balance_rune: string;
    balance_asset: string;
    asset: string;
    LP_units: string;
    pool_units: string;
    status: string;
    synth_units: string;
    synth_supply: string;
    pending_inbound_rune: string;
    pending_inbound_asset: string;
}
export interface ThorchainInboundAddress {
    chain: string;
    pub_key: string;
    address: string;
    halted: boolean;
    gas_rate: string;
    router?: string;
}
export interface ThorchainTx {
    id: string;
    chain: string;
    from_address: string;
    to_address: string;
    coins: {
        asset: string;
        amount: string;
    }[];
    gas: {
        asset: string;
        amount: string;
    }[];
    memo: string;
}
export interface ThorchainObservedTx {
    tx: ThorchainTx;
    status: string;
    block_height: number;
    signers: string[];
    observed_pub_key: string;
    finalise_height: number;
    out_hashes: string[];
}
export interface ThorchainTransactionResponse {
    keysign_metric: {
        tx_id: string;
        node_tss_times?: any;
    };
    observed_tx: ThorchainObservedTx;
}
export declare enum ThorchainTxTypes {
    SWAP = "SWAP"
}
export interface ThorchainSwapHistoryItem extends SwapHistoryItem {
    receiveFee: string;
    approveTxHash: string;
    approveTx: Transaction;
    fromFundHash: string;
    fromFundTx: Transaction;
    receiveTxHash: string;
    receiveTx: Transaction;
}
export interface ThorchainSwapQuote extends SwapQuote {
    receiveFee: string;
    slippage: number;
}
declare class ThorchainSwapProvider extends SwapProvider {
    config: ThorchainSwapProviderConfig;
    private _httpClient;
    thorchainAPIErrorParser: ThorchainAPIErrorParser;
    constructor(config: ThorchainSwapProviderConfig);
    getSupportedPairs(): Promise<never[]>;
    _getPools(): Promise<ThorchainPool[]>;
    _getInboundAddresses(): Promise<ThorchainInboundAddress[]>;
    _getTransaction(hash: string): Promise<ThorchainTransactionResponse | null>;
    getInboundAddress(chain: string): Promise<ThorchainInboundAddress>;
    getRouterAddress(chain: string): Promise<string>;
    getOutput({ from, to, fromAmountInUnit, slippage, network, }: {
        from: Asset;
        to: Asset;
        fromAmountInUnit: BigNumber;
        slippage: number;
        network: Network;
    }): Promise<BN | null>;
    getQuote(quoteRequest: QuoteRequest): Promise<{
        fromAmount: string;
        toAmount: string;
        slippage: number;
    } | null>;
    networkFees(asset: Asset, network: Network): Promise<{
        type: import("@xchainjs/xchain-util").Denomination.Base;
        amount: () => BN;
        plus: (value: BN.Value | any, decimal?: number | undefined) => any;
        minus: (value: BN.Value | any, decimal?: number | undefined) => any;
        times: (value: BN.Value | any, decimal?: number | undefined) => any;
        div: (value: BN.Value | any, decimal?: number | undefined) => any;
        gt: (value: BN.Value | any) => boolean;
        gte: (value: BN.Value | any) => boolean;
        lt: (value: BN.Value | any) => boolean;
        lte: (value: BN.Value | any) => boolean;
        eq: (value: BN.Value | any) => boolean;
        decimal: number;
    } | undefined>;
    approveTokens({ network, walletId, swap }: NextSwapActionRequest<ThorchainSwapHistoryItem>): Promise<{
        status: string;
        approveTx?: undefined;
        approveTxHash?: undefined;
    } | {
        status: string;
        approveTx: Transaction<any>;
        approveTxHash: string;
    }>;
    sendBitcoinSwap({ quote, network, walletId, memo, }: {
        quote: ThorchainSwapHistoryItem;
        network: Network;
        walletId: WalletId;
        memo: string;
    }): Promise<Transaction<any>>;
    sendEthereumSwap({ quote, network, walletId, memo, }: {
        quote: ThorchainSwapHistoryItem;
        network: Network;
        walletId: WalletId;
        memo: string;
    }): Promise<Transaction<any>>;
    makeMemo({ network, walletId, swap }: NextSwapActionRequest<ThorchainSwapQuote>): Promise<string>;
    sendSwap({ network, walletId, swap }: NextSwapActionRequest<ThorchainSwapHistoryItem>): Promise<{
        status: string;
        fromFundTx: Transaction<any>;
        fromFundHash: string;
    }>;
    newSwap({ network, walletId, quote }: SwapRequest<ThorchainSwapHistoryItem>): Promise<{
        status: string;
        approveTx?: undefined;
        approveTxHash?: undefined;
        id: string;
        fee: number;
    } | {
        status: string;
        approveTx: Transaction<any>;
        approveTxHash: string;
        id: string;
        fee: number;
    } | {
        status: string;
        fromFundTx: Transaction<any>;
        fromFundHash: string;
        id: string;
        fee: number;
    }>;
    estimateFees({ network, walletId, asset, txType, quote, feePrices, max, }: EstimateFeeRequest<ThorchainTxTypes, ThorchainSwapQuote>): Promise<EstimateFeeResponse | null>;
    getMin(quote: QuoteRequest): Promise<BN>;
    waitForApproveConfirmations({ swap, network, walletId }: NextSwapActionRequest<ThorchainSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    waitForSendConfirmations({ swap, network, walletId }: NextSwapActionRequest<ThorchainSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    waitForReceive({ swap, network, walletId }: NextSwapActionRequest<ThorchainSwapHistoryItem>): Promise<{
        receiveTxHash: string;
        receiveTx: Transaction<any>;
        endTime: number;
        status: string;
    } | {
        receiveTxHash: string;
        receiveTx: Transaction<any>;
        endTime?: undefined;
        status?: undefined;
    } | undefined>;
    performNextSwapAction(store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<ThorchainSwapHistoryItem>): Promise<Partial<{
        endTime: number;
        status: string;
    }> | undefined>;
    private feeUnits;
    protected _getStatuses(): Record<string, SwapStatus>;
    protected _txTypes(): typeof ThorchainTxTypes;
    protected _fromTxType(): string | null;
    protected _toTxType(): string | null;
    protected _timelineDiagramSteps(): string[];
    protected _totalSteps(): number;
}
export { ThorchainSwapProvider };
