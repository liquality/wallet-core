import BN from 'bignumber.js';
import { ActionContext } from '../../store';
import { Asset, Network, SwapHistoryItem, WalletId } from '../../store/types';
import { SwapProvider } from '../SwapProvider';
import { BaseSwapProviderConfig, EstimateFeeRequest, NextSwapActionRequest, QuoteRequest, SwapRequest, SwapStatus } from '../types';
export interface TeleSwapSwapProviderConfig extends BaseSwapProviderConfig {
    QuickSwapRouterAddress: string;
    QuickSwapFactoryAddress: string;
    targetNetworkConnectionInfo: any;
}
export declare enum TeleSwapTxTypes {
    WRAP = "WRAP",
    SWAP = "SWAP"
}
export interface TeleSwapSwapHistoryItem extends SwapHistoryItem {
    bitcoinTxHash: string;
    approveTxHash: string;
    burnTxHash: string;
    numberOfBitcoinConfirmations: number;
}
declare class TeleSwapSwapProvider extends SwapProvider {
    config: TeleSwapSwapProviderConfig;
    constructor(config: TeleSwapSwapProviderConfig);
    getSupportedPairs(): Promise<never[]>;
    isSwapSupported(from: Asset, to: Asset, network: Network): boolean;
    getQuote({ network, from, to, amount }: QuoteRequest): Promise<{
        fromAmount: string;
        toAmount: string;
    }>;
    sendBitcoinSwap({ quote, network, walletId, }: {
        quote: TeleSwapSwapHistoryItem;
        network: Network;
        walletId: WalletId;
    }): Promise<{
        status: string;
        bitcoinTxHash: string;
        numberOfBitcoinConfirmations: number;
    }>;
    sendBurn({ quote, network, walletId, }: {
        quote: TeleSwapSwapHistoryItem;
        network: Network;
        walletId: WalletId;
    }): Promise<{
        status: string;
        burnTxHash: string;
    }>;
    approveForBurn({ quote, network, walletId, }: {
        quote: TeleSwapSwapHistoryItem;
        network: Network;
        walletId: WalletId;
    }): Promise<{
        status: string;
        approveTxHash: string;
    }>;
    sendSwap({ network, walletId, swap }: NextSwapActionRequest<TeleSwapSwapHistoryItem>): Promise<{
        status: string;
        bitcoinTxHash: string;
        numberOfBitcoinConfirmations: number;
    } | {
        status: string;
        approveTxHash: string;
    } | undefined>;
    newSwap({ network, walletId, quote }: SwapRequest<TeleSwapSwapHistoryItem>): Promise<{
        id: string;
        fee: number;
    } | {
        status: string;
        bitcoinTxHash: string;
        numberOfBitcoinConfirmations: number;
        id: string;
        fee: number;
    } | {
        status: string;
        approveTxHash: string;
        id: string;
        fee: number;
    }>;
    estimateFees({ network, walletId, asset, txType, quote, feePrices, max }: EstimateFeeRequest): Promise<{
        [x: string]: BN;
    } | null>;
    getMin(quote: QuoteRequest): Promise<BN>;
    getTokenAddress(asset: Asset): string;
    waitForSendConfirmations({ swap, network, walletId }: NextSwapActionRequest<TeleSwapSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
        numberOfBitcoinConfirmations: number;
    } | undefined>;
    waitForReceive({ swap, network, walletId }: NextSwapActionRequest<TeleSwapSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
        numberOfBitcoinConfirmations: number | undefined;
    } | undefined>;
    waitForApproveConfirmations({ swap, network, walletId }: NextSwapActionRequest<TeleSwapSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    waitForBurnConfirmations({ swap, network, walletId }: NextSwapActionRequest<TeleSwapSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    performNextSwapAction(store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<TeleSwapSwapHistoryItem>): Promise<Partial<{
        endTime: number;
        status: string;
    }> | undefined>;
    protected _getStatuses(): Record<string, SwapStatus>;
    protected _txTypes(): typeof TeleSwapTxTypes;
    protected _fromTxType(): string | null;
    protected _toTxType(): string | null;
    protected _timelineDiagramSteps(): string[];
    protected _totalSteps(): number;
    private _chooseLockerAddress;
    private _getChainIdNumber;
    private _getFees;
    private _getOpReturnData;
}
export { TeleSwapSwapProvider };
