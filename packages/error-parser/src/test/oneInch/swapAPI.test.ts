/* eslint-disable jest/no-commented-out-tests */
// Write tests here to ensure the following

import { FAKE_ERROR, getError } from '..';
import { ERROR_CODES } from '../../config';
import { createParser } from '../../factory';
import { LiqualityError } from '../../LiqualityErrors';
import {
  OneInchSwapError,
  OneInchSwapParserDataType,
  ONE_INCH_SWAP_ERRORS,
} from '../../parsers/OneInchAPI/SwapErrorParser';
import { ErrorSource, ErrorType } from '../../types/types';

describe('OneInchSwapAPI parser', () => {
  const data: OneInchSwapParserDataType = {
    from: 'ETH',
    to: 'USDT',
    amount: '1900',
    balance: '1000',
  };

  const parser = createParser(ErrorSource.OneInchSwapAPI);

  const errorMap = [
    [ONE_INCH_SWAP_ERRORS.CANNOT_ESTIMATE_1, ErrorType.ThirdPartyError],
    [ONE_INCH_SWAP_ERRORS.CANNOT_ESTIMATE_WITH_REASON, ErrorType.ThirdPartyError],
    [ONE_INCH_SWAP_ERRORS.INSUFFICIENT_ALLOWANCE, ErrorType.InternalError],
    [ONE_INCH_SWAP_ERRORS.INSUFFICIENT_FUNDS, ErrorType.InsufficientFundsError],
    [ONE_INCH_SWAP_ERRORS.INSUFFICIENT_GAS_FEE, ErrorType.InsufficientGasFeeError],
    [ONE_INCH_SWAP_ERRORS.INSUFFICIENT_LIQUIDITY, ErrorType.InsufficientLiquidityError],
  ];

  it('should not log anything to console', () => {
    const logSpy = jest.spyOn(console, 'log');

    getError(() => {
      return parser.wrap(() => {
        throw FAKE_ERROR;
      }, data);
    });

    expect(logSpy).toHaveBeenCalledTimes(0);
  });

  it.each(errorMap)("should map '%s' => '%s'", (sourceError, liqError) => {
    const validError: OneInchSwapError = {
      statusCode: 400,
      error: 'Bad Request',
      description: sourceError,
      requestId: 'string',
      meta: [
        {
          type: 'string',
          value: 'string',
        },
      ],
      name: 'NodeError',
    };

    const error: LiqualityError = getError(() => {
      parser.wrap(() => {
        throw validError;
      }, data);
    });

    expect(error.name).toBe(liqError);
    expect(error.code).toBe(ERROR_CODES.OneInchSwapAPI);
    expect(error.devMsg.data).toBe(data);
    expect(error.rawError).toBe(validError);
  });

  const wrongErrors = [
    ['error structure is incorrect', FAKE_ERROR],
    [
      'name is not nodeError',
      {
        description: ONE_INCH_SWAP_ERRORS.INSUFFICIENT_FUNDS,
        name: 'NodeErrr',
      },
    ],
    [
      'description is incorrect',
      {
        description: FAKE_ERROR,
        name: 'NodeError',
      },
    ],
  ];
  it.each(wrongErrors)('Should return unknown error when %s', (_test, error) => {
    const liqError: LiqualityError = getError(() => {
      parser.wrap(() => {
        throw error;
      }, data);
    });
    expect(liqError.name).toBe(ErrorType.UnknownError);
  });
});
