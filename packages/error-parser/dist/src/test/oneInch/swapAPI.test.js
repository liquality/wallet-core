"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const OneInchAPI_1 = require("../../parsers/OneInchAPI");
const __1 = require("..");
const RandExp = require("randexp");
const __2 = require("../..");
describe('OneInchSwapAPI parser', () => {
    const data = {
        from: 'ETH',
        to: 'USDT',
        amount: '1900',
        balance: '1000',
    };
    const parser = (0, __2.getErrorParser)(__2.OneInchSwapErrorParser);
    const errorMap = [
        [OneInchAPI_1.ONE_INCH_ERRORS.CANNOT_ESTIMATE_1, __2.ThirdPartyError.name],
        [OneInchAPI_1.ONE_INCH_ERRORS.CANNOT_ESTIMATE_WITH_REASON, __2.ThirdPartyError.name],
        [OneInchAPI_1.ONE_INCH_ERRORS.INSUFFICIENT_ALLOWANCE, __2.InternalError.name],
        [OneInchAPI_1.ONE_INCH_ERRORS.INSUFFICIENT_FUNDS, __2.InsufficientFundsError.name],
        [OneInchAPI_1.ONE_INCH_ERRORS.INSUFFICIENT_GAS_FEE, __2.InsufficientGasFeeError.name],
        [OneInchAPI_1.ONE_INCH_ERRORS.INSUFFICIENT_LIQUIDITY, __2.InsufficientLiquidityError.name],
        [OneInchAPI_1.ONE_INCH_ERRORS.INTERNAL_ERROR, __2.ThirdPartyError.name],
        [OneInchAPI_1.ONE_INCH_ERRORS.INVALID_TOKEN_PAIR, __2.InternalError.name],
        [OneInchAPI_1.ONE_INCH_ERRORS.INVALID_TOKEN_ADDRESS, __2.InternalError.name],
    ];
    it('should not log anything to console', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const logSpy = jest.spyOn(console, 'log');
        (0, __1.getError)(() => {
            return parser.wrap(() => {
                throw __1.FAKE_ERROR;
            }, data);
        });
        yield (0, __1.getErrorAsync)(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return yield parser.wrapAsync(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw __1.FAKE_ERROR;
            }), data);
        }));
        expect(logSpy).toHaveBeenCalledTimes(0);
    }));
    it.each(errorMap)("should map '%s' => '%s'", (sourceError, liqError) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const validError = {
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
        const error = (0, __1.getError)(() => {
            parser.wrap(() => {
                throw validError;
            }, data);
        });
        expect(error.name).toBe(liqError);
        expect(error.source).toBe(__2.OneInchSwapErrorParser.errorSource);
        expect(error.devMsg.data).toBe(data);
        expect(error.rawError).toBe(validError);
        const error1 = yield (0, __1.getErrorAsync)(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield parser.wrapAsync(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw validError;
            }), data);
        }));
        expect(error1.name).toBe(liqError);
        expect(error1.source).toBe(__2.OneInchSwapErrorParser.errorSource);
        expect(error1.devMsg.data).toBe(data);
        expect(error1.rawError).toBe(validError);
    }));
    const recordLevelErrorMap = [
        ['ValidationError', 1001],
        ['NotFoundError', 1006],
    ];
    it.each(recordLevelErrorMap)("should map '%s' => '%s'", (errorName, errorCode) => {
        const validError = {
            code: +errorCode,
            name: errorName,
        };
        const error = (0, __1.getError)(() => {
            parser.wrap(() => {
                throw validError;
            }, data);
        });
        expect(error.name).toBe(__2.PairNotSupportedError.name);
        expect(error.source).toBe(__2.OneInchSwapErrorParser.errorSource);
        expect(error.devMsg.data).toEqual(data);
        expect(error.rawError).toBe(validError);
    });
    const wrongErrors = [
        ['error structure is incorrect', __1.FAKE_ERROR],
        [
            'name is not nodeError',
            {
                description: new RandExp(OneInchAPI_1.ONE_INCH_ERRORS.INSUFFICIENT_FUNDS).gen(),
                name: 'NodeErrr',
            },
        ],
        [
            'description is incorrect',
            {
                description: __1.FAKE_ERROR,
                name: 'NodeError',
            },
        ],
    ];
    it.each(wrongErrors)('Should return unknown error when %s', (_test, error) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const liqError = (0, __1.getError)(() => {
            parser.wrap(() => {
                throw error;
            }, data);
        });
        expect(liqError.name).toBe(__2.UnknownError.name);
        const liqError1 = yield (0, __1.getErrorAsync)(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield parser.wrapAsync(() => {
                throw error;
            }, data);
        }));
        expect(liqError1.name).toBe(__2.UnknownError.name);
    }));
});
//# sourceMappingURL=swapAPI.test.js.map