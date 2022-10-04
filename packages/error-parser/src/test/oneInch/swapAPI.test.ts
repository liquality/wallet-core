import { OneInchError, ONE_INCH_ERRORS } from '../../parsers/OneInchAPI';
import { FAKE_ERROR, getError, getErrorAsync } from '..';
import { LiqualityError } from '../../LiqualityErrors';
import RandExp = require('randexp');
import { getErrorParser, OneInchSwapErrorParser } from '../../';
import { OneInchSwapParserDataType } from '../../parsers';
import InternalError from '../../LiqualityErrors/InternalError';
import InsufficientFundsError from '../../LiqualityErrors/InsufficientFundsError';
import InsufficientGasFeeError from '../../LiqualityErrors/InsufficientGasFeeError';
import InsufficientLiquidityError from '../../LiqualityErrors/InsufficientLiquidityError';
import ThirdPartyError from '../../LiqualityErrors/ThirdPartyError';
import UnknownError from '../../LiqualityErrors/UnknownError';

describe('OneInchSwapAPI parser', () => {
  const data: OneInchSwapParserDataType = {
    from: 'ETH',
    to: 'USDT',
    amount: '1900',
    balance: '1000',
  };

  const parser = getErrorParser(OneInchSwapErrorParser);

  const errorMap = [
    [ONE_INCH_ERRORS.CANNOT_ESTIMATE_1, ThirdPartyError.name],
    [ONE_INCH_ERRORS.CANNOT_ESTIMATE_WITH_REASON, ThirdPartyError.name],
    [ONE_INCH_ERRORS.INSUFFICIENT_ALLOWANCE, InternalError.name],
    [ONE_INCH_ERRORS.INSUFFICIENT_FUNDS, InsufficientFundsError.name],
    [ONE_INCH_ERRORS.INSUFFICIENT_GAS_FEE, InsufficientGasFeeError.name],
    [ONE_INCH_ERRORS.INSUFFICIENT_LIQUIDITY, InsufficientLiquidityError.name],
    [ONE_INCH_ERRORS.INTERNAL_ERROR, ThirdPartyError.name],
    [ONE_INCH_ERRORS.INVALID_TOKEN_PAIR, InternalError.name],
    [ONE_INCH_ERRORS.INVALID_TOKEN_ADDRESS, InternalError.name],
  ];

  it('should not log anything to console', async () => {
    const logSpy = jest.spyOn(console, 'log');

    getError(() => {
      return parser.wrap(() => {
        throw FAKE_ERROR;
      }, data);
    });

    await getErrorAsync(async () => {
      return await parser.wrapAsync(async () => {
        throw FAKE_ERROR;
      }, data);
    });

    expect(logSpy).toHaveBeenCalledTimes(0);
  });

  it.each(errorMap)("should map '%s' => '%s'", async (sourceError, liqError) => {
    const validError: OneInchError = {
      statusCode: 400,
      error: 'Bad Request',
      description: new RandExp(sourceError).gen(),
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
    expect(error.source).toBe(OneInchSwapErrorParser.errorSource);
    expect(error.devMsg.data).toBe(data);
    expect(error.rawError).toBe(validError);

    const error1: LiqualityError = await getErrorAsync(async () => {
      await parser.wrapAsync(async () => {
        throw validError;
      }, data);
    });

    expect(error1.name).toBe(liqError);
    expect(error1.source).toBe(OneInchSwapErrorParser.errorSource);
    expect(error1.devMsg.data).toBe(data);
    expect(error1.rawError).toBe(validError);
  });

  const wrongErrors = [
    ['error structure is incorrect', FAKE_ERROR],
    [
      'name is not nodeError',
      {
        description: new RandExp(ONE_INCH_ERRORS.INSUFFICIENT_FUNDS).gen(),
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
  it.each(wrongErrors)('Should return unknown error when %s', async (_test, error) => {
    const liqError: LiqualityError = getError(() => {
      parser.wrap(() => {
        throw error;
      }, data);
    });
    expect(liqError.name).toBe(UnknownError.name);

    const liqError1: LiqualityError = await getErrorAsync(async () => {
      await parser.wrapAsync(() => {
        throw error;
      }, data);
    });
    expect(liqError1.name).toBe(UnknownError.name);
  });
});
