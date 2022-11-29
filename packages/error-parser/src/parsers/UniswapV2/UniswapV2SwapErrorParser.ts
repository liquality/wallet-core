/* eslint-disable @typescript-eslint/no-explicit-any */

import { LiqualityError, UnknownError } from '../../LiqualityErrors';
import { UNISWAP_V2_ERROR_SOURCE_NAME, UNISWAP_V2_ERRORS } from '.';
import { ErrorParser } from '../ErrorParser';
import { ValidationError } from '../../LiqualityErrors/ValidationError';
export class UniswapV2SwapErroParser extends ErrorParser<Error, UniswapV2SwapErrorParserDataType> {
  public static readonly errorSource = UNISWAP_V2_ERROR_SOURCE_NAME;

  protected _parseError(error: Error, data?: UniswapV2SwapErrorParserDataType): LiqualityError {
    let liqError: LiqualityError;
    let desc = '';
    switch (true) {
      case error.message.includes(UNISWAP_V2_ERRORS.UNSUPPORTED_SWAP_METHOD_FOR_TOKEN_TYPE):
        liqError = new ValidationError();
        desc =
          'This is happening because the token involved in the swap is an FOT(fee on transfer) token. the supportingFeeOnTransfer token group of methods should be used. (See https://github.com/Uniswap/interface/issues/835)';
        break;
      default:
        liqError = new UnknownError();
        break;
    }

    liqError.source = UniswapV2SwapErroParser.errorSource;
    liqError.devMsg = {
      desc,
      data: data || {},
    };
    liqError.rawError = error;

    return liqError;
  }
}

export type UniswapV2SwapErrorParserDataType = null;
