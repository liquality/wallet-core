"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const error_parser_1 = require("@liquality/error-parser");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
test('should log error to state when analytics is disabled', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const ERROR = 'anyError';
    const wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
    yield wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    yield wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    yield wallet.dispatch.initializeAnalyticsPreferences({ accepted: false });
    expect(wallet.state.errorLog.length).toBe(0);
    (0, error_parser_1.createInternalError)(ERROR);
    expect(wallet.state.errorLog.length).toBe(1);
    expect(wallet.state.errorLog[0].rawError).toBe(ERROR);
    yield wallet.dispatch.initializeAnalyticsPreferences({ accepted: true });
    (0, error_parser_1.createInternalError)(ERROR);
    expect(wallet.state.errorLog.length).toBe(2);
}));
//# sourceMappingURL=logError.test.js.map