/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ChainifyErrors from '@chainify/errors';
import { LiqualityError, UserActivity } from '../../LiqualityErrors/LiqualityError';
import { ErrorParser } from '../ErrorParser';
import { ChainifyErrorSource } from '.';
import { InternalError, LowSpeedupFeeError, ThirdPartyError, UnknownError } from '../../LiqualityErrors';
export class ChainifyErrorParser extends ErrorParser<Error, null> {
  public static readonly errorSource = ChainifyErrorSource;

  protected _parseError(error: Error, data: ChainifyParserDataType): LiqualityError {
    let liqError: LiqualityError;

    switch (error.name) {
      case ChainifyErrors.NodeError.name:
        liqError = new ThirdPartyError({ activity: UserActivity.UNKNOWN });
        break;
      case ChainifyErrors.InvalidAddressError.name:
      case ChainifyErrors.InvalidDestinationAddressError.name:
      case ChainifyErrors.InvalidExpirationError.name:
      case ChainifyErrors.InvalidProviderError.name:
      case ChainifyErrors.InvalidProviderResponseError.name:
      case ChainifyErrors.InvalidSwapParamsError.name:
      case ChainifyErrors.InvalidValueError.name:
      case ChainifyErrors.BlockNotFoundError.name:
      case ChainifyErrors.TxNotFoundError.name:
      case ChainifyErrors.TxFailedError.name:
      case ChainifyErrors.PendingTxError.name:
      case ChainifyErrors.NoProviderError.name:
      case ChainifyErrors.ProviderNotFoundError.name:
      case ChainifyErrors.DuplicateProviderError.name:
      case ChainifyErrors.StandardError.name:
      case ChainifyErrors.UnimplementedMethodError.name:
      case ChainifyErrors.UnsupportedMethodError.name:
      case ChainifyErrors.WalletError.name:
        liqError = new InternalError();
        break;
      case ChainifyErrors.ReplaceFeeInsufficientError.name:
        liqError = new LowSpeedupFeeError();
        break;
      default:
        liqError = new UnknownError();
        break;
    }

    liqError.source = ChainifyErrorParser.errorSource;
    liqError.devMsg = { desc: '', data };
    liqError.rawError = error;

    return liqError;
  }
}

export type ChainifyParserDataType = null;
