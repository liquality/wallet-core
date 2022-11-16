/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  LedgerAppMismatchError,
  LedgerDappConflictError,
  LedgerDeviceLockedError,
  LedgerDeviceNotUpdatedError,
  LiqualityError,
  UnknownError,
} from '../../LiqualityErrors';
import { LEDGER_ERROR_SOURCE_NAME, LEDGER_ERRORS } from '.';
import { ErrorParser } from '../ErrorParser';
export class LedgerErrorParser extends ErrorParser<Error, LedgerParserDataType> {
  public static readonly errorSource = LEDGER_ERROR_SOURCE_NAME;

  protected _parseError(error: Error): LiqualityError {
    let liqError: LiqualityError;
    switch (error.message) {
      case LEDGER_ERRORS.APP_MISMATCH_ERROR:
      case LEDGER_ERRORS.APP_NOT_SELECTED_ERROR:
        liqError = new LedgerAppMismatchError();
        break;
      case LEDGER_ERRORS.DAPP_CONFLICT_ERROR:
        liqError = new LedgerDappConflictError();
        break;
      case LEDGER_ERRORS.DEVICE_LOCKED_ERROR:
        liqError = new LedgerDeviceLockedError();
        break;
      case LEDGER_ERRORS.NOT_UPDATED_ERROR:
      case LEDGER_ERRORS.INVALID_DATA_ERROR:
        liqError = new LedgerDeviceNotUpdatedError();
        break;
      default:
        liqError = new UnknownError();
        break;
    }

    liqError.source = LedgerErrorParser.errorSource;
    liqError.devMsg = {
      desc: 'see (https://support.ledger.com/hc/en-us/articles/5789603823645-Ledger-MetaMask-common-error-messages?support=true) and (https://developerjesse.com/2022/01/18/ledger-error-codes.html)',
      data: {},
    };
    liqError.rawError = error;

    return liqError;
  }
}

export type LedgerParserDataType = null;
