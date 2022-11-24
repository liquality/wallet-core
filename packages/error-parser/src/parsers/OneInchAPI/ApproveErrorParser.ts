/* eslint-disable @typescript-eslint/no-explicit-any */
import { LiqualityError, UserActivity } from '../../LiqualityErrors/LiqualityError';
import { ErrorParser } from '../ErrorParser';
import { oneInchInternalErrReason, OneInchError, ONE_INCH_ERRORS, oneInchApproveSourceName } from '.';
import { InternalError, PairNotSupportedError, ThirdPartyError, UnknownError } from '../../LiqualityErrors';
import { is1001ValidationError } from '../../utils';

// eslint-disable-next-line @typescript-eslint/ban-types
export class OneInchApproveErrorParser extends ErrorParser<OneInchError, null> {
  public static readonly errorSource = oneInchApproveSourceName;

  protected _parseError(error: OneInchError): LiqualityError {
    let liqError: LiqualityError;
    let devDesc = '';

    if (is1001ValidationError(error)) {
      liqError = new PairNotSupportedError();
    } else if (error?.name !== 'NodeError') {
      // All OneInch errors must satisfy this because they are already wrapped in chainify
      liqError = new UnknownError();
    } else {
      const errorDesc = error?.description;
      switch (true) {
        case ONE_INCH_ERRORS.INTERNAL_ERROR.test(errorDesc):
          liqError = new ThirdPartyError({ activity: UserActivity.SWAP });
          devDesc = oneInchInternalErrReason();
          break;
        case ONE_INCH_ERRORS.INVALID_TOKEN_ADDRESS.test(errorDesc):
          liqError = new InternalError();
          break;
        default:
          liqError = new UnknownError();
          break;
      }
    }

    liqError.source = OneInchApproveErrorParser.errorSource;
    liqError.devMsg = { desc: devDesc, data: {} };
    liqError.rawError = error;

    return liqError;
  }
}
