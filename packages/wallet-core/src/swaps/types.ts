import BigNumber from 'bignumber.js';
import { SwapProviderDefinition } from '../build.config';
import { AccountId, Asset, Network, SwapHistoryItem } from '../store/types';

export interface BaseSwapProviderConfig extends SwapProviderDefinition {
  providerId: string;
}

export interface LiqualityBoostSwapProviderConfig extends BaseSwapProviderConfig {
  network: Network;
  supportedBridgeAssets: Asset[];
}

export interface GetQuoteResult {
  fromAmount: string;
  toAmount: string;
}

export interface SwapQuote extends GetQuoteResult {
  from: Asset;
  to: Asset;
  provider: string;
  fromAccountId: AccountId;
  toAccountId: AccountId;
  path?: string[] | null;
  slippage?: number;
}

export type QuoteRequest = {
  network: Network;
  from: Asset;
  to: Asset;
  amount: BigNumber;
};

export type SwapRequest<T = SwapHistoryItem> = {
  network: Network;
  walletId: string;
  quote: T;
};

export type NextSwapActionRequest<T = SwapHistoryItem> = {
  network: Network;
  walletId: string;
  swap: T;
};

export type EstimateFeeRequest<T = string, Q = SwapQuote> = {
  network: Network;
  walletId: string;
  asset: Asset;
  txType: T;
  quote: Q;
  feePrices: number[];
  feePricesL1?: number[];
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

export type ActionStatus = {
  endTime: number;
  status: string;
};
