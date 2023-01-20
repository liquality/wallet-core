"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Process = tslib_1.__importStar(require("process"));
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
const types_1 = require("../types");
const index_2 = require("./index");
describe('migrations scripts tests', () => {
    const wallet = (0, index_1.setupWallet)(Object.assign({}, defaultOptions_1.default));
    let TEST_MNEMONIC = Process.env.TEST_MNEMONIC;
    if (!TEST_MNEMONIC) {
        throw new Error('Please set the TEST_MNEMONIC environment variable');
    }
    TEST_MNEMONIC = TEST_MNEMONIC.replace(/,/g, ' ');
    beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: TEST_MNEMONIC,
            imported: true,
        });
        yield wallet.dispatch.unlockWallet({
            key: '0x1234567890123456789012345678901234567890',
        });
    }));
    it('should be able validate accounts-mainnet', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        expect(wallet.state.activeNetwork).toBe('mainnet');
        const walletId = wallet.state.activeWalletId;
        expect(wallet.state.version).toBe(index_2.LATEST_VERSION);
        const accounts = wallet.state.accounts;
        expect(accounts).not.toBeNull();
        expect((0, index_2.isMigrationNeeded)(wallet.state)).toBeFalsy();
        const maninNetAccountsLength = (_b = (_a = wallet.state.accounts) === null || _a === void 0 ? void 0 : _a[walletId]) === null || _b === void 0 ? void 0 : _b.mainnet.length;
        expect(maninNetAccountsLength).toBeGreaterThan(0);
        for (let i = 0; i < maninNetAccountsLength; i++) {
            expect((_d = (_c = wallet.state.accounts) === null || _c === void 0 ? void 0 : _c[walletId]) === null || _d === void 0 ? void 0 : _d.mainnet[i].enabled).toBeTruthy();
            expect((_f = (_e = wallet.state.accounts) === null || _e === void 0 ? void 0 : _e[walletId]) === null || _f === void 0 ? void 0 : _f.mainnet[i].type).toBe('default');
        }
    }));
    it('should be able validate accounts-testnet', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _g, _h, _j, _k, _l, _m;
        yield wallet.dispatch.changeActiveNetwork({
            network: types_1.Network.Testnet,
        });
        expect(wallet.state.activeNetwork).toBe('testnet');
        const walletId = wallet.state.activeWalletId;
        expect(wallet.state.version).toBe(index_2.LATEST_VERSION);
        const testnetAccountsLength = (_h = (_g = wallet.state.accounts) === null || _g === void 0 ? void 0 : _g[walletId]) === null || _h === void 0 ? void 0 : _h.testnet.length;
        expect(testnetAccountsLength).not.toBeNull();
        expect((0, index_2.isMigrationNeeded)(wallet.state)).toBeFalsy();
        expect(testnetAccountsLength).toBeGreaterThan(0);
        for (let i = 0; i < testnetAccountsLength; i++) {
            expect((_k = (_j = wallet.state.accounts) === null || _j === void 0 ? void 0 : _j[walletId]) === null || _k === void 0 ? void 0 : _k.testnet[i].enabled).toBeTruthy();
            expect((_m = (_l = wallet.state.accounts) === null || _l === void 0 ? void 0 : _l[walletId]) === null || _m === void 0 ? void 0 : _m.testnet[i].type).toBe('default');
        }
    }));
});
//# sourceMappingURL=migration_script.test.js.map