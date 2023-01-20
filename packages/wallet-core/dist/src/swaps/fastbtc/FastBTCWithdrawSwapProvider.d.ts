import { BitcoinBaseWalletProvider, BitcoinEsploraApiProvider, BitcoinTypes } from '@chainify/bitcoin';
import { Client } from '@chainify/client';
import { EvmChainProvider, EvmTypes, EvmWalletProvider } from '@chainify/evm';
import { Transaction } from '@chainify/types';
import { JsonRpcProvider } from '@ethersproject/providers';
import BN from 'bignumber.js';
import * as ethers from 'ethers';
import { ActionContext } from '../../store';
import { Network, SwapHistoryItem, WalletId } from '../../store/types';
import { SwapProvider } from '../SwapProvider';
import { BaseSwapProviderConfig, EstimateFeeRequest, EstimateFeeResponse, NextSwapActionRequest, QuoteRequest, SwapQuote, SwapRequest, SwapStatus } from '../types';
export interface FastBtcWithdrawSwapHistoryItem extends SwapHistoryItem {
    transferId: string;
    swapTxHash: string;
    swapTx: Transaction<EvmTypes.EthersTransactionResponse>;
    receiveTxHash: string;
    receiveTx: Transaction<BitcoinTypes.Transaction>;
}
export interface FastBtcWithdrawSwapProviderConfig extends BaseSwapProviderConfig {
    network: Network;
    routerAddress: string;
}
export interface BuildSwapOptions {
    network: Network;
    walletId: WalletId;
    quote: SwapQuote;
}
declare class FastBTCWithdrawSwapProvider extends SwapProvider {
    config: FastBtcWithdrawSwapProviderConfig;
    private _provider;
    constructor(config: FastBtcWithdrawSwapProviderConfig);
    getFastBtcBridge(provider: JsonRpcProvider): ethers.ethers.Contract;
    getLimits(): Promise<{
        min: BN;
        max: BN;
    }>;
    getClient(network: Network, walletId: string, asset: string, accountId: string): Client<EvmChainProvider, EvmWalletProvider, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
    getReceiveClient(network: Network, walletId: string, asset: string, accountId: string): Client<BitcoinEsploraApiProvider, BitcoinBaseWalletProvider<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
    getSupportedPairs(): Promise<{
        from: string;
        to: string;
        rate: string;
        min: string;
        max: string;
    }[]>;
    getQuote(quoteRequest: QuoteRequest): Promise<{
        fromAmount: string;
        toAmount: string;
    } | null>;
    buildSwapTx({ network, walletId, quote }: BuildSwapOptions): Promise<{
        from: string;
        to: string;
        value: ethers.ethers.BigNumber;
        data: string;
    }>;
    sendSwap({ network, walletId, quote }: SwapRequest): Promise<{
        status: string;
        swapTx: Transaction<EvmTypes.EthersTransactionResponse>;
        swapTxHash: string;
    }>;
    newSwap({ network, walletId, quote }: SwapRequest): Promise<{
        status: string;
        swapTx: Transaction<EvmTypes.EthersTransactionResponse>;
        swapTxHash: string;
        id: string;
        fee: number;
        slippage: number;
    }>;
    estimateFees({ network, walletId, quote, feePrices }: EstimateFeeRequest): Promise<EstimateFeeResponse>;
    getMin(): Promise<BN>;
    waitForSendConfirmations({ swap, network, walletId }: NextSwapActionRequest<FastBtcWithdrawSwapHistoryItem>): Promise<{
        transferId: string;
        status: string;
    } | undefined>;
    waitForReceive({ swap, network, walletId }: NextSwapActionRequest<FastBtcWithdrawSwapHistoryItem>): Promise<{
        receiveTxHash: any;
        receiveTx: Transaction<any>;
        endTime: number;
        status: string;
    } | {
        receiveTxHash: any;
        receiveTx: Transaction<any>;
        status: string;
        endTime?: undefined;
    } | undefined>;
    waitForReceiveConfirmations({ swap, network, walletId, }: NextSwapActionRequest<FastBtcWithdrawSwapHistoryItem>): Promise<{
        receiveTx: Transaction<any>;
        endTime: number;
        status: string;
    } | undefined>;
    performNextSwapAction(_store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<FastBtcWithdrawSwapHistoryItem>): Promise<Partial<{
        transferId: string;
        status: string;
    }> | Partial<{
        receiveTx: Transaction<any>;
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
export { FastBTCWithdrawSwapProvider };
