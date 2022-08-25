import { unitToCurrency } from '@liquality/cryptoassets';
import { BigNumber } from 'bignumber.js';
import { Asset } from '../store/types';
import cryptoassets from './cryptoassets';

export const VALUE_DECIMALS = 6;

type Amount = number | BigNumber;

export const dp = (amount: Amount | string | BigNumber, coin: Asset) => {
  if (!amount) return amount;
  return new BigNumber(amount).dp(cryptoassets[coin].decimals);
};

export const dpUI = (amount: Amount, dp = VALUE_DECIMALS) => {
  if (!amount) return amount;

  return new BigNumber(amount).dp(dp, BigNumber.ROUND_FLOOR);
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
  return new BigNumber(amount).times(rate);
};

export const fiatToCrypto = (amount: Amount, rate: number) => {
  if (!rate) return amount;
  return new BigNumber(amount).dividedBy(rate).dp(VALUE_DECIMALS, BigNumber.ROUND_FLOOR);
};

export const formatFiat = (amount: BigNumber) => {
  // @ts-ignore
  if (isNaN(amount)) return amount;
  return amount.toFormat(2, BigNumber.ROUND_CEIL);
};

export const formatFiatUI = (amount: number) => {
  const _amount = String(amount).replace(/,/g, '');
  return isNaN(Number(_amount)) ? amount : '$' + amount;
};
