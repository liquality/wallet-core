"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
const types_1 = require("../types");
let wallet;
describe('disable and enable assets', () => {
    jest.setTimeout(20000);
    beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
        yield wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: 'rough symbol license spirit advance pact catalog vibrant dream great usage empty',
            imported: true,
        });
        yield wallet.dispatch.unlockWallet({
            key: '0x1234567890123456789012345678901234567890',
        });
        yield wallet.dispatch.setWhatsNewModalVersion({
            version: '1.0.0',
        });
    }));
    test('should be able to disable and enable mainnet assets', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        expect(wallet.state.wallets.length).toBe(1);
        expect(wallet.state.wallets[0].imported).toBe(true);
        expect(wallet.state.unlockedAt).not.toBe(0);
        expect(wallet.state.whatsNewModalVersion).toBe('1.0.0');
        expect(wallet.state.keyUpdatedAt).not.toBe(0);
        expect(wallet.state.unlockedAt).not.toBe(0);
        expect(wallet.state.setupAt).not.toBe(0);
        const walletId = wallet.state.activeWalletId;
        const mainnetEnabledAssets = (_a = wallet.state.enabledAssets.mainnet) === null || _a === void 0 ? void 0 : _a[walletId];
        expect(mainnetEnabledAssets === null || mainnetEnabledAssets === void 0 ? void 0 : mainnetEnabledAssets.length).toBeGreaterThan(1);
        yield wallet.dispatch.disableAssets({
            network: types_1.Network.Mainnet,
            walletId: walletId,
            assets: mainnetEnabledAssets,
        });
        expect((_b = wallet.state.enabledAssets.mainnet) === null || _b === void 0 ? void 0 : _b[walletId].length).toBe(0);
        yield wallet.dispatch.enableAssets({
            network: types_1.Network.Mainnet,
            walletId: walletId,
            assets: mainnetEnabledAssets,
        });
        expect(mainnetEnabledAssets === null || mainnetEnabledAssets === void 0 ? void 0 : mainnetEnabledAssets.length).toBeGreaterThan(1);
    }));
    test('should be able to disable and enable testnet assets', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _c, _d, _e, _f;
        yield wallet.dispatch.changeActiveNetwork({
            network: types_1.Network.Testnet,
        });
        expect(wallet.state.activeNetwork).toBe('testnet');
        expect(wallet.state.wallets.length).toBe(1);
        expect(wallet.state.wallets[0].imported).toBe(true);
        expect(wallet.state.unlockedAt).not.toBe(0);
        expect(wallet.state.whatsNewModalVersion).toBe('1.0.0');
        expect(wallet.state.keyUpdatedAt).not.toBe(0);
        expect(wallet.state.unlockedAt).not.toBe(0);
        expect(wallet.state.setupAt).not.toBe(0);
        const walletId = wallet.state.activeWalletId;
        const testnetEnabledAssets = (_c = wallet.state.enabledAssets.testnet) === null || _c === void 0 ? void 0 : _c[walletId];
        expect(testnetEnabledAssets === null || testnetEnabledAssets === void 0 ? void 0 : testnetEnabledAssets.length).toBeGreaterThan(1);
        yield wallet.dispatch.disableAssets({
            network: types_1.Network.Testnet,
            walletId: walletId,
            assets: testnetEnabledAssets,
        });
        expect((_d = wallet.state.enabledAssets.testnet) === null || _d === void 0 ? void 0 : _d[walletId].length).toBe(0);
        yield wallet.dispatch.enableAssets({
            network: types_1.Network.Testnet,
            walletId: walletId,
            assets: testnetEnabledAssets,
        });
        expect((_f = (_e = wallet.state.enabledAssets.testnet) === null || _e === void 0 ? void 0 : _e[walletId]) === null || _f === void 0 ? void 0 : _f.length).toBeGreaterThan(1);
    }));
});
//# sourceMappingURL=enableDisableAssets.test.js.map