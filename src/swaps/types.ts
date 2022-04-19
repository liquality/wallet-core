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
  quote: SwapHistoryItem;
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
