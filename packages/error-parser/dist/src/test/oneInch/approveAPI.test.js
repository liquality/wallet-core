"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OneInchAPI_1 = require("../../parsers/OneInchAPI");
const __1 = require("..");
const RandExp = require("randexp");
const __2 = require("../..");
describe('OneInchApproveAPI parser', () => {
    const parser = (0, __2.getErrorParser)(__2.OneInchApproveErrorParser);
    const errorMap = [
        [OneInchAPI_1.ONE_INCH_ERRORS.INTERNAL_ERROR, __2.ThirdPartyError.name],
        [OneInchAPI_1.ONE_INCH_ERRORS.INVALID_TOKEN_ADDRESS, __2.InternalError.name],
    ];
    it('should not log anything to console', () => {
        const logSpy = jest.spyOn(console, 'log');
        (0, __1.getError)(() => {
            return parser.wrap(() => {
                throw __1.FAKE_ERROR;
            }, null);
        });
        expect(logSpy).toHaveBeenCalledTimes(0);
    });
    it.each(errorMap)("should map '%s' => '%s'", (sourceError, liqError) => {
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
            }, null);
        });
        expect(error.name).toBe(liqError);
        expect(error.source).toBe(__2.OneInchApproveErrorParser.errorSource);
        expect(error.devMsg.data).toEqual({});
        expect(error.rawError).toBe(validError);
    });
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
            }, null);
        });
        expect(error.name).toBe(__2.PairNotSupportedError.name);
        expect(error.source).toBe(__2.OneInchApproveErrorParser.errorSource);
        expect(error.devMsg.data).toEqual({});
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
    it.each(wrongErrors)('Should return unknown error when %s', (_test, error) => {
        const liqError = (0, __1.getError)(() => {
            parser.wrap(() => {
                throw error;
            }, null);
        });
        expect(liqError.name).toBe(__2.UnknownError.name);
    });
});
//# sourceMappingURL=approveAPI.test.js.map