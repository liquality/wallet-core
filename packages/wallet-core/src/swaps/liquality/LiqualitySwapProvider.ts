import { BitcoinBaseWalletProvider, BitcoinEsploraApiProvider } from '@chainify/bitcoin';
import { Client, HttpClient } from '@chainify/client';
import { Asset as ChainifyAsset, Transaction } from '@chainify/types';
import { sha256 } from '@chainify/utils';
import { currencyToUnit, getChain, unitToCurrency } from '@liquality/cryptoassets';
import { getTransactionByHash } from '../../utils/getTransactionByHash';
import { isTransactionNotFoundError } from '../../utils/isTransactionNotFoundError';
import BN, { BigNumber } from 'bignumber.js';
import { mapValues } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import pkg from '../../../package.json';
import { ActionContext } from '../../store';
import { withInterval, withLock } from '../../store/actions/performNextAction/utils';
import { AccountId, Asset, Network, WalletId } from '../../store/types';
import { timestamp, wait } from '../../store/utils';
import { assetsAdapter } from '../../utils/chainify';
import { prettyBalance } from '../../utils/coinFormatter';
import cryptoassets from '../../utils/cryptoassets';
import { getTxFee } from '../../utils/fees';
import { EvmSwapHistoryItem, EvmSwapProvider, EvmSwapProviderConfig } from '../EvmSwapProvider';
import {
  EstimateFeeRequest,
  EstimateFeeResponse,
  NextSwapActionRequest,
  QuoteRequest,
  SwapRequest,
  SwapStatus,
} from '../types';
import SlippageError, { CUSTOM_ERRORS, QuoteExpiredError, InternalError } from '@liquality/error-parser';

const VERSION_STRING = `Wallet ${pkg.version} (Chainify ${pkg.dependencies['@chainify/client']
  .replace('^', '')
  .replace('~', '')})`;

const headers = {
  'x-requested-with': VERSION_STRING,
  'x-liquality-user-agent': VERSION_STRING,
};

export enum LiqualityTxTypes {
  SWAP_INITIATION = 'SWAP_INITIATION',
  SWAP_CLAIM = 'SWAP_CLAIM',
}

export interface LiqualityMarketData {
  from: string;
  to: string;
  status: string;
  updatedAt: Date;
  createdAt: Date;
  max: number;
  min: number;
  minConf: number;
  rate: number;
}

export interface LiqualitySwapHistoryItem extends EvmSwapHistoryItem {
  orderId: string;
  fromAddress: string;
  toAddress: string;
  fromCounterPartyAddress: string;
  toCounterPartyAddress: string;
  secretHash: string;
  secret: string;
  expiresAt: number;
  swapExpiration: number;
  nodeSwapExpiration: number;
  fromFundHash: string;
  fromFundTx: Transaction;
  refundTx: Transaction;
  refundHash: string;
  toClaimTx: Transaction;
  toClaimHash: string;
  toFundHash: string;
}

export interface LiqualitySwapProviderConfig extends EvmSwapProviderConfig {
  agent: string;
}

export class LiqualitySwapProvider extends EvmSwapProvider {
  public config: LiqualitySwapProviderConfig;
  private _httpClient: HttpClient;

  constructor(config: LiqualitySwapProviderConfig) {
    super(config);
    this._httpClient = new HttpClient({ baseURL: this.config.agent });
  }

  private async getMarketInfo(): Promise<LiqualityMarketData[]> {
    return this._httpClient.nodeGet('/api/swap/marketinfo', null, { headers });
  }

  async getAssetLiquidity(asset: string): Promise<number> {
    const assetsInfo = await this._httpClient.nodeGet('api/swap/assetinfo');
    const assetInfo = assetsInfo.find(({ code }: { code: string }) => code === asset);

    if (!assetInfo) {
      return 0;
    }

    return assetInfo.balance;
  }

  public async getSupportedPairs() {
    const markets = await this.getMarketInfo();
    const pairs = markets
      .filter((market) => cryptoassets[market.from] && cryptoassets[market.to])
      .map((market) => ({
        from: market.from,
        to: market.to,
        min: new BN(unitToCurrency(cryptoassets[market.from], market.min)).toFixed(),
        max: new BN(unitToCurrency(cryptoassets[market.from], market.max)).toFixed(),
        rate: new BN(market.rate).toFixed(),
      }));

    return pairs;
  }

