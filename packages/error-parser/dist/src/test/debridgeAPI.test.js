"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _1 = require(".");
const __1 = require("..");
const Debridge_1 = require("../parsers/Debridge");
const DebridgeAPIErrorParser_1 = require("../parsers/Debridge/DebridgeAPIErrorParser");
describe('DebridgeAPI parser', () => {
    const parser = (0, __1.getErrorParser)(DebridgeAPIErrorParser_1.DebridgeAPIErrorParser);
    const errorMap = [
        [Debridge_1.DEBRIDGE_ERRORS.INVALID_QUERY_PARAMETERS, __1.InternalError.name],
        [Debridge_1.DEBRIDGE_ERRORS.SOURCE_AND_DESTINATION_CHAINS_ARE_EQUAL, __1.PairNotSupportedError.name],
        [Debridge_1.DEBRIDGE_ERRORS.INCLUDED_GAS_FEE_NOT_COVERED_BY_INPUT_AMOUNT, __1.InsufficientInputAmountError.name],
        [Debridge_1.DEBRIDGE_ERRORS.INCLUDED_GAS_FEE_CANNOT_BE_ESTIMATED_FOR_TRANSACTION_BUNDLE, __1.InternalError.name],
        [Debridge_1.DEBRIDGE_ERRORS.CONNECTOR_1INCH_RETURNED_ERROR, __1.ThirdPartyError.name],
        [Debridge_1.DEBRIDGE_ERRORS.INTERNAL_SERVER_ERROR, __1.ThirdPartyError.name],
        [Debridge_1.DEBRIDGE_ERRORS.INTERNAL_SDK_ERROR, __1.ThirdPartyError.name],
    ];
    it('should not log anything to console', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const logSpy = jest.spyOn(console, 'log');
        (0, _1.getError)(() => {
            return parser.wrap(() => {
                throw _1.FAKE_ERROR;
            }, null);
        });
        yield (0, _1.getErrorAsync)(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return yield parser.wrapAsync(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw _1.FAKE_ERROR;
            }), null);
        }));
        expect(logSpy).toHaveBeenCalledTimes(0);
    }));
    it.each(errorMap)("should map '%s' => '%s'", (sourceError, liqError) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const validError = {
            errorCode: 0,
            errorId: sourceError,
            errorMessage: '',
            errorPayload: {},
        };
        const error = (0, _1.getError)(() => {
            parser.wrap(() => {
                throw validError;
            }, null);
        });
        expect(error.name).toBe(liqError);
        expect(error.source).toBe(DebridgeAPIErrorParser_1.DebridgeAPIErrorParser.errorSource);
        expect(error.rawError).toBe(validError);
        const error1 = yield (0, _1.getErrorAsync)(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield parser.wrapAsync(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw validError;
            }), null);
        }));
        expect(error1.name).toBe(liqError);
        expect(error1.source).toBe(DebridgeAPIErrorParser_1.DebridgeAPIErrorParser.errorSource);
        expect(error1.rawError).toBe(validError);
    }));
});
//# sourceMappingURL=debridgeAPI.test.js.map