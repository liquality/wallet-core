"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
const types_1 = require("../types");
describe('updateMarketData', () => {
    jest.setTimeout(90000);
    const wallet = (0, index_1.setupWallet)(defaultOptions_1.default);
    beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: 'test',
            imported: true,
        });
        yield wallet.dispatch.unlockWallet({
            key: '0x1234567890123456789012345678901234567890',
        });
        yield wallet.dispatch.initializeAnalyticsPreferences({
            accepted: true,
        });
    }));
    test('should be able to get marketData', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        expect(wallet.state.wallets.length).toBe(1);
        expect(wallet.state.wallets[0].imported).toBe(true);
        expect(wallet.state.unlockedAt).not.toBe(0);
        expect(wallet.state.analytics.userId).not.toBe(null);
        yield wallet.dispatch.updateMarketData({
            network: types_1.Network.Mainnet,
        });
        expect((_a = wallet.state.marketData.mainnet) === null || _a === void 0 ? void 0 : _a.length).toBeGreaterThan(0);
    }));
    test('should be able to get marketData for testnet', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _b;
        expect(wallet.state.wallets.length).toBe(1);
        expect(wallet.state.wallets[0].imported).toBe(true);
        expect(wallet.state.unlockedAt).not.toBe(0);
        yield wallet.dispatch.changeActiveNetwork({
            network: types_1.Network.Testnet,
        });
        expect(wallet.state.analytics.userId).not.toBe(null);
        yield wallet.dispatch.updateMarketData({
            network: types_1.Network.Testnet,
        });
        expect((_b = wallet.state.marketData.testnet) === null || _b === void 0 ? void 0 : _b.length).toBeGreaterThan(0);
    }));
});
//# sourceMappingURL=updateMarketData.test.js.map