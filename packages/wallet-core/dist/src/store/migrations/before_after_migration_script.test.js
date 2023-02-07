"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Process = tslib_1.__importStar(require("process"));
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
const index_2 = require("./index");
describe('migrations scripts tests', () => {
    test('Upgrade migrations from wallet versions-2 test, should be able validate accounts-mainnet', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        let wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
        wallet = (0, index_1.setupWallet)(Object.assign(Object.assign({}, defaultOptions_1.default), { initialState: Object.assign(Object.assign({}, wallet.state), { version: index_2.LATEST_VERSION - 2 }) }));
        let TEST_MNEMONIC = Process.env.TEST_MNEMONIC;
        if (!TEST_MNEMONIC) {
            throw new Error('Please set the TEST_MNEMONIC environment variable');
        }
        TEST_MNEMONIC = TEST_MNEMONIC.replace(/,/g, ' ');
        yield wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: TEST_MNEMONIC,
            imported: true,
        });
        yield wallet.dispatch.unlockWallet({
            key: '0x1234567890123456789012345678901234567890',
        });
        expect((0, index_2.isMigrationNeeded)(wallet.state)).toBeTruthy();
        expect(wallet.state.activeNetwork).toBe('mainnet');
        let walletId = wallet.state.activeWalletId;
        expect(wallet.state.version).toBe(index_2.LATEST_VERSION - 2);
        let accounts = wallet.state.accounts;
        expect(accounts).not.toBeNull();
        let maninNetAccountsLength = (_b = (_a = wallet.state.accounts) === null || _a === void 0 ? void 0 : _a[walletId]) === null || _b === void 0 ? void 0 : _b.mainnet.length;
        expect(maninNetAccountsLength).toBeGreaterThan(0);
        for (let i = 0; i < maninNetAccountsLength; i++) {
            expect((_d = (_c = wallet.state.accounts) === null || _c === void 0 ? void 0 : _c[walletId]) === null || _d === void 0 ? void 0 : _d.mainnet[i].enabled).toBeTruthy();
            expect((_f = (_e = wallet.state.accounts) === null || _e === void 0 ? void 0 : _e[walletId]) === null || _f === void 0 ? void 0 : _f.mainnet[i].type).toBe('default');
        }
        const afterMigrationState = yield (0, index_2.processMigrations)(wallet.state);
        walletId = afterMigrationState.activeWalletId;
        expect(afterMigrationState.version).toBe(index_2.LATEST_VERSION);
        accounts = afterMigrationState.accounts;
        expect(accounts).not.toBeNull();
        maninNetAccountsLength = (_h = (_g = afterMigrationState.accounts) === null || _g === void 0 ? void 0 : _g[walletId]) === null || _h === void 0 ? void 0 : _h.mainnet.length;
        expect(maninNetAccountsLength).toBeGreaterThan(0);
        for (let i = 0; i < maninNetAccountsLength; i++) {
            expect((_k = (_j = afterMigrationState.accounts) === null || _j === void 0 ? void 0 : _j[walletId]) === null || _k === void 0 ? void 0 : _k.mainnet[i].enabled).toBeTruthy();
            expect((_m = (_l = afterMigrationState.accounts) === null || _l === void 0 ? void 0 : _l[walletId]) === null || _m === void 0 ? void 0 : _m.mainnet[i].type).toBe('default');
        }
    }));
    test('Upgrade migrations from wallet versions-1 test, should be able validate accounts-mainnet', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        let wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
        wallet = (0, index_1.setupWallet)(Object.assign(Object.assign({}, defaultOptions_1.default), { initialState: Object.assign(Object.assign({}, wallet.state), { version: index_2.LATEST_VERSION - 1 }) }));
        let TEST_MNEMONIC = Process.env.TEST_MNEMONIC;
        if (!TEST_MNEMONIC) {
            throw new Error('Please set the TEST_MNEMONIC environment variable');
        }
        TEST_MNEMONIC = TEST_MNEMONIC.replace(/,/g, ' ');
        yield wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: TEST_MNEMONIC,
            imported: true,
        });
        yield wallet.dispatch.unlockWallet({
            key: '0x1234567890123456789012345678901234567890',
        });
        expect(wallet.state.activeNetwork).toBe('mainnet');
        let walletId = wallet.state.activeWalletId;
        expect(wallet.state.version).toBe(index_2.LATEST_VERSION - 1);
        expect((0, index_2.isMigrationNeeded)(wallet.state)).toBeTruthy();
        let accounts = wallet.state.accounts;
        expect(accounts).not.toBeNull();
        let maninNetAccountsLength = (_p = (_o = wallet.state.accounts) === null || _o === void 0 ? void 0 : _o[walletId]) === null || _p === void 0 ? void 0 : _p.mainnet.length;
        expect(maninNetAccountsLength).toBeGreaterThan(0);
        for (let i = 0; i < maninNetAccountsLength; i++) {
            expect((_r = (_q = wallet.state.accounts) === null || _q === void 0 ? void 0 : _q[walletId]) === null || _r === void 0 ? void 0 : _r.mainnet[i].enabled).toBeTruthy();
            expect((_t = (_s = wallet.state.accounts) === null || _s === void 0 ? void 0 : _s[walletId]) === null || _t === void 0 ? void 0 : _t.mainnet[i].type).toBe('default');
        }
        const afterMigrationState = yield (0, index_2.processMigrations)(wallet.state);
        walletId = afterMigrationState.activeWalletId;
        expect(afterMigrationState.version).toBe(index_2.LATEST_VERSION);
        accounts = afterMigrationState.accounts;
        expect(accounts).not.toBeNull();
        maninNetAccountsLength = (_v = (_u = afterMigrationState.accounts) === null || _u === void 0 ? void 0 : _u[walletId]) === null || _v === void 0 ? void 0 : _v.mainnet.length;
        expect(maninNetAccountsLength).toBeGreaterThan(0);
        for (let i = 0; i < maninNetAccountsLength; i++) {
            expect((_x = (_w = afterMigrationState.accounts) === null || _w === void 0 ? void 0 : _w[walletId]) === null || _x === void 0 ? void 0 : _x.mainnet[i].enabled).toBeTruthy();
            expect((_z = (_y = afterMigrationState.accounts) === null || _y === void 0 ? void 0 : _y[walletId]) === null || _z === void 0 ? void 0 : _z.mainnet[i].type).toBe('default');
        }
    }));
});
//# sourceMappingURL=before_after_migration_script.test.js.map