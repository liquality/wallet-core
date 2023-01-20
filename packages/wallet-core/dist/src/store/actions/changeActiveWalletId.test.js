"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const uuid_1 = require("uuid");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
describe('change active wallet id', () => {
    it('should be able to change the active wallet id', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
        yield wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: 'test',
            imported: true,
        });
        yield wallet.dispatch.unlockWallet({
            key: '0x1234567890123456789012345678901234567890',
        });
        expect(wallet.state.wallets.length).toBe(1);
        expect(wallet.state.wallets[0].imported).toBe(true);
        expect(wallet.state.unlockedAt).not.toBe(0);
        yield wallet.dispatch.initializeAnalyticsPreferences({
            accepted: true,
        });
        expect(wallet.state.analytics.userId).not.toBe(null);
        expect(wallet.state.analytics.acceptedDate).not.toBe(0);
        expect(wallet.state.analytics.askedDate).not.toBe(0);
        expect(wallet.state.analytics.askedTimes).toBe(0);
        expect(wallet.state.analytics.notAskAgain).toBe(false);
        const walletIdBefore = wallet.state.activeWalletId;
        const mainnetAccounts = (_c = (_b = (_a = wallet === null || wallet === void 0 ? void 0 : wallet.state) === null || _a === void 0 ? void 0 : _a.enabledAssets) === null || _b === void 0 ? void 0 : _b.mainnet) === null || _c === void 0 ? void 0 : _c[walletIdBefore];
        expect(mainnetAccounts).not.toBeNull();
        yield wallet.dispatch.changeActiveWalletId({
            walletId: (0, uuid_1.v4)(),
        });
        const walletIdAfterChange = wallet.state.activeWalletId;
        expect(walletIdAfterChange).not.toEqual(walletIdBefore);
    }));
});
//# sourceMappingURL=changeActiveWalletId.test.js.map