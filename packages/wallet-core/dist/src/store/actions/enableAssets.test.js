"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
const types_1 = require("../types");
describe('disableAssets and enableAssets', () => {
    it('should be able to enable assets & disable assets', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        jest.setTimeout(90000);
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
        yield wallet.dispatch.disableAssets({
            network: types_1.Network.Mainnet,
            walletId: walletId,
            assets: ['BTC'],
        });
        let enabledAssets = (_c = (_b = (_a = wallet === null || wallet === void 0 ? void 0 : wallet.state) === null || _a === void 0 ? void 0 : _a.enabledAssets) === null || _b === void 0 ? void 0 : _b.mainnet) === null || _c === void 0 ? void 0 : _c[walletId];
        expect(enabledAssets).not.toContain('BTC');
        yield wallet.dispatch.enableAssets({
            network: types_1.Network.Mainnet,
            walletId: walletId,
            assets: ['BTC'],
        });
        enabledAssets = (_f = (_e = (_d = wallet === null || wallet === void 0 ? void 0 : wallet.state) === null || _d === void 0 ? void 0 : _d.enabledAssets) === null || _e === void 0 ? void 0 : _e.mainnet) === null || _f === void 0 ? void 0 : _f[walletId];
        expect(enabledAssets).toContain('BTC');
    }));
});
//# sourceMappingURL=enableAssets.test.js.map