import { CUSTOM_ERRORS, createInternalError } from '@liquality/error-parser';
import BigNumber from 'bignumber.js';
import store, { ActionContext } from '../store';
import { createNotification } from '../store/broker/notification';
import { AccountId, MarketData, Network, PairData, SwapHistoryItem } from '../store/types';
import {
  ActionStatus,
  BaseSwapProviderConfig,
  EstimateFeeRequest,
  EstimateFeeResponse,
  GetQuoteResult,
  NextSwapActionRequest,
  QuoteRequest,
  SwapRequest,
  SwapStatus,
} from './types';

export abstract class SwapProvider {
  config: BaseSwapProviderConfig;

  constructor(config: BaseSwapProviderConfig) {
    this.config = config;
  }

  protected abstract _getStatuses(): Record<string, SwapStatus>;
  protected abstract _txTypes(): Record<string, string | null>;
  protected abstract _fromTxType(): string | null;
  protected abstract _toTxType(): string | null; // replace with Enum
  protected abstract _totalSteps(): number;
  protected abstract _timelineDiagramSteps(): string[];

  public async sendLedgerNotification(accountId: string, message: string) {
    const account = store.getters.accountItem(accountId);
    if (account?.type.includes('ledger')) {
      await createNotification({ title: 'Sign with Ledger', message });
    }
  }

  /**
   * Get the supported pairs of this provider for this network
   * @param {{ network }} network
   */
  public abstract getSupportedPairs({ network }: { network: Network }): Promise<PairData[]>;

  /**
   * Get min swap amount for given swap provider
   */
  public abstract getMin(quoteRequest: QuoteRequest): Promise<BigNumber>;

  /**
   * Get a quote for the specified parameters
   */
  public abstract getQuote(quoteRequest: QuoteRequest): Promise<GetQuoteResult | null>;

  /**
   * Create a new swap for the given quote
   */
  public abstract newSwap(swapRequest: SwapRequest): Promise<Partial<SwapHistoryItem>>;

  /**
   * Estimate the fees for the given parameters
   * @return Object of key feePrice and value fee
   */
  public abstract estimateFees(estimateFeeRequest: EstimateFeeRequest): Promise<EstimateFeeResponse | null>;

  /**
   * This hook is called when state updates are required
   * @return updates An object representing updates to the current swap in the history
   */
  public abstract performNextSwapAction(
    store: ActionContext,
    nextSwapAction: NextSwapActionRequest
  ): Promise<Partial<SwapHistoryItem> | undefined>;

  public async waitForSwapConfirmations(
    _nextSwapActionRequest: NextSwapActionRequest
  ): Promise<ActionStatus | undefined> {
    return;
  }

  /**
   * Gets the market data
   */
  public getMarketData(network: Network): MarketData[] {
    return store.state.marketData[network] as MarketData[];
  }

  /**
   * Gets the blockchain client
   */
  public getClient(network: Network, walletId: string, asset: string, accountId: string) {
    const chainId = store.getters.cryptoassets[asset].chain;
    return store.getters.client({ network, walletId, chainId, accountId });
  }

  /**
   * Get account by id
   * @return account
   */
  public getAccount(accountId: string) {
    return store.getters.accountItem(accountId);
  }

  /**
   * Update balances for given assets
   */
  public async updateBalances(network: Network, walletId: string, accountIds: AccountId[]) {
    return store.dispatch.updateBalances({ network, walletId, accountIds });
  }

  /**
   * Get an address to use for the swap
   * @returns string address
   */
  public async getSwapAddress(network: Network, walletId: string, asset: string, accountId: string): Promise<string> {
    const [address] = await store.dispatch.getUnusedAddresses({ network, walletId, assets: [asset], accountId });
    return address;
  }

  public get statuses() {
    const statuses = this._getStatuses();
    if (typeof statuses === 'undefined') throw createInternalError(CUSTOM_ERRORS.NotFound.SwapProvider.Statuses);
    return statuses;
  }

  public get fromTxType() {
    const fromTxType = this._fromTxType();
    if (typeof fromTxType === 'undefined') {
      throw createInternalError(CUSTOM_ERRORS.NotFound.SwapProvider.FromTxType);
    }
    return fromTxType;
  }

  public get toTxType() {
    const toTxType = this._toTxType();
    if (typeof toTxType === 'undefined') {
      throw createInternalError(CUSTOM_ERRORS.NotFound.SwapProvider.ToTxType);
    }
    return toTxType;
  }

  public get timelineDiagramSteps() {
    const timelineDiagramSteps = this._timelineDiagramSteps();
    if (typeof timelineDiagramSteps === 'undefined') {
      throw createInternalError(CUSTOM_ERRORS.NotFound.SwapProvider.timelineDiagramSteps);
    }
    return timelineDiagramSteps;
  }

  public get totalSteps() {
    const totalSteps = this._totalSteps();
    if (typeof totalSteps === 'undefined') {
      throw createInternalError(CUSTOM_ERRORS.NotFound.SwapProvider.totalSteps);
    }
    return totalSteps;
  }

  public get txTypes() {
    const totalSteps = this._txTypes();
    if (typeof totalSteps === 'undefined') {
      throw createInternalError(CUSTOM_ERRORS.NotFound.SwapProvider._txTypes);
    }
    return totalSteps;
  }
}
