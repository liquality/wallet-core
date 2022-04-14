import BigNumber from 'bignumber.js';
import { AccountId, Asset, Network, SwapHistoryItem } from '../store/types';

export interface GetQuoteResult {
  from: Asset;
  to: Asset;
  fromAmount: BigNumber;
  toAmount: BigNumber;
}

export interface SwapQuote extends GetQuoteResult {
  provider: string;
  fromAccountId: AccountId;
  toAccountId: AccountId;
}

export type QuoteRequest = {
  network: Network;
  from: string;
  to: string;
  amount: BigNumber;
};

export type SwapRequest = {
  network: Network;
  walletId: string;
  quote: SwapQuote;
};

export type NextSwapActionRequest = {
  network: Network;
  walletId: string;
  swap: SwapHistoryItem;
};

export type EstimateFeeRequest = {
  network: Network;
  walletId: string;
  asset: Asset;
  txType: string;
  quote: SwapQuote;
  feePrices: number[];
  max: boolean;
};

export type EstimateFeeResponse = {
  [price: number]: BigNumber;
};

export type SwapStatus = {
  step: number;
  label: string;
  filterStatus: string;
  notification?: (swap?: unknown) => { message: string };
};
