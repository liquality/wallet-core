import { BitcoinBaseWalletProvider, BitcoinEsploraApiProvider, BitcoinTypes } from '@chainify/bitcoin';
import { Client } from '@chainify/client';
import { Transaction } from '@chainify/types';
import BN from 'bignumber.js';
import { Socket } from 'socket.io-client';
import { ActionContext } from '../../store';
import { Network, SwapHistoryItem } from '../../store/types';
import { SwapProvider } from '../SwapProvider';
import { BaseSwapProviderConfig, EstimateFeeRequest, NextSwapActionRequest, QuoteRequest, SwapRequest, SwapStatus } from '../types';
export interface FastBtcTxAmount {
    max: number;
    min: number;
}
export interface FastBtcDepositAddress {
    id: number;
    web3adr: string;
    btcadr: string;
    label: string;
    dateAdded: number;
    signatures: {
        signer: string;
        signature: string;
    }[];
}
export declare enum FastBtcStatus {
    Confirmed = "confirmed"
}
export declare enum FastBtcType {
    Deposit = "deposit",
    Transfer = "transfer"
}
export interface FastBtcDepositHistory {
    dateAdded: number;
    txHash: string;
    type: FastBtcType;
    status: FastBtcStatus;
    valueBtc: number;
}
export interface FastBtcDepositSwapHistoryItem extends SwapHistoryItem {
    swapTxHash: string;
    swapTx: Transaction<BitcoinTypes.Transaction>;
}
export interface FastBtcDepositSwapProviderConfig extends BaseSwapProviderConfig {
    bridgeEndpoint: string;
}
declare class FastBTCDepositSwapProvider extends SwapProvider {
    config: FastBtcDepositSwapProviderConfig;
    socketConnection: Socket;
    connectSocket(): Promise<unknown>;
    getClient(network: Network, walletId: string, asset: string, accountId: string): Client<BitcoinEsploraApiProvider, BitcoinBaseWalletProvider<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
    getSupportedPairs(): Promise<{
        from: string;
        to: string;
        rate: string;
        max: string;
        min: string;
    }[]>;
    _getHistory(address: string): Promise<FastBtcDepositHistory[]>;
    _getAddress(address: string): Promise<FastBtcDepositAddress>;
    _getTxAmount(): Promise<FastBtcTxAmount>;
    getQuote(quoteRequest: QuoteRequest): Promise<{
        fromAmount: string;
        toAmount: string;
    } | null>;
    sendSwap({ network, walletId, quote }: SwapRequest): Promise<{
        status: string;
        swapTx: Transaction<BitcoinTypes.Transaction>;
        swapTxHash: string;
    } | null>;
    newSwap({ network, walletId, quote }: SwapRequest): Promise<{
        status?: string | undefined;
        swapTx?: Transaction<BitcoinTypes.Transaction> | undefined;
        swapTxHash?: string | undefined;
        id: string;
        fee: number;
        slippage: number;
    }>;
    estimateFees({ network, walletId, asset, txType, quote, feePrices, max }: EstimateFeeRequest): Promise<{
        [x: string]: BN;
    } | null>;
    getMin(_quoteRequest: QuoteRequest): Promise<BN>;
    waitForSendConfirmations({ swap, network, walletId }: NextSwapActionRequest<FastBtcDepositSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    waitForReceive({ swap, network, walletId }: NextSwapActionRequest<FastBtcDepositSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    performNextSwapAction(_store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<FastBtcDepositSwapHistoryItem>): Promise<Partial<{
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
export { FastBTCDepositSwapProvider };
