import { LifiQuoteError, LIFI_QUOTE_ERRORS, ToolErrorCode } from '../../parsers/LifiAPI';
import { getError } from '..';
import { LiqualityError } from '../../LiqualityErrors/LiqualityError';
import RandExp = require('randexp');
import {
  getErrorParser,
  HighInputAmountError,
  InsufficientInputAmountError,
  InsufficientLiquidityError,
  InternalError,
  LifiQuoteErrorParser,
  PairNotSupportedError,
} from '../..';
describe('LifiQuoteAPI parser', () => {
  const parser = getErrorParser(LifiQuoteErrorParser);

  const errorMap = [
    [LIFI_QUOTE_ERRORS.InvalidAddress, [], InternalError.name],
    [LIFI_QUOTE_ERRORS.UnknownAddressOrSymbol, [], InternalError.name],
    [LIFI_QUOTE_ERRORS.InvalidChain, [], InternalError.name],
    [LIFI_QUOTE_ERRORS.NoToolsCanCompleteTheAction, [], PairNotSupportedError.name],
    [
      LIFI_QUOTE_ERRORS.NoQuoteFound,
      [{ code: ToolErrorCode.NO_POSSIBLE_ROUTE }, { code: ToolErrorCode.AMOUNT_TOO_LOW }],
      InsufficientInputAmountError.name,
    ],
    [
      LIFI_QUOTE_ERRORS.NoQuoteFound,
      [{ code: ToolErrorCode.NO_POSSIBLE_ROUTE }, { code: ToolErrorCode.FEES_HGHER_THAN_AMOUNT }],
      InsufficientInputAmountError.name,
    ],
    [
      LIFI_QUOTE_ERRORS.NoQuoteFound,
      [{ code: ToolErrorCode.NO_POSSIBLE_ROUTE }, { code: ToolErrorCode.AMOUNT_TOO_HIGH }],
      HighInputAmountError.name,
    ],
    [
      LIFI_QUOTE_ERRORS.NoQuoteFound,
      [{ code: ToolErrorCode.NO_POSSIBLE_ROUTE }, { code: ToolErrorCode.INSUFFICIENT_LIQUIDITY }],
      InsufficientLiquidityError.name,
    ],
  ];

  const emptyContext = {
    fromChain: 1,
    fromToken: '0x',
    fromAddress: '0x',
    fromAmount: '0',
    toChain: 2,
    toToken: '0x',
    toAddress: '0x',
  };

  it.each(errorMap)("should map '%s' => '%s'", (message, errors, lifiError) => {
    const validError: LifiQuoteError = {
      message: new RandExp(message as RegExp).gen(),
      errors: errors as any[],
    };

    const error: LiqualityError = getError(() => {
      parser.wrap(() => {
        throw validError;
      }, emptyContext);
    });

    expect(error.name).toBe(lifiError);
    expect(error.source).toBe(LifiQuoteErrorParser.errorSource);
    expect(error.devMsg.data).toBe(emptyContext);
    expect(error.rawError).toBe(validError);
  });
});
