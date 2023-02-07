"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
const types_1 = require("../types");
describe('initializeAddresses tests', () => {
    jest.setTimeout(120000);
    it('should be able to validate every asset has addresses', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        const wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
        yield wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: 'rough symbol license spirit advance pact catalog vibrant dream great usage empty',
            imported: true,
        });
        yield wallet.dispatch.unlockWallet({
            key: '0x1234567890123456789012345678901234567890',
        });
        const walletId = wallet.state.activeWalletId;
        let mainnetAccounts = (_b = (_a = wallet.state.accounts) === null || _a === void 0 ? void 0 : _a[walletId]) === null || _b === void 0 ? void 0 : _b.mainnet;
        let testnetAccounts = (_d = (_c = wallet.state.accounts) === null || _c === void 0 ? void 0 : _c[walletId]) === null || _d === void 0 ? void 0 : _d.testnet;
        expect(mainnetAccounts === null || mainnetAccounts === void 0 ? void 0 : mainnetAccounts.length).not.toBe(0);
        expect(testnetAccounts === null || testnetAccounts === void 0 ? void 0 : testnetAccounts.length).not.toBe(0);
        for (let i = 0; i < mainnetAccounts.length; i++) {
            if (mainnetAccounts) {
                expect((_f = (_e = mainnetAccounts[i]) === null || _e === void 0 ? void 0 : _e.addresses) === null || _f === void 0 ? void 0 : _f.length).toEqual(0);
            }
        }
        yield wallet.dispatch.initializeAddresses({
            network: types_1.Network.Mainnet,
            walletId: walletId,
        });
        mainnetAccounts = (_h = (_g = wallet.state.accounts) === null || _g === void 0 ? void 0 : _g[walletId]) === null || _h === void 0 ? void 0 : _h.mainnet;
        expect(mainnetAccounts === null || mainnetAccounts === void 0 ? void 0 : mainnetAccounts.length).not.toBe(0);
        for (let i = 0; i < mainnetAccounts.length; i++) {
            if (mainnetAccounts) {
                if (((_j = mainnetAccounts[i]) === null || _j === void 0 ? void 0 : _j.chain) !== 'fuse') {
                    expect((_l = (_k = mainnetAccounts[i]) === null || _k === void 0 ? void 0 : _k.addresses) === null || _l === void 0 ? void 0 : _l.length).toEqual(1);
                }
            }
        }
        yield wallet.dispatch.initializeAddresses({
            network: types_1.Network.Testnet,
            walletId: walletId,
        });
        testnetAccounts = (_o = (_m = wallet.state.accounts) === null || _m === void 0 ? void 0 : _m[walletId]) === null || _o === void 0 ? void 0 : _o.testnet;
        expect(testnetAccounts === null || testnetAccounts === void 0 ? void 0 : testnetAccounts.length).not.toBe(0);
        for (let i = 0; i < testnetAccounts.length; i++) {
            if (mainnetAccounts) {
                if (((_p = mainnetAccounts[i]) === null || _p === void 0 ? void 0 : _p.chain) !== 'fuse') {
                    expect((_r = (_q = mainnetAccounts[i]) === null || _q === void 0 ? void 0 : _q.addresses) === null || _r === void 0 ? void 0 : _r.length).toEqual(1);
                }
            }
        }
    }));
});
//# sourceMappingURL=initializeAddresses.test.js.map