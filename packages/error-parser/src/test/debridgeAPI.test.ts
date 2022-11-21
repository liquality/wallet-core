import { FAKE_ERROR, getError, getErrorAsync } from '.';
import { LiqualityError } from '../LiqualityErrors/LiqualityError';
import {
  getErrorParser,
  InsufficientInputAmountError,
  InternalError,
  PairNotSupportedError,
  ThirdPartyError,
} from '../';
import { DebridgeError, DEBRIDGE_ERRORS } from '../parsers/Debridge';
import { DebridgeAPIErrorParser } from '../parsers/Debridge/DebridgeAPIErrorParser';

describe('DebridgeAPI parser', () => {
  const parser = getErrorParser(DebridgeAPIErrorParser);

  const errorMap = [
    [DEBRIDGE_ERRORS.INVALID_QUERY_PARAMETERS, InternalError.name],
    [DEBRIDGE_ERRORS.SOURCE_AND_DESTINATION_CHAINS_ARE_EQUAL, PairNotSupportedError.name],
    [DEBRIDGE_ERRORS.INCLUDED_GAS_FEE_NOT_COVERED_BY_INPUT_AMOUNT, InsufficientInputAmountError.name],
    [DEBRIDGE_ERRORS.INCLUDED_GAS_FEE_CANNOT_BE_ESTIMATED_FOR_TRANSACTION_BUNDLE, InternalError.name],
    [DEBRIDGE_ERRORS.CONNECTOR_1INCH_RETURNED_ERROR, ThirdPartyError.name],
    [DEBRIDGE_ERRORS.INTERNAL_SERVER_ERROR, ThirdPartyError.name],
    [DEBRIDGE_ERRORS.INTERNAL_SDK_ERROR, ThirdPartyError.name],
  ];

  it('should not log anything to console', async () => {
    const logSpy = jest.spyOn(console, 'log');

    getError(() => {
      return parser.wrap(() => {
        throw FAKE_ERROR;
      }, null);
    });

    await getErrorAsync(async () => {
      return await parser.wrapAsync(async () => {
        throw FAKE_ERROR;
      }, null);
    });

    expect(logSpy).toHaveBeenCalledTimes(0);
  });

  it.each(errorMap)("should map '%s' => '%s'", async (sourceError, liqError) => {
    const validError: DebridgeError = {
      errorCode: 0, // arbitrary code
      errorId: sourceError,
      errorMessage: '',
      errorPayload: {},
    };

    const error: LiqualityError = getError(() => {
      parser.wrap(() => {
        throw validError;
      }, null);
    });

    expect(error.name).toBe(liqError);
    expect(error.source).toBe(DebridgeAPIErrorParser.errorSource);
    expect(error.rawError).toBe(validError);

    const error1: LiqualityError = await getErrorAsync(async () => {
      await parser.wrapAsync(async () => {
        throw validError;
      }, null);
    });

    expect(error1.name).toBe(liqError);
    expect(error1.source).toBe(DebridgeAPIErrorParser.errorSource);
    expect(error1.rawError).toBe(validError);
  });
});
