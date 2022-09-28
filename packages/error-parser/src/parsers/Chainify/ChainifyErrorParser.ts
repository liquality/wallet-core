/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ChainifyErrors from '@chainify/errors';
import { LiqualityError } from '../../LiqualityErrors';
import { ErrorParser } from '../ErrorParser';
import ThirdPartyError from '../../LiqualityErrors/ThirdPartyError';
import InternalError from '../../LiqualityErrors/InternalError';
import UnknownError from '../../LiqualityErrors/UnknownError';
import { ChainifyErrorSource } from '.';
import LowSpeedupFeeError from '../../LiqualityErrors/LowSpeedupFeeError';

export class ChainifyErrorParser extends ErrorParser<Error, null> {
  public static readonly errorSource = ChainifyErrorSource;

  protected _parseError(error: Error, data: ChainifyParserDataType): LiqualityError {
    let liqError: LiqualityError;

    switch (error.name) {
      case ChainifyErrors.NodeError.name:
        liqError = new ThirdPartyError();
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
    liqError.rawError = error as never;

    return liqError;
  }
}

export type ChainifyParserDataType = null;
