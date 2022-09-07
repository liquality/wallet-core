/* eslint-disable @typescript-eslint/no-explicit-any */
import { ERROR_CODES } from '../../config';
import { LiqualityError } from '../../LiqualityErrors';
import { ErrorParser } from '../ErrorParser';
import ThirdPartyError, { UserActivity } from '../../LiqualityErrors/ThirdPartyError';
import InsufficientFundsError from '../../LiqualityErrors/InsufficientFundsError';
import InsufficientGasFeeError from '../../LiqualityErrors/InsufficientGasFeeError';
import InsufficientLiquidityError from '../../LiqualityErrors/InsufficientLiquidityError';
import InternalError from '../../LiqualityErrors/InternalError';
import UnknownError from '../../LiqualityErrors/UnknownError';

export class OneInchSwapErrorParser extends ErrorParser<OneInchSwapError, OneInchSwapParserDataType> {
  protected _parseError(error: OneInchSwapError, data: OneInchSwapParserDataType): LiqualityError {
    let liqError: LiqualityError;
    let devDesc = '';

    if (error?.name !== 'NodeError') {
      // All OneInch errors must satisfy this because they are already wrapped in chainify
      liqError = new UnknownError();
    } else {
      switch (error?.description?.toLowerCase()) {
        case ONE_INCH_SWAP_ERRORS.INSUFFICIENT_LIQUIDITY:
          liqError = new InsufficientLiquidityError({ from: data.from, to: data.to, amount: data.amount });
          break;
        case ONE_INCH_SWAP_ERRORS.CANNOT_ESTIMATE_1:
          liqError = new ThirdPartyError({ activity: UserActivity.SWAP });
          devDesc = '1inch could not estimate a quote for the swap';
          break;
        case ONE_INCH_SWAP_ERRORS.INSUFFICIENT_GAS_FEE:
          liqError = new InsufficientGasFeeError({ currency: data.from });
          break;
        case ONE_INCH_SWAP_ERRORS.INVALID_TOKEN_ADDRESSES:
          liqError = new InternalError();
          break;
        case ONE_INCH_SWAP_ERRORS.CANNOT_ESTIMATE_WITH_REASON:
          liqError = new ThirdPartyError({ activity: UserActivity.SWAP });
          devDesc = '1inch internal error, could be related to slippage for specific tokens';
          break;
        case ONE_INCH_SWAP_ERRORS.INSUFFICIENT_FUNDS:
          liqError = new InsufficientFundsError({
            currency: data.from,
            availAmt: data.balance,
            neededAmt: data.amount,
          });
          break;
        case ONE_INCH_SWAP_ERRORS.INSUFFICIENT_ALLOWANCE:
          liqError = new InternalError();
          devDesc = 'Check the approval process for 1inch, approvals are not being made correctly';
          break;
        default:
          liqError = new UnknownError();
          break;
      }
    }

    liqError.code = ERROR_CODES.OneInchSwapAPI;
    liqError.devMsg = { desc: devDesc, data };
    liqError.rawError = error as never;

    return liqError;
  }
}

export type OneInchSwapError = {
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

export type OneInchSwapParserDataType = {
  from: string;
  to: string;
  amount: string;
  balance: string;
};

export const ONE_INCH_SWAP_ERRORS = {
  INSUFFICIENT_LIQUIDITY: 'Insufficient liquidity'.toLowerCase(),
  CANNOT_ESTIMATE_1: 'Cannot estimate'.toLowerCase(),
  CANNOT_ESTIMATE_WITH_REASON:
    "Cannot estimate. Don't forget about miner fee. Try to leave the buffer of ETH for gas".toLowerCase(),
  INSUFFICIENT_GAS_FEE: 'You may not have enough ETH balance for gas fee'.toLowerCase(),
  INVALID_TOKEN_ADDRESSES: 'FromTokenAddress cannot be equals to toTokenAddress'.toLowerCase(),
  INSUFFICIENT_FUNDS: 'Not enough balance'.toLowerCase(),
  INSUFFICIENT_ALLOWANCE: 'Not enough allowance'.toLowerCase(),
};
