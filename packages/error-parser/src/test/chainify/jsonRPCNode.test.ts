import { FAKE_ERROR, getError, getErrorAsync } from '..';
import { LiqualityError } from '../../LiqualityErrors/LiqualityError';
import { getErrorParser, InsufficientGasFeeError } from '../../';
import { ChainifyErrorParser } from '../../parsers';
import { JsonRPCNodeErrorParser } from '../../parsers/Chainify/JsonRPCNodeErrorParser';

describe('JsonRPCNodeError parser', () => {
  const parser = getErrorParser(ChainifyErrorParser);

  const rskInsufficientGasPriceError =
    'processing response error (body={"jsonrpc":"2.0","error":{"code":-32010,"message":"transaction\'s gas price lower than block\'s minimum"},"id":44}, error={"code":-32010}, requestBody="{"method":"eth_sendRawTransaction","params":["0xf9016a828334808301a012944cada3b127fd31921127409a86a71d0a7cb7a85b80b90104e60e2b520000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000016c487299760dd3383f188249a4d873d3e29f3910000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000003dfcb407b3e3817427649829cb1b4b0eeba4b65e00000000000000000000000000000000000000000000000000000000000000008228bca0b90cfbeebbee57a0179252d61fb028f878f7b00f6468d5399e15ab225ed5c7e8a031af41679a9e868af5d02c67accab79e61b5356d63c554bd9c9b829a9acbc521"],"id":44,"jsonrpc":"2.0"}", requestMethod="POST", url="https://infura.io", code=SERVER_ERROR, version=web/5.0.2)';

  const errorMap = [[rskInsufficientGasPriceError, InsufficientGasFeeError.name]];

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
    const validError = {
      message: sourceError,
      name: 'NodeError',
    };

    const error: LiqualityError = getError(() => {
      parser.wrap(() => {
        throw validError;
      }, null);
    });

    expect(error.name).toBe(liqError);
    expect(error.source).toBe(JsonRPCNodeErrorParser.errorSource);
    expect(error.rawError).toBe(validError);

    const error1: LiqualityError = await getErrorAsync(async () => {
      await parser.wrapAsync(async () => {
        throw validError;
      }, null);
    });

    expect(error1.name).toBe(liqError);
    expect(error1.source).toBe(JsonRPCNodeErrorParser.errorSource);
    expect(error1.rawError).toBe(validError);
  });
});
