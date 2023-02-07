"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
const types_1 = require("../types");
test('Should be able to validate toggleExperiment features', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
    yield wallet.dispatch.toggleExperiment({
        name: types_1.ExperimentType.ManageAccounts,
    });
    expect(wallet.state.experiments).toHaveProperty('manageAccounts');
    expect(wallet.state.experiments.manageAccounts).toBe(true);
}));
//# sourceMappingURL=toggleExperiment.test.js.map