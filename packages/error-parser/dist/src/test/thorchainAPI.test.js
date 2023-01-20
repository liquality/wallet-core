"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _1 = require(".");
const __1 = require("..");
const Thorchain_1 = require("../parsers/Thorchain");
const errors_1 = require("@chainify/errors");
describe('ThorchainAPI parser', () => {
    const parser = (0, __1.getErrorParser)(__1.ThorchainAPIErrorParser);
    const errorMap = [[Thorchain_1.THORCHAIN_ERRORS.NETWORK_ERROR, __1.ThirdPartyError.name]];
    it('should not log anything to console', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const logSpy = jest.spyOn(console, 'log');
        (0, _1.getError)(() => {
            return parser.wrap(() => {
                throw _1.FAKE_ERROR;
            }, {});
        });
        yield (0, _1.getErrorAsync)(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return yield parser.wrapAsync(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw _1.FAKE_ERROR;
            }), {});
        }));
        expect(logSpy).toHaveBeenCalledTimes(0);
    }));
    it.each(errorMap)("should map '%s' => '%s'", (sourceError, liqError) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const validError = {
            message: sourceError,
            name: errors_1.NodeError.prototype.name,
        };
        const error = (0, _1.getError)(() => {
            parser.wrap(() => {
                throw validError;
            }, {});
        });
        expect(error.name).toBe(liqError);
        expect(error.source).toBe(__1.ThorchainAPIErrorParser.errorSource);
        expect(error.rawError).toBe(validError);
        const error1 = yield (0, _1.getErrorAsync)(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield parser.wrapAsync(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw validError;
            }), {});
        }));
        expect(error1.name).toBe(liqError);
        expect(error1.source).toBe(__1.ThorchainAPIErrorParser.errorSource);
        expect(error1.rawError).toBe(validError);
    }));
});
//# sourceMappingURL=thorchainAPI.test.js.map