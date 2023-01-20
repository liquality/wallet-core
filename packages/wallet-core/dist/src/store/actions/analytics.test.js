"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
test('should be able to enable analytics', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
    yield wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    yield wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    const walletId = wallet.state.activeWalletId;
    expect(walletId).not.toBeNull();
    yield wallet.dispatch.initializeAnalyticsPreferences({ accepted: true });
    expect(wallet.state.analytics).not.toBe({});
    yield wallet.dispatch.updateAnalyticsPreferences(Object.assign(Object.assign({}, wallet.state.analytics), { notAskAgain: true }));
    expect(wallet.state.analytics.notAskAgain).toBe(true);
    yield wallet.dispatch.setAnalyticsResponse({ accepted: true });
    expect(wallet.state.analytics.acceptedDate).not.toBe(0);
    yield wallet.dispatch.setAnalyticsResponse({ accepted: false });
    expect(wallet.state.analytics.acceptedDate).toBe(0);
    yield wallet.dispatch.trackAnalytics({
        event: 'test',
        properties: {
            test: 'test',
        },
    });
}));
//# sourceMappingURL=analytics.test.js.map