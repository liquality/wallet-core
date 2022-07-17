import { unitToCurrency } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import { Asset } from '../store/types';
import cryptoassets from './cryptoassets';

export const VALUE_DECIMALS = 6;

type Amount = number | BN;

export const dp = (amount: Amount | string | BN, coin: Asset) => {
  if (!amount) return amount;
  return new BN(amount).dp(cryptoassets[coin].decimals);
};

export const dpUI = (amount: Amount, dp = VALUE_DECIMALS) => {
  if (!amount) return amount;

  return new BN(amount).dp(dp, BN.ROUND_FLOOR);
};

export const prettyBalance = (amount: Amount, coin: Asset, dp = VALUE_DECIMALS) => {
  if (!amount || !coin) return amount;

  amount = unitToCurrency(cryptoassets[coin], amount);

  return dpUI(amount, dp);
};

export const prettyFiatBalance = (amount: Amount, rate: number) => {
  const fiatAmount = cryptoToFiat(amount, rate);
  // @ts-ignore
  if (isNaN(fiatAmount)) return fiatAmount;
  // @ts-ignore
  // TODO: Types here are all over the place
  return formatFiat(fiatAmount);
};

export const cryptoToFiat = (amount: Amount, rate: number) => {
  if (!rate) return '--';
  return new BN(amount).times(rate);
};

export const fiatToCrypto = (amount: Amount, rate: number) => {
  if (!rate) return amount;
  return new BN(amount).dividedBy(rate).dp(VALUE_DECIMALS, BN.ROUND_FLOOR);
};

export const formatFiat = (amount: BN) => {
  // @ts-ignore
  if (isNaN(amount)) return amount;
  return amount.toFormat(2, BN.ROUND_CEIL);
};

export const formatFiatUI = (amount: number) => {
  return isNaN(amount) ? amount : '$' + amount;
};
