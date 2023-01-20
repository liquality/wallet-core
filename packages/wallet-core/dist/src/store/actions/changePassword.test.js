"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
test('change password test', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
    yield wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    yield wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    expect(wallet.state.key).toBe('0x1234567890123456789012345678901234567890');
    yield wallet.dispatch.changePassword({
        key: '0x3334567890123456789012345678901234567890',
    });
    expect(wallet.state.key).toBe('0x3334567890123456789012345678901234567890');
}));
//# sourceMappingURL=changePassword.test.js.map