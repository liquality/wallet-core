import { EIP1559Fee } from '@chainify/types';
import { Chain, Hop, HopBridge, TToken } from '@hop-protocol/sdk';
import { IAsset } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import { ethers, Wallet } from 'ethers';
import { ActionContext } from '../../store';
import { Network, SwapHistoryItem } from '../../store/types';
import { SwapProvider } from '../SwapProvider';
import { BaseSwapProviderConfig, EstimateFeeRequest, EstimateFeeResponse, NextSwapActionRequest, QuoteRequest, SwapQuote, SwapRequest, SwapStatus } from '../types';
export interface HopSwapProviderConfig extends BaseSwapProviderConfig {
    graphqlBaseURL: string;
}
export interface HopSwapQuote extends SwapQuote {
    hopChainFrom: Chain;
}
export declare enum HopTxTypes {
    SWAP = "SWAP"
}
export interface HopSwapHistoryItem extends SwapHistoryItem {
    hopAsset: TToken;
    hopChainFrom: Chain;
    hopChainTo: Chain;
    approveTxHash: string;
    fromFundHash: string;
}
declare class HopSwapProvider extends SwapProvider {
    config: HopSwapProviderConfig;
    graphqlURLs: {
        [key: string]: string;
    };
    constructor(config: HopSwapProviderConfig);
    getSupportedPairs(): Promise<never[]>;
    gasLimit(networkName: string): {
        [key: string]: number;
    };
    getChain(chainName: string): Chain;
    _getHop(network: Network, signer?: undefined): Hop;
    _getAllTokens(hop: Hop): any;
    _getClient(network: Network, walletId: string, from: string, fromAccountId: string): import("@chainify/client").Client<import("@chainify/client").Chain<any, import("@chainify/types").Network>, import("@chainify/client").Wallet<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
    _getSigner(network: Network, walletId: string, from: string, fromAccountId: string, provider: ethers.providers.Provider): Promise<ethers.Wallet>;
    _getBridgeWithSigner(hopAsset: TToken, hopChainFrom: Chain, network: Network, walletId: string, from: string, fromAccountId: string): Promise<HopBridge>;
    _findAsset(asset: IAsset, chain: string, tokens: Record<string, any>, tokenName: string): string | undefined;
    _getSendInfo(assetFrom: IAsset, assetTo: IAsset, hop: Hop): {
        bridgeAsset: string;
        chainFrom: Chain;
        chainTo: Chain;
    } | null;
    getQuote({ network, from, to, amount }: QuoteRequest): Promise<{
        fromAmount: string;
        toAmount: string;
        hopAsset: string;
        hopChainFrom: Chain;
        hopChainTo: Chain;
        receiveFee: string;
    } | null>;
    _formatFee(fee: EIP1559Fee | number, networkName: string, type: string): {
        gasPrice: string;
        gasLimit: number;
        maxFeePerGas?: undefined;
        maxPriorityFeePerGas?: undefined;
    } | {
        maxFeePerGas: string;
        maxPriorityFeePerGas: string;
        gasLimit: number;
        gasPrice?: undefined;
    };
    _approveToken(bridge: HopBridge, chainFrom: Chain, fromAmount: string, signer: Wallet, fee: number): Promise<{
        status: string;
        approveTx: ethers.providers.TransactionResponse;
        approveTxHash: string;
    }>;
    sendSwap({ network, walletId, quote }: SwapRequest<HopSwapHistoryItem>): Promise<{
        status: string;
        fromFundTx: ethers.providers.TransactionResponse;
        fromFundHash: string;
    }>;
    newSwap({ network, walletId, quote }: SwapRequest<HopSwapHistoryItem>): Promise<{
        status: string;
        approveTx: ethers.providers.TransactionResponse;
        approveTxHash: string;
        id: string;
        fee: number;
        slippage: number;
        hopAsset: TToken;
        hopChainFrom: Chain;
        hopChainTo: Chain;
    } | {
        endTime: number;
        status: string;
        id: string;
        fee: number;
        slippage: number;
        hopAsset: TToken;
        hopChainFrom: Chain;
        hopChainTo: Chain;
    }>;
    estimateFees({ asset, txType, quote, network, feePrices, feePricesL1, }: EstimateFeeRequest<HopTxTypes, HopSwapQuote>): Promise<EstimateFeeResponse>;
    getMin(_quoteRequest: QuoteRequest): Promise<BN>;
    waitForApproveConfirmations({ swap, network, walletId }: NextSwapActionRequest<HopSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    waitForSendSwapConfirmations({ swap, network, walletId }: NextSwapActionRequest<HopSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    waitForRecieveSwapConfirmations({ swap, network, walletId }: NextSwapActionRequest<HopSwapHistoryItem>): Promise<{
        receiveTxHash: string;
        receiveTx: import("@chainify/types").Transaction<any>;
        endTime: number;
        status: string;
    } | undefined>;
    performNextSwapAction(store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<HopSwapHistoryItem>): Promise<Partial<{
        endTime: number;
        status: string;
    }> | undefined>;
    protected _getStatuses(): Record<string, SwapStatus>;
    protected _txTypes(): Record<string, string | null>;
    protected _fromTxType(): string | null;
    protected _toTxType(): string | null;
    protected _totalSteps(): number;
    protected _timelineDiagramSteps(): string[];
}
export { HopSwapProvider };
