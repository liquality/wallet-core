import { FAKE_ERROR, getError, getErrorAsync } from '.';
import { LiqualityError } from '../LiqualityErrors/LiqualityError';
import { getErrorParser, ThirdPartyError, ThorchainAPIErrorParser } from '..';
import { THORCHAIN_ERRORS } from '../parsers/Thorchain';
import { NodeError } from '@chainify/errors';

describe('ThorchainAPI parser', () => {
  const parser = getErrorParser(ThorchainAPIErrorParser);

  const errorMap = [[THORCHAIN_ERRORS.NETWORK_ERROR, ThirdPartyError.name]];

  it('should not log anything to console', async () => {
    const logSpy = jest.spyOn(console, 'log');

    getError(() => {
      return parser.wrap(() => {
        throw FAKE_ERROR;
      }, {});
    });

    await getErrorAsync(async () => {
      return await parser.wrapAsync(async () => {
        throw FAKE_ERROR;
      }, {});
    });

    expect(logSpy).toHaveBeenCalledTimes(0);
  });

  it.each(errorMap)("should map '%s' => '%s'", async (sourceError, liqError) => {
    const validError: Error = {
      message: sourceError,
      name: NodeError.prototype.name,
    };

    const error: LiqualityError = getError(() => {
      parser.wrap(() => {
        throw validError;
      }, {});
    });

    expect(error.name).toBe(liqError);
    expect(error.source).toBe(ThorchainAPIErrorParser.errorSource);
    expect(error.rawError).toBe(validError);

    const error1: LiqualityError = await getErrorAsync(async () => {
      await parser.wrapAsync(async () => {
        throw validError;
      }, {});
    });

    expect(error1.name).toBe(liqError);
    expect(error1.source).toBe(ThorchainAPIErrorParser.errorSource);
    expect(error1.rawError).toBe(validError);
  });
});
