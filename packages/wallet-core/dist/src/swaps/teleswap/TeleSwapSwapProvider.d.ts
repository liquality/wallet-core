import BN from 'bignumber.js';
import { ActionContext } from '../../store';
import { Asset, Network, SwapHistoryItem, WalletId } from '../../store/types';
import { SwapProvider } from '../SwapProvider';
import { BaseSwapProviderConfig, EstimateFeeRequest, NextSwapActionRequest, QuoteRequest, SwapRequest, SwapStatus } from '../types';
export interface TeleSwapSwapProviderConfig extends BaseSwapProviderConfig {
    QuickSwapRouterAddress: string;
    QuickSwapFactoryAddress: string;
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
export declare enum TeleSwapTxTypes {
    WRAP = "WRAP",
    SWAP = "SWAP"
}
export interface TeleSwapSwapHistoryItem extends SwapHistoryItem {
    swapTxHash: string;
    numberOfConfirmations: number;
}
declare class TeleSwapSwapProvider extends SwapProvider {
    config: TeleSwapSwapProviderConfig;
    targetNetworkConnectionInfo: {
        web3: {
            url: string;
        };
    };
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
    }): Promise<import("@chainify/types").Transaction<any>>;
    sendSwap({ network, walletId, swap }: NextSwapActionRequest<TeleSwapSwapHistoryItem>): Promise<{
        status: string;
        swapTxHash: string;
        numberOfConfirmations: number;
    }>;
    newSwap({ network, walletId, quote }: SwapRequest<TeleSwapSwapHistoryItem>): Promise<{
        status: string;
        swapTxHash: string;
        numberOfConfirmations: number;
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
        numberOfConfirmations: number;
    } | undefined>;
    waitForReceive({ swap, network, walletId }: NextSwapActionRequest<TeleSwapSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
        numberOfConfirmations: number | undefined;
    } | undefined>;
    performNextSwapAction(_store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<TeleSwapSwapHistoryItem>): Promise<Partial<{
        endTime: number;
        status: string;
        numberOfConfirmations: number;
    }> | undefined>;
    protected _getStatuses(): Record<string, SwapStatus>;
    protected _txTypes(): typeof TeleSwapTxTypes;
    protected _fromTxType(): string | null;
    protected _toTxType(): string | null;
    protected _timelineDiagramSteps(): string[];
    protected _totalSteps(): number;
    private _chooseLockerAddress;
    private _getChainIdNumber;
    private _getTeleporterFee;
    private _getOpReturnData;
}
export { TeleSwapSwapProvider };
