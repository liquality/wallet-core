"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
describe('lock', () => {
    test('should be able to lock a wallet', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
        yield wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: 'test',
            imported: true,
        });
        yield wallet.dispatch.unlockWallet({
            key: '0x1234567890123456789012345678901234567890',
        });
        expect(wallet.state.unlockedAt).not.toBe(0);
        expect(wallet.state.wallets.length).not.toBe(0);
        yield wallet.dispatch.lockWallet();
        expect(wallet.state.unlockedAt).toBe(0);
        expect(wallet.state.wallets.length).toBe(0);
    }));
});
//# sourceMappingURL=lockWallet.test.js.map