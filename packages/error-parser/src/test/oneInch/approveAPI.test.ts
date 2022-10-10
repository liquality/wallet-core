import { OneInchError, ONE_INCH_ERRORS } from '../../parsers/OneInchAPI';
import { FAKE_ERROR, getError } from '..';
import { LiqualityError } from '../../LiqualityErrors';
import RandExp = require('randexp');
import { getParser, OneInchApproveErrorParser } from '../..';
import ThirdPartyError from '../../LiqualityErrors/ThirdPartyError';
import InternalError from '../../LiqualityErrors/InternalError';
import UnknownError from '../../LiqualityErrors/UnknownError';

describe('OneInchApproveAPI parser', () => {
  const parser = getParser(OneInchApproveErrorParser);

  const errorMap = [
    [ONE_INCH_ERRORS.INTERNAL_ERROR, ThirdPartyError.name],
    [ONE_INCH_ERRORS.INVALID_TOKEN_ADDRESS, InternalError.name],
  ];

  it('should not log anything to console', () => {
    const logSpy = jest.spyOn(console, 'log');

    getError(() => {
      return parser.wrap(() => {
        throw FAKE_ERROR;
      }, null);
    });

    expect(logSpy).toHaveBeenCalledTimes(0);
  });

  it.each(errorMap)("should map '%s' => '%s'", (sourceError, liqError) => {
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
      }, null);
    });

    expect(error.name).toBe(liqError);
    expect(error.source).toBe(OneInchApproveErrorParser.errorSource);
    expect(error.devMsg.data).toBe(null);
    expect(error.rawError).toBe(validError);
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
  it.each(wrongErrors)('Should return unknown error when %s', (_test, error) => {
    const liqError: LiqualityError = getError(() => {
      parser.wrap(() => {
        throw error;
      }, null);
    });
    expect(liqError.name).toBe(UnknownError.name);
  });
});
