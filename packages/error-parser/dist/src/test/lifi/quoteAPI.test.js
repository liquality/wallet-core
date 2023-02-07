"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LifiAPI_1 = require("../../parsers/LifiAPI");
const __1 = require("..");
const RandExp = require("randexp");
const __2 = require("../..");
describe('LifiQuoteAPI parser', () => {
    const parser = (0, __2.getErrorParser)(__2.LifiQuoteErrorParser);
    const errorMap = [
        [LifiAPI_1.LIFI_QUOTE_ERRORS.InvalidAddress, [], __2.InternalError.name],
        [LifiAPI_1.LIFI_QUOTE_ERRORS.UnknownAddressOrSymbol, [], __2.InternalError.name],
        [LifiAPI_1.LIFI_QUOTE_ERRORS.InvalidChain, [], __2.InternalError.name],
        [LifiAPI_1.LIFI_QUOTE_ERRORS.NoToolsCanCompleteTheAction, [], __2.PairNotSupportedError.name],
        [
            LifiAPI_1.LIFI_QUOTE_ERRORS.NoQuoteFound,
            [{ code: LifiAPI_1.ToolErrorCode.NO_POSSIBLE_ROUTE }, { code: LifiAPI_1.ToolErrorCode.AMOUNT_TOO_LOW }],
            __2.InsufficientInputAmountError.name,
        ],
        [
            LifiAPI_1.LIFI_QUOTE_ERRORS.NoQuoteFound,
            [{ code: LifiAPI_1.ToolErrorCode.NO_POSSIBLE_ROUTE }, { code: LifiAPI_1.ToolErrorCode.FEES_HGHER_THAN_AMOUNT }],
            __2.InsufficientInputAmountError.name,
        ],
        [
            LifiAPI_1.LIFI_QUOTE_ERRORS.NoQuoteFound,
            [{ code: LifiAPI_1.ToolErrorCode.NO_POSSIBLE_ROUTE }, { code: LifiAPI_1.ToolErrorCode.AMOUNT_TOO_HIGH }],
            __2.HighInputAmountError.name,
        ],
        [
            LifiAPI_1.LIFI_QUOTE_ERRORS.NoQuoteFound,
            [{ code: LifiAPI_1.ToolErrorCode.NO_POSSIBLE_ROUTE }, { code: LifiAPI_1.ToolErrorCode.INSUFFICIENT_LIQUIDITY }],
            __2.InsufficientLiquidityError.name,
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
        const validError = {
            message: new RandExp(message).gen(),
            errors: errors,
        };
        const error = (0, __1.getError)(() => {
            parser.wrap(() => {
                throw validError;
            }, emptyContext);
        });
        expect(error.name).toBe(lifiError);
        expect(error.source).toBe(__2.LifiQuoteErrorParser.errorSource);
        expect(error.devMsg.data).toBe(emptyContext);
        expect(error.rawError).toBe(validError);
    });
});
//# sourceMappingURL=quoteAPI.test.js.map