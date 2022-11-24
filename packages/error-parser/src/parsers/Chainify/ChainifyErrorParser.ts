/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ChainifyErrors from '@chainify/errors';
import { LiqualityError } from '../../LiqualityErrors/LiqualityError';
import { ErrorParser } from '../ErrorParser';
import { ChainifyErrorSource } from '.';
import { InternalError, LowSpeedupFeeError, UnknownError } from '../../LiqualityErrors';
import { LedgerErrorParser } from './LedgerErrorParser';
import { getErrorParser } from '../../factory';
import { JsonRPCNodeErrorParser } from './JsonRPCNodeErrorParser';
export class ChainifyErrorParser extends ErrorParser<Error, null> {
  public static readonly errorSource = ChainifyErrorSource;

  protected _parseError(error: Error, data: ChainifyParserDataType): LiqualityError {
    let liqError: LiqualityError;

    switch (error.name) {
      case ChainifyErrors.NodeError.prototype.name:
        return getErrorParser(JsonRPCNodeErrorParser).parseError(error, null);
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
        liqError = new InternalError();
        break;
      case ChainifyErrors.WalletError.prototype.name:
        if (
          error.message.startsWith('Ledger device:') ||
          error.message.startsWith('EthAppPleaseEnableContractData') ||
          error.message.includes('Invalid data received')
        ) {
          return getErrorParser(LedgerErrorParser).parseError(error, null);
        }
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
