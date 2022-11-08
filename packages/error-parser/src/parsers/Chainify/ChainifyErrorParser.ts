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
      case ChainifyErrors.NodeError.prototype.name:
        liqError = new ThirdPartyError({ activity: UserActivity.UNKNOWN });
        break;
      case ChainifyErrors.InvalidAddressError.prototype.name:
      case ChainifyErrors.InvalidDestinationAddressError.prototype.name:
      case ChainifyErrors.InvalidExpirationError.prototype.name:
      case ChainifyErrors.InvalidProviderError.prototype.name:
      case ChainifyErrors.InvalidProviderResponseError.prototype.name:
      case ChainifyErrors.InvalidSwapParamsError.prototype.name:
      case ChainifyErrors.InvalidValueError.prototype.name:
      case ChainifyErrors.BlockNotFoundError.prototype.name:
      case ChainifyErrors.TxNotFoundError.prototype.name:
      case ChainifyErrors.TxFailedError.prototype.name:
      case ChainifyErrors.PendingTxError.prototype.name:
      case ChainifyErrors.NoProviderError.prototype.name:
      case ChainifyErrors.ProviderNotFoundError.prototype.name:
      case ChainifyErrors.DuplicateProviderError.prototype.name:
      case ChainifyErrors.StandardError.prototype.name:
      case ChainifyErrors.UnimplementedMethodError.prototype.name:
      case ChainifyErrors.UnsupportedMethodError.prototype.name:
      case ChainifyErrors.WalletError.prototype.name:
        liqError = new InternalError();
        break;
      case ChainifyErrors.ReplaceFeeInsufficientError.prototype.name:
        liqError = new LowSpeedupFeeError();
        break;
      default:
        liqError = new UnknownError();
        break;
    }

    liqError.source = ChainifyErrorParser.errorSource;
    liqError.devMsg = { desc: '', data: data || {} };
    liqError.rawError = error;

    return liqError;
  }
}

export type ChainifyParserDataType = null;