  public async getQuote({ network, from, to, amount }: QuoteRequest) {
    const marketData = this.getMarketData(network);
    // Quotes are retrieved using market data because direct quotes take a long time for BTC swaps (agent takes long to generate new address)
    const market = marketData.find(
      (market) => market.provider === this.config.providerId && market.to === to && market.from === from
    );

    if (!market) return null;

    const fromAmount = currencyToUnit(cryptoassets[from], amount);
    const toAmount = currencyToUnit(cryptoassets[to], new BN(amount).times(new BN(market.rate)));

    return {
      fromAmount: fromAmount.toFixed(),
      toAmount: toAmount.toFixed(),
      min: new BN(market.min),
      max: new BN(market.max),
    };
  }

  public async newSwap(swapRequest: SwapRequest<LiqualitySwapHistoryItem>) {
    const approveTx = await this.approve(swapRequest, true);
    const updates = approveTx || (await this.initiateSwap(swapRequest));
    return { id: uuidv4(), ...updates };
  }

  private async initiateSwap({ network, walletId, quote: _quote }: SwapRequest<LiqualitySwapHistoryItem>) {
    const lockedQuote = await this._getQuote({
      from: _quote.from,
      to: _quote.to,
      amount: _quote.fromAmount,
    });

    // Do not override the id that was created during approve step
    delete lockedQuote.id;

    if (new BN(lockedQuote.toAmount).lt(new BN(_quote.toAmount).times(0.995))) {
      throw SlippageError;
    }

    const quote = {
      ..._quote,
      ...lockedQuote,
    };
    if (await this.hasQuoteExpired(quote)) {
      throw new QuoteExpiredError();
    }

    quote.fromAddress = await this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
    quote.toAddress = await this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);

    const fromClient = this.getClient(network, walletId, quote.from, quote.fromAccountId);

    const message = [
      'Creating a swap with following terms:',
      `Send: ${quote.fromAmount} (lowest denomination) ${quote.from}`,
      `Receive: ${quote.toAmount} (lowest denomination) ${quote.to}`,
      `My ${quote.from} Address: ${quote.fromAddress}`,
      `My ${quote.to} Address: ${quote.toAddress}`,
      `Counterparty ${quote.from} Address: ${quote.fromCounterPartyAddress}`,
      `Counterparty ${quote.to} Address: ${quote.toCounterPartyAddress}`,
      `Timestamp: ${quote.swapExpiration}`,
    ].join('\n');

    const messageHex = Buffer.from(message, 'utf8').toString('hex');
    const secret = await fromClient.swap.generateSecret(messageHex);
    const secretHash = sha256(secret);
    const asset = assetsAdapter(quote.from)[0];

    const fromFundTx = await fromClient.swap.initiateSwap(
      {
        asset,
        value: new BN(quote.fromAmount),
        recipientAddress: quote.fromCounterPartyAddress,
        refundAddress: quote.fromAddress,
        secretHash: secretHash,
        expiration: quote.swapExpiration,
      },
      quote.fee
    );

