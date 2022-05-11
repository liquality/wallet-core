import { chains, currencyToUnit, unitToCurrency } from '@liquality/cryptoassets';
import { bitcoin, Transaction } from '@liquality/types';
import BN from 'bignumber.js';
import { mapValues } from 'lodash';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { ActionContext } from '../../store';
import { withInterval } from '../../store/actions/performNextAction/utils';
import { SwapHistoryItem } from '../../store/types';
import { prettyBalance } from '../../utils/coinFormatter';
import cryptoassets from '../../utils/cryptoassets';
import { SwapProvider } from '../SwapProvider';
import {
  BaseSwapProviderConfig,
  EstimateFeeRequest,
  NextSwapActionRequest,
  QuoteRequest,
  SwapRequest,
  SwapStatus,
} from '../types';

const FAST_BTC_SATOSHI_FEE = 5000;
const FAST_BTC_PERCENTAGE_FEE = 0.2;

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
  signatures: { signer: string; signature: string }[];
}

export enum FastBtcStatus { // TODO: what else?
  Confirmed = 'confirmed',
}

export enum FastBtcType {
  Deposit = 'deposit',
  Transfer = 'transfer',
}

export interface FastBtcDepositHistory {
  dateAdded: number;
  txHash: string;
  type: FastBtcType;
  status: FastBtcStatus;
  valueBtc: number;
}

export interface FastBtcSwapHistoryItem extends SwapHistoryItem {
  swapTxHash: string;
  swapTx: Transaction<bitcoin.Transaction>;
}

export interface FastBtcSwapProviderConfig extends BaseSwapProviderConfig {
  bridgeEndpoint: string;
}

class FastbtcSwapProvider extends SwapProvider {
  config: FastBtcSwapProviderConfig;
  socketConnection: Socket;

  async connectSocket() {
    if (this.socketConnection && this.socketConnection.connected) return true;

    return new Promise((resolve) => {
      this.socketConnection = io(this.config.bridgeEndpoint, {
        reconnectionDelayMax: 10000,
      });

      this.socketConnection.on('connect', function () {
        resolve(true);
      });

      this.socketConnection.on('disconnect', function () {
        console.log('FastBtc socket disconnected');
      });
    });
  }

  async getSupportedPairs() {
    const validAmountRange = await this._getTxAmount();
    return [
      {
        from: 'BTC',
        to: 'RBTC',
        rate: '0.998',
        max: currencyToUnit(cryptoassets.BTC, new BN(validAmountRange.max)).toFixed(),
        min: currencyToUnit(cryptoassets.BTC, new BN(validAmountRange.min)).toFixed(),
      },
    ];
  }

  async _getHistory(address: string): Promise<FastBtcDepositHistory[]> {
    await this.connectSocket();
    return new Promise((resolve, reject) => {
      this.socketConnection.emit('getDepositHistory', address, (res: any) => {
        if (res && res.error) {
          reject(res.err);
        }
        resolve(res);
      });
    });
  }

