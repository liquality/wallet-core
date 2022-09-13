import { LifiQuoteRequest } from '@liquality/wallet-core/src/swaps/lifi/LifiSwapProvider';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { LiqualityError } from '../../LiqualityErrors';
import { ErrorParser } from '../ErrorParser';
import PairNotSupported, { UserActivity } from '../../LiqualityErrors/PairNotSupportedError';
import InternalError from '../../LiqualityErrors/InternalError';
import UnknownError from '../../LiqualityErrors/UnknownError';
import InsufficientInputAmountError from '../../LiqualityErrors/InsufficientInputAmountError';
import HighInputAmountError from '../../LiqualityErrors/HighInputAmountError';
import InsufficientLiquidityError from '../../LiqualityErrors/InsufficientLiquidityError';
import ThirdPartyError from '../../LiqualityErrors/ThirdPartyError';

import { LifiQuoteError, lifiQuoteErrorSource, LIFI_QUOTE_ERRORS, LIFI_ERROR_REASON, ToolErrorCode } from '.';

export class LifiQuoteErrorParser extends ErrorParser<LifiQuoteError, LifiQuoteRequest> {
  public static readonly errorSource = lifiQuoteErrorSource;

  protected _parseError(error: LifiQuoteError, data: LifiQuoteRequest): LiqualityError {
    let liqError: LiqualityError;
    let devDesc = '';

    if (!error.message) {
      liqError = new UnknownError();
    } else {
      const errorDesc = error?.message;
      switch (true) {
        case LIFI_QUOTE_ERRORS.UnknownAddressOrSymbol.test(errorDesc):
        case LIFI_QUOTE_ERRORS.InvalidAddress.test(errorDesc):
        case LIFI_QUOTE_ERRORS.InvalidChain.test(errorDesc):
          devDesc = LIFI_ERROR_REASON.IncorrectInputs;
          liqError = new InternalError();
          break;
        case LIFI_QUOTE_ERRORS.NoToolsCanCompleteTheAction.test(errorDesc):
          liqError = new PairNotSupported({ activity: UserActivity.SWAP });
          break;
        case LIFI_QUOTE_ERRORS.NoQuoteFound.test(errorDesc): {
          const errorCodes = error.errors.map((toolError) => toolError.code);
          switch (true) {
            case errorCodes.includes(ToolErrorCode.AMOUNT_TOO_LOW):
            case errorCodes.includes(ToolErrorCode.FEES_HGHER_THAN_AMOUNT):
              liqError = new InsufficientInputAmountError();
              break;
            case errorCodes.includes(ToolErrorCode.AMOUNT_TOO_HIGH):
              liqError = new HighInputAmountError();
              break;
            case errorCodes.includes(ToolErrorCode.INSUFFICIENT_LIQUIDITY):
              liqError = new InsufficientLiquidityError({
                from: data.fromToken,
                to: data.toToken,
                amount: data.fromAmount,
              });
              break;
            case errorCodes.includes(ToolErrorCode.TOOL_TIMEOUT):
            case errorCodes.includes(ToolErrorCode.RPC_ERROR):
              liqError = new ThirdPartyError({ activity: UserActivity.SWAP });
              break;
            default:
              devDesc = LIFI_ERROR_REASON.LifiSubServicesFailed;
              liqError = new UnknownError();
              break;
          }
          break;
        }
        default:
          liqError = new UnknownError();
          break;
      }
    }

    liqError.source = LifiQuoteErrorParser.errorSource;
    liqError.devMsg = { desc: devDesc, data };
    liqError.rawError = error as never;

    return liqError;
  }
}