    return {
      ...quote,
      status: 'INITIATED',
      secret,
      secretHash,
      fromFundHash: fromFundTx.hash,
      fromFundTx,
    };
  }

  public async estimateFees({
    network,
    walletId,
    asset,
    txType,
    quote,
    feePrices,
    max,
  }: EstimateFeeRequest<LiqualityTxTypes>) {
    if (txType === this._txTypes().SWAP_INITIATION && asset === 'BTC') {
      const client = this.getClient(network, walletId, asset, quote.fromAccountId) as Client<
        BitcoinEsploraApiProvider,
        BitcoinBaseWalletProvider
      >;
      const value = max ? undefined : new BN(quote.fromAmount);
      const txs = feePrices.map((fee) => ({ to: '', value, fee }));
      const totalFees = await client.wallet.getTotalFees(txs, max);
      return mapValues(totalFees, (f) => unitToCurrency(cryptoassets[asset], f));
    }

    if (txType === this._txTypes().SWAP_INITIATION && asset === 'NEAR') {
      const fees: EstimateFeeResponse = {};
      // default storage fee recommended by NEAR dev team
      // It leaves 0.02$ dust in the wallet on max value
      const storageFee = new BN(0.00125);
      for (const feePrice of feePrices) {
        fees[feePrice] = getTxFee(this.feeUnits[txType], asset, feePrice).plus(storageFee);
      }
      return fees;
    }

    if (txType in this.feeUnits) {
      const fees: EstimateFeeResponse = {};
      for (const feePrice of feePrices) {
        fees[feePrice] = getTxFee(this.feeUnits[txType], asset, feePrice);
      }

      return fees;
    }

    const fees: EstimateFeeResponse = {};
    for (const feePrice of feePrices) {
      fees[feePrice] = new BigNumber(0);
    }

    return fees;
  }

  async getMin(quoteRequest: QuoteRequest) {
    if (quoteRequest) {
      const pairs = await this.getSupportedPairs();
      for (const pair of pairs) {
        if (pair.from == quoteRequest.from && pair.to == quoteRequest.to) {
          return new BN(pair.min);
        }
      }
    }
    return new BN(0);
  }

  public async updateOrder(order: LiqualitySwapHistoryItem) {
    return this._httpClient.nodePost(
      `/api/swap/order/${order.orderId}`,
      {
        fromAddress: order.fromAddress,
        toAddress: order.toAddress,
        fromFundHash: order.fromFundHash,
        secretHash: order.secretHash,
      },
      { headers }
    );
  }

  public async waitForClaimConfirmations({ swap, network, walletId }: NextSwapActionRequest<LiqualitySwapHistoryItem>) {
    const toClient = this.getClient(network, walletId, swap.to, swap.toAccountId);

    try {
      const tx = await getTransactionByHash(toClient, swap.toClaimHash);

      if (tx && tx.confirmations && tx.confirmations > 0) {
        this.updateBalances(network, walletId, [swap.toAccountId, swap.fromAccountId]);

        return {
          endTime: Date.now(),
          status: 'SUCCESS',
        };
      }
    } catch (e) {
      if (e.name === 'TxNotFoundError') console.warn(e);
      else throw e;
    }

    // Expiration check should only happen if tx not found
    const expirationUpdates = await this.handleExpirations({
      swap,
      network,
      walletId,
    });
    if (expirationUpdates) {
      return expirationUpdates;
    }
  }

  public async performNextSwapAction(
    store: ActionContext,
    { network, walletId, swap }: NextSwapActionRequest<LiqualitySwapHistoryItem>
  ) {
    switch (swap.status) {
      case 'WAITING_FOR_APPROVE_CONFIRMATIONS_LSP':
        return withInterval(async () => this.waitForApproveConfirmations({ swap, network, walletId }));

      case 'APPROVE_CONFIRMED_LSP':
        return withLock(store, { item: swap, network, walletId, asset: swap.from }, async () =>
          this.initiateSwap({ quote: swap, network, walletId })
        );

      case 'INITIATED':
        return this.reportInitiation(swap);

      case 'INITIATION_REPORTED':
        return withInterval(async () => this.confirmInitiation({ swap, network, walletId }));

      case 'INITIATION_CONFIRMED':
        return withInterval(async () => this.findCounterPartyInitiation({ swap, network, walletId }));

      case 'CONFIRM_COUNTER_PARTY_INITIATION':
        return withInterval(async () => this.confirmCounterPartyInitiation({ swap, network, walletId }));

      case 'READY_TO_CLAIM':
        return withLock(store, { item: swap, network, walletId, asset: swap.to }, async () =>
          this.claimSwap({ swap, network, walletId })
        );

      case 'WAITING_FOR_CLAIM_CONFIRMATIONS':
        return withInterval(async () => this.waitForClaimConfirmations({ swap, network, walletId }));

      case 'WAITING_FOR_REFUND':
        return withInterval(async () => this.waitForRefund({ swap, network, walletId }));

      case 'GET_REFUND':
        return withLock(store, { item: swap, network, walletId, asset: swap.from }, async () =>
          this.refundSwap({ swap, network, walletId })
        );

      case 'WAITING_FOR_REFUND_CONFIRMATIONS':
        return withInterval(async () => this.waitForRefundConfirmations({ swap, network, walletId }));
    }
  }

  protected _getStatuses(): Record<string, SwapStatus> {
    const baseStatuses = super._getStatuses();
    return {
      WAITING_FOR_APPROVE_CONFIRMATIONS_LSP: baseStatuses.WAITING_FOR_APPROVE_CONFIRMATIONS,
      APPROVE_CONFIRMED_LSP: baseStatuses.APPROVE_CONFIRMED,
      INITIATED: {
        step: 1,
        label: 'Locking {from}',
        filterStatus: 'PENDING',
      },
      INITIATION_REPORTED: {
        step: 1,
        label: 'Locking {from}',
        filterStatus: 'PENDING',
        notification() {
          return {
            message: 'Swap initiated',
          };
        },
      },
      INITIATION_CONFIRMED: {
        step: 2,
        label: 'Locking {from}',
        filterStatus: 'PENDING',
      },

      CONFIRM_COUNTER_PARTY_INITIATION: {
        step: 2,
        label: 'Locking {to}',
        filterStatus: 'PENDING',
        notification(swap: any) {
          return {
            message: `Counterparty sent ${prettyBalance(swap.toAmount, swap.to)} ${swap.to} to escrow`,
          };
        },
      },

      READY_TO_CLAIM: {
        step: 3,
        label: 'Claiming {to}',
        filterStatus: 'PENDING',
        notification() {
          return {
            message: 'Claiming funds',
          };
        },
      },
      WAITING_FOR_CLAIM_CONFIRMATIONS: {
        step: 3,
        label: 'Claiming {to}',
        filterStatus: 'PENDING',
      },
      WAITING_FOR_REFUND: {
        step: 3,
        label: 'Pending Refund',
        filterStatus: 'PENDING',
      },
      GET_REFUND: {
        step: 3,
        label: 'Refunding {from}',
        filterStatus: 'PENDING',
      },
      WAITING_FOR_REFUND_CONFIRMATIONS: {
        step: 3,
        label: 'Refunding {from}',
        filterStatus: 'PENDING',
      },

      REFUNDED: {
        step: 4,
        label: 'Refunded',
        filterStatus: 'REFUNDED',
        notification(swap: any) {
          return {
            message: `Swap refunded, ${prettyBalance(swap.fromAmount, swap.from)} ${swap.from} returned`,
          };
        },
      },
      SUCCESS: {
        step: 4,
        label: 'Completed',
        filterStatus: 'COMPLETED',
        notification(swap: any) {
          return {
            message: `Swap completed, ${prettyBalance(swap.toAmount, swap.to)} ${swap.to} ready to use`,
          };
        },
      },
      QUOTE_EXPIRED: {
        step: 4,
        label: 'Quote Expired',
        filterStatus: 'REFUNDED',
      },
    };
  }

  protected _txTypes() {
    return LiqualityTxTypes;
  }

  protected _fromTxType(): LiqualityTxTypes | null {
    return this._txTypes().SWAP_INITIATION;
  }

  protected _toTxType(): LiqualityTxTypes | null {
    return this._txTypes().SWAP_CLAIM;
  }

  protected _timelineDiagramSteps(): string[] {
    return ['APPROVE', 'INITIATION', 'AGENT_INITIATION', 'CLAIM_OR_REFUND'];
  }

  protected _totalSteps(): number {
    return 5;
  }

  private async _getQuote({ from, to, amount }: { from: Asset; to: Asset; amount: string }) {
    try {
      return this._httpClient.nodePost('/api/swap/order', { from, to, fromAmount: amount }, { headers });
    } catch (e) {
      if (e?.response?.data?.error) {
        throw new InternalError(CUSTOM_ERRORS.Unknown(e.response.data.error));
      } else {
        throw e;
      }
    }
  }

  private async waitForRefund({ swap, network, walletId }: NextSwapActionRequest<LiqualitySwapHistoryItem>) {
    if (await this.canRefund({ swap, network, walletId })) {
      return { status: 'GET_REFUND' };
    }
  }

  private async waitForRefundConfirmations({
    swap,
    network,
    walletId,
  }: NextSwapActionRequest<LiqualitySwapHistoryItem>) {
    const fromClient = this.getClient(network, walletId, swap.from, swap.fromAccountId);
    try {
      const tx = await getTransactionByHash(fromClient, swap.refundHash);

      if (tx && tx.confirmations && tx.confirmations > 0) {
        return {
          endTime: Date.now(),
          status: 'REFUNDED',
        };
      }
    } catch (e) {
      if (isTransactionNotFoundError(e)) console.warn(e);
      else throw e;
    }
  }

  private async refundSwap({ swap, network, walletId }: NextSwapActionRequest<LiqualitySwapHistoryItem>) {
    const fromClient = this.getClient(network, walletId, swap.from, swap.fromAccountId);
    await this.sendLedgerNotification(swap.fromAccountId, 'Signing required to refund the swap.');
    const asset = assetsAdapter(swap.from)[0];
    const refundTx = await fromClient.swap.refundSwap(
      {
        asset,
        value: new BN(swap.fromAmount),
        recipientAddress: swap.fromCounterPartyAddress,
        refundAddress: swap.fromAddress,
        secretHash: swap.secretHash,
        expiration: swap.swapExpiration,
      },
      swap.fromFundHash,
      swap.fee
    );

    return {
      refundHash: refundTx.hash,
      refundTx,
      status: 'WAITING_FOR_REFUND_CONFIRMATIONS',
    };
  }

  private async reportInitiation(swap: LiqualitySwapHistoryItem) {
    if (await this.hasQuoteExpired(swap)) {
      return { status: 'WAITING_FOR_REFUND' };
    }

    await this.updateOrder(swap);

    return {
      status: 'INITIATION_REPORTED',
    };
  }

  private async confirmInitiation({ swap, network, walletId }: NextSwapActionRequest<LiqualitySwapHistoryItem>) {
    // Jump the step if counter party has already accepted the initiation
    const counterPartyInitiation = await this.findCounterPartyInitiation({
      swap,
      network,
      walletId,
    });
    if (counterPartyInitiation) return counterPartyInitiation;

    const fromClient = this.getClient(network, walletId, swap.from, swap.fromAccountId);

    try {
      const tx = await getTransactionByHash(fromClient, swap.fromFundHash);

      if (tx && tx.confirmations && tx.confirmations > 0) {
        return {
          status: 'INITIATION_CONFIRMED',
        };
      }
    } catch (e) {
      if (e.name === 'TxNotFoundError') console.warn(e);
      else throw e;
    }
  }

  private async findCounterPartyInitiation({
    swap,
    network,
    walletId,
  }: NextSwapActionRequest<LiqualitySwapHistoryItem>) {
    const toClient = this.getClient(network, walletId, swap.to, swap.toAccountId);
    const toAsset = cryptoassets[swap.to];
    const asset = { ...toAsset, isNative: toAsset.type === 'native' } as ChainifyAsset;

    try {
      const tx = await toClient.swap.findInitiateSwapTransaction({
        asset,
        value: new BN(swap.toAmount),
        recipientAddress: swap.toAddress,
        refundAddress: swap.toCounterPartyAddress,
        secretHash: swap.secretHash,
        expiration: swap.nodeSwapExpiration,
      });

      if (tx) {
        const toFundHash = tx.hash;

        const isVerified = await toClient.swap.verifyInitiateSwapTransaction(
          {
            asset,
            value: new BN(swap.toAmount),
            recipientAddress: swap.toAddress,
            refundAddress: swap.toCounterPartyAddress,
            secretHash: swap.secretHash,
            expiration: swap.nodeSwapExpiration,
          },
          toFundHash
        );

        if (isVerified) {
          return {
            toFundHash,
            status: 'CONFIRM_COUNTER_PARTY_INITIATION',
          };
        }
      }
    } catch (e) {
      if (['BlockNotFoundError', 'PendingTxError', 'TxNotFoundError'].includes(e.name)) console.warn(e);
      else throw e;
    }

    // Expiration check should only happen if tx not found
    const expirationUpdates = await this.handleExpirations({
      swap,
      network,
      walletId,
    });

    if (expirationUpdates) {
      return expirationUpdates;
    }
  }

  private async confirmCounterPartyInitiation({
    swap,
    network,
    walletId,
  }: NextSwapActionRequest<LiqualitySwapHistoryItem>) {
    const toClient = this.getClient(network, walletId, swap.to, swap.toAccountId);

    const tx = await getTransactionByHash(toClient, swap.toFundHash);

    if (
      tx &&
      tx.confirmations &&
      tx.confirmations >= getChain(network, cryptoassets[swap.to].chain).safeConfirmations
    ) {
      return {
        status: 'READY_TO_CLAIM',
      };
    }

    // Expiration check should only happen if tx not found
    const expirationUpdates = await this.handleExpirations({
      swap,
      network,
      walletId,
    });
    if (expirationUpdates) {
      return expirationUpdates;
    }
  }

  private async claimSwap({ swap, network, walletId }: NextSwapActionRequest<LiqualitySwapHistoryItem>) {
    const expirationUpdates = await this.handleExpirations({
      swap,
      network,
      walletId,
    });
    if (expirationUpdates) {
      return expirationUpdates;
    }

    const toClient = this.getClient(network, walletId, swap.to, swap.toAccountId);

    await this.sendLedgerNotification(swap.toAccountId, 'Signing required to claim the swap.');

    const asset = assetsAdapter(swap.to)[0];
    const toClaimTx = await toClient.swap.claimSwap(
      {
        asset,
        value: new BN(swap.toAmount),
        recipientAddress: swap.toAddress,
        refundAddress: swap.toCounterPartyAddress,
        secretHash: swap.secretHash,
        expiration: swap.nodeSwapExpiration,
      },
      swap.toFundHash,
      swap.secret,
      swap.claimFee
    );

    return {
      toClaimHash: toClaimTx.hash,
      toClaimTx,
      status: 'WAITING_FOR_CLAIM_CONFIRMATIONS',
    };
  }

  private async hasQuoteExpired(swap: LiqualitySwapHistoryItem) {
    return timestamp() >= swap.expiresAt;
  }

  private async hasChainTimePassed({
    network,
    walletId,
    asset,
    timestamp,
    accountId,
  }: {
    network: Network;
    walletId: WalletId;
    asset: Asset;
    timestamp: number;
    accountId: AccountId;
  }) {
    const client = this.getClient(network, walletId, asset, accountId);
    const maxTries = 3;
    let tries = 0;
    while (tries < maxTries) {
      try {
        const blockNumber = await client.chain.getBlockHeight();
        const latestBlock = await client.chain.getBlockByNumber(blockNumber);
        return latestBlock.timestamp > timestamp;
      } catch (e) {
        tries++;
        if (tries >= maxTries) throw e;
        else {
          console.warn(e);
          await wait(2000);
        }
      }
    }
  }

  private async canRefund({ network, walletId, swap }: NextSwapActionRequest<LiqualitySwapHistoryItem>) {
    return this.hasChainTimePassed({
      network,
      walletId,
      asset: swap.from,
      timestamp: swap.swapExpiration,
      accountId: swap.fromAccountId,
    });
  }

  private async hasSwapExpired({ network, walletId, swap }: NextSwapActionRequest<LiqualitySwapHistoryItem>) {
    return this.hasChainTimePassed({
      network,
      walletId,
      asset: swap.to,
      timestamp: swap.nodeSwapExpiration,
      accountId: swap.toAccountId,
    });
  }

  private async handleExpirations({ network, walletId, swap }: NextSwapActionRequest<LiqualitySwapHistoryItem>) {
    if (await this.canRefund({ swap, network, walletId })) {
      return { status: 'GET_REFUND' };
    }
    if (await this.hasSwapExpired({ swap, network, walletId })) {
      return { status: 'WAITING_FOR_REFUND' };
    }
  }

  private feeUnits = {
    [LiqualityTxTypes.SWAP_INITIATION]: {
      ETH: 165_000,
      RBTC: 165_000,
      BNB: 165_000,
      NEAR: 10_000_000_000_000,
      SOL: 2,
      LUNA: 800_000,
      UST: 800_000,
      MATIC: 165_000,
      ERC20: 200_000, // Contract creation + erc20 transfer
      ARBETH: 2_400_000,
      AVAX: 165_000,
    },
    [LiqualityTxTypes.SWAP_CLAIM]: {
      BTC: 143,
      ETH: 90_000,
      RBTC: 90_000,
      BNB: 90_000,
      MATIC: 90_000,
      NEAR: 8_000_000_000_000,
      SOL: 1,
      LUNA: 800_000,
      UST: 800_000,
      ERC20: 110_000,
      ARBETH: 680_000,
      AVAX: 90_000,
    },
  };
}
