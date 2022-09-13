export type OneInchError = {
  statusCode: number;
  error: string;
  description: string;
  requestId: string;
  meta: {
    type: string;
    value: string;
  }[];
  name: string;
};

export const ONE_INCH_ERRORS = {
  INSUFFICIENT_LIQUIDITY: /Insufficient liquidity/i,
  CANNOT_ESTIMATE_1: /Cannot estimate/i,
  CANNOT_ESTIMATE_WITH_REASON: /Cannot estimate. Don't forget about miner fee. Try to leave the buffer of ETH for gas/i,
  INSUFFICIENT_GAS_FEE: /You may not have enough ETH balance for gas fee/i,
  INVALID_TOKEN_PAIR: /FromTokenAddress cannot be equals to toTokenAddress/i,
  INVALID_TOKEN_ADDRESS: /\S* is wrong address/i,
  INSUFFICIENT_FUNDS: /Not enough \S* balance/i,
  INSUFFICIENT_ALLOWANCE: /Not enough \S* allowance/i,
  INTERNAL_ERROR: /Internal Server Error/i,
};

export function oneInchInternalErrReason() {
  return 'This could be due to invalid data, for example providing a string for amount instead of a number';
}
