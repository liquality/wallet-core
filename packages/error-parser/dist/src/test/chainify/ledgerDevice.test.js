"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("..");
const __2 = require("../..");
const parsers_1 = require("../../parsers");
const Chainify_1 = require("../../parsers/Chainify");
const LedgerErrorParser_1 = require("../../parsers/Chainify/LedgerErrorParser");
describe('Ledger parser', () => {
    const parser = (0, __2.getErrorParser)(parsers_1.ChainifyErrorParser);
    const errorMap = [
        [Chainify_1.LEDGER_ERRORS.APP_MISMATCH_ERROR, __2.LedgerAppMismatchError.name],
        [Chainify_1.LEDGER_ERRORS.APP_NOT_SELECTED_ERROR, __2.LedgerAppMismatchError.name],
        [Chainify_1.LEDGER_ERRORS.DAPP_CONFLICT_ERROR, __2.LedgerDappConflictError.name],
        [Chainify_1.LEDGER_ERRORS.DEVICE_LOCKED_ERROR, __2.LedgerDeviceLockedError.name],
        [Chainify_1.LEDGER_ERRORS.NOT_UPDATED_ERROR, __2.LedgerDeviceNotUpdatedError.name],
        [Chainify_1.LEDGER_ERRORS.INVALID_DATA_ERROR, __2.LedgerDeviceNotUpdatedError.name],
        [Chainify_1.LEDGER_ERRORS.USER_REJECTED, __2.UserDeclinedError.name],
        [Chainify_1.LEDGER_ERRORS.SMART_CONTRACT_INTERACTION_DISABLED, __2.LedgerDeviceSmartContractTransactionDisabledError.name],
    ];
    it('should not log anything to console', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const logSpy = jest.spyOn(console, 'log');
        (0, __1.getError)(() => {
            return parser.wrap(() => {
                throw __1.FAKE_ERROR;
            }, null);
        });
        yield (0, __1.getErrorAsync)(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return yield parser.wrapAsync(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw __1.FAKE_ERROR;
            }), null);
        }));
        expect(logSpy).toHaveBeenCalledTimes(0);
    }));
    it.each(errorMap)("should map '%s' => '%s'", (sourceError, liqError) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const validError = {
            message: sourceError,
            name: 'WalletError',
        };
        const error = (0, __1.getError)(() => {
            parser.wrap(() => {
                throw validError;
            }, null);
        });
        expect(error.name).toBe(liqError);
        expect(error.source).toBe(LedgerErrorParser_1.LedgerErrorParser.errorSource);
        expect(error.rawError).toBe(validError);
        const error1 = yield (0, __1.getErrorAsync)(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield parser.wrapAsync(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw validError;
            }), null);
        }));
        expect(error1.name).toBe(liqError);
        expect(error1.source).toBe(LedgerErrorParser_1.LedgerErrorParser.errorSource);
        expect(error1.rawError).toBe(validError);
    }));
});
//# sourceMappingURL=ledgerDevice.test.js.map