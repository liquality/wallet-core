/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  InsufficientInputAmountError,
  InternalError,
  LiqualityError,
  PairNotSupportedError,
  ThirdPartyError,
  UnknownError,
} from '../../LiqualityErrors';
import { DEBRIDGE_ERROR_SOURCE_NAME, DEBRIDGE_ERRORS, DebridgeError } from '.';
import { ErrorParser } from '../ErrorParser';
export class DebridgeAPIErrorParser extends ErrorParser<DebridgeError, DebridgeAPIErrorParserDataType> {
  public static readonly errorSource = DEBRIDGE_ERROR_SOURCE_NAME;

  protected _parseError(error: DebridgeError): LiqualityError {
    let liqError: LiqualityError;
    let desc = '';
    switch (error.errorId) {
      case DEBRIDGE_ERRORS.INVALID_QUERY_PARAMETERS:
        liqError = new InternalError();
        break;
      case DEBRIDGE_ERRORS.SOURCE_AND_DESTINATION_CHAINS_ARE_EQUAL:
        liqError = new PairNotSupportedError();
        break;
      case DEBRIDGE_ERRORS.INCLUDED_GAS_FEE_NOT_COVERED_BY_INPUT_AMOUNT:
        liqError = new InsufficientInputAmountError();
        desc =
          'see https://docs.debridge.finance/build-with-debridge/getting-started#:~:text=to%20understand%20each.-,executionFee,-(or%20included%20gas';
        break;
      case DEBRIDGE_ERRORS.INCLUDED_GAS_FEE_CANNOT_BE_ESTIMATED_FOR_TRANSACTION_BUNDLE:
        liqError = new InternalError();
        desc =
          "Perhaps 'dstBaseGasAmount' param is not set. See https://deswap.debridge.finance/v1.0/#/deSwap/AppControllerV10_getTransaction:~:text=Amount%20of%20gas,our%20backend%20server";
        break;
      case DEBRIDGE_ERRORS.CONNECTOR_1INCH_RETURNED_ERROR:
      case DEBRIDGE_ERRORS.INTERNAL_SERVER_ERROR:
      case DEBRIDGE_ERRORS.INTERNAL_SDK_ERROR:
        liqError = new ThirdPartyError();
        break;
      default:
        liqError = new UnknownError();
        break;
    }

    liqError.source = DebridgeAPIErrorParser.errorSource;
    liqError.devMsg = {
      desc,
      data: {},
    };
    liqError.rawError = error;

    return liqError;
  }
}

export type DebridgeAPIErrorParserDataType = null;
