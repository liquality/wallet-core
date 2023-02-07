import BigNumber from 'bignumber.js';
import { ActionContext } from '../store';
import { AccountId, MarketData, Network, PairData, SwapHistoryItem } from '../store/types';
import { ActionStatus, BaseSwapProviderConfig, EstimateFeeRequest, EstimateFeeResponse, GetQuoteResult, NextSwapActionRequest, QuoteRequest, SwapRequest, SwapStatus } from './types';
export declare abstract class SwapProvider {
    config: BaseSwapProviderConfig;
    constructor(config: BaseSwapProviderConfig);
    protected abstract _getStatuses(): Record<string, SwapStatus>;
    protected abstract _txTypes(): Record<string, string | null>;
    protected abstract _fromTxType(): string | null;
    protected abstract _toTxType(): string | null;
    protected abstract _totalSteps(): number;
    protected abstract _timelineDiagramSteps(): string[];
    sendLedgerNotification(accountId: string, message: string): Promise<void>;
    abstract getSupportedPairs({ network }: {
        network: Network;
    }): Promise<PairData[]>;
    abstract getMin(quoteRequest: QuoteRequest): Promise<BigNumber>;
    abstract getQuote(quoteRequest: QuoteRequest): Promise<GetQuoteResult | null>;
    abstract newSwap(swapRequest: SwapRequest): Promise<Partial<SwapHistoryItem>>;
    abstract estimateFees(estimateFeeRequest: EstimateFeeRequest): Promise<EstimateFeeResponse | null>;
    abstract performNextSwapAction(store: ActionContext, nextSwapAction: NextSwapActionRequest): Promise<Partial<SwapHistoryItem> | undefined>;
    waitForSwapConfirmations(_nextSwapActionRequest: NextSwapActionRequest): Promise<ActionStatus | undefined>;
    getMarketData(network: Network): MarketData[];
    getClient(network: Network, walletId: string, asset: string, accountId: string): import("@chainify/client").Client<import("@chainify/client").Chain<any, import("@chainify/types").Network>, import("@chainify/client").Wallet<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
    getAccount(accountId: string): import("../store/types").Account | undefined;
    updateBalances(network: Network, walletId: string, accountIds: AccountId[]): Promise<void>;
    getSwapAddress(network: Network, walletId: string, asset: string, accountId: string): Promise<string>;
    get statuses(): Record<string, SwapStatus>;
    get fromTxType(): string | null;
    get toTxType(): string | null;
    get timelineDiagramSteps(): string[];
    get totalSteps(): number;
    get txTypes(): Record<string, string | null>;
}