  async _getAddress(address: string): Promise<FastBtcDepositAddress> {
    await this.connectSocket();
    return new Promise((resolve, reject) => {
      this.socketConnection.emit('getDepositAddress', address, (err: Error, res: any) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }

  async _getTxAmount(): Promise<FastBtcTxAmount> {
    await this.connectSocket();
    return new Promise((resolve) => {
      this.socketConnection.emit('txAmount', (res: any) => {
        resolve(res);
      });
    });
  }

  async getQuote(quoteRequest: QuoteRequest) {
    const { from, to, amount } = quoteRequest;
    if (from !== 'BTC' || to !== 'RBTC') {
      return null;
    }
    const fromAmountInUnit = new BN(currencyToUnit(cryptoassets[from], new BN(amount)));
    const validAmountRange = await this._getTxAmount();
    const isQuoteAmountInTheRange = amount.lte(validAmountRange.max) && amount.gte(validAmountRange.min);
    if (!isQuoteAmountInTheRange) return null;
    const toAmountInUnit = new BN(
      currencyToUnit(cryptoassets[to], new BN(amount).minus(unitToCurrency(cryptoassets[from], FAST_BTC_SATOSHI_FEE)))
    ).times(1 - FAST_BTC_PERCENTAGE_FEE / 100);
    return {
      from,
      to,
      fromAmount: fromAmountInUnit.toFixed(),
      toAmount: toAmountInUnit.toFixed(),
    };
  }

  async sendSwap({ network, walletId, quote }: SwapRequest) {
    if (quote.from !== 'BTC' || quote.to !== 'RBTC') return null;
    const toChain = cryptoassets[quote.to].chain;
    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
    const toAddressRaw = await this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);
    const toAddress = chains[toChain].formatAddress(toAddressRaw, network);
    const relayAddress = await this._getAddress(toAddress);

    await this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
    const swapTx = await client.chain.sendTransaction({
      to: relayAddress.btcadr,
      value: new BN(quote.fromAmount),
      data: '',
      fee: quote.fee,
    });
    return {
      status: 'WAITING_FOR_SEND_CONFIRMATIONS',
      swapTx,
      swapTxHash: swapTx.hash,
    };
  }

  async newSwap({ network, walletId, quote }: SwapRequest) {
    const updates = await this.sendSwap({ network, walletId, quote });

    return {
      id: uuidv4(),
      fee: quote.fee,
      slippage: 50,
      ...updates,
    };
  }

  async estimateFees({ network, walletId, asset, txType, quote, feePrices, max }: EstimateFeeRequest) {
    if (txType === this._txTypes().SWAP && asset === 'BTC') {
      const client = this.getClient(network, walletId, asset, quote.fromAccountId);
      const value = max ? undefined : new BN(quote.fromAmount);
      const txs = feePrices.map((fee) => ({ to: '', value, fee }));
      const totalFees = await client.getMethod('getTotalFees')(txs, max);
      return mapValues(totalFees, (f) => unitToCurrency(cryptoassets[asset], f));
    }
    return null;
  }

  async waitForSendConfirmations({ swap, network, walletId }: NextSwapActionRequest<FastBtcSwapHistoryItem>) {
    const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);

    try {
      const tx = await client.chain.getTransactionByHash(swap.swapTxHash);
      if (tx && tx.confirmations && tx.confirmations > 0) {
        return {
          endTime: Date.now(),
          status: 'WAITING_FOR_RECEIVE',
        };
      }
    } catch (e) {
      if (e.name === 'TxNotFoundError') console.warn(e);
      else throw e;
    }
  }

  async waitForReceive({ swap, network, walletId }: NextSwapActionRequest<FastBtcSwapHistoryItem>) {
    try {
      const toChain = cryptoassets[swap.to].chain;
      const toAddressRaw = await this.getSwapAddress(network, walletId, swap.to, swap.toAccountId);
      const toAddress = chains[toChain].formatAddress(toAddressRaw, network);
      const addressHistory = (await this._getHistory(toAddress)).sort((a, b) =>
        new Date(a.dateAdded).getTime() > new Date(b.dateAdded).getTime() ? 1 : -1
      );
      let isDepositConfirmed = false;
      let isReceiveConfirmed = false;
      let depositConfirmationDate = 0;
      let depositAmount = 0;
      for (const transaction of addressHistory) {
        if (
          transaction.txHash === swap.swapTxHash &&
          transaction.status === FastBtcStatus.Confirmed &&
          transaction.type === FastBtcType.Deposit
        ) {
          isDepositConfirmed = true;
          depositConfirmationDate = new Date(transaction.dateAdded).getTime();
          depositAmount = transaction.valueBtc;
        } else if (
          isDepositConfirmed &&
          transaction.status === FastBtcStatus.Confirmed &&
          transaction.type === FastBtcType.Transfer &&
          transaction.valueBtc === depositAmount &&
          new Date(transaction.dateAdded).getTime() - depositConfirmationDate > 0 &&
          new Date(transaction.dateAdded).getTime() - depositConfirmationDate < 86400000
        ) {
          isReceiveConfirmed = true;
        }
      }
      if (isDepositConfirmed && isReceiveConfirmed) {
        return {
          endTime: Date.now(),
          status: 'SUCCESS',
        };
      }
    } catch (e) {
      console.log(e);
    }
  }

  async performNextSwapAction(
    _store: ActionContext,
    { network, walletId, swap }: NextSwapActionRequest<FastBtcSwapHistoryItem>
  ) {
    switch (swap.status) {
      case 'WAITING_FOR_SEND_CONFIRMATIONS':
        return withInterval(async () => this.waitForSendConfirmations({ swap, network, walletId }));
      case 'WAITING_FOR_RECEIVE':
        return withInterval(async () => this.waitForReceive({ swap, network, walletId }));
    }
  }

  protected _getStatuses(): Record<string, SwapStatus> {
    return {
      WAITING_FOR_SEND_CONFIRMATIONS: {
        step: 0,
        label: 'Swapping {from}',
        filterStatus: 'PENDING',
        notification() {
          return {
            message: 'Swap initiated',
          };
        },
      },
      WAITING_FOR_RECEIVE: {
        step: 1,
        label: 'Swapping {from}',
        filterStatus: 'PENDING',
      },
      SUCCESS: {
        step: 2,
        label: 'Completed',
        filterStatus: 'COMPLETED',
        notification(swap: any) {
          return {
            message: `Swap completed, ${prettyBalance(swap.toAmount, swap.to)} ${swap.to} ready to use`,
          };
        },
      },
      FAILED: {
        step: 2,
        label: 'Swap Failed',
        filterStatus: 'REFUNDED',
        notification() {
          return {
            message: 'Swap failed',
          };
        },
      },
    };
  }

  protected _txTypes() {
    return {
      SWAP: 'SWAP',
    };
  }

  protected _fromTxType(): string | null {
    return this._txTypes().SWAP;
  }

  protected _toTxType(): string | null {
    return null;
  }

  protected _timelineDiagramSteps(): string[] {
    return ['SWAP'];
  }

  protected _totalSteps(): number {
    return 3;
  }
}

export { FastbtcSwapProvider };
