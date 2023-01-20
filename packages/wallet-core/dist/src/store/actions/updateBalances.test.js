"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
const types_1 = require("../types");
describe('updateBalances tests', () => {
    jest.setTimeout(90000);
    const createNotification = jest.fn();
    const wallet = (0, index_1.setupWallet)(Object.assign(Object.assign({}, defaultOptions_1.default), { createNotification }));
    beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: 'inflict direct label mask release cargo also before ask future holiday device',
            imported: true,
        });
        yield wallet.dispatch.unlockWallet({
            key: '0x1234567890123456789012345678901234567890',
        });
    }));
    it('should be able to validate updateBalances against testnet', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        yield wallet.dispatch.changeActiveNetwork({
            network: types_1.Network.Testnet,
        });
        expect(wallet.state.activeNetwork).toBe('testnet');
        const walletId = wallet.state.activeWalletId;
        const testnetAccounts = (_c = (_b = (_a = wallet === null || wallet === void 0 ? void 0 : wallet.state) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b[walletId]) === null || _c === void 0 ? void 0 : _c.testnet;
        expect(testnetAccounts === null || testnetAccounts === void 0 ? void 0 : testnetAccounts.length).not.toBe(0);
        if (testnetAccounts) {
            yield wallet.dispatch.updateBalances({
                network: types_1.Network.Testnet,
                walletId: walletId,
                accountIds: testnetAccounts.map((t) => t.id),
            });
        }
        const account = (_f = (_e = (_d = wallet.state.accounts) === null || _d === void 0 ? void 0 : _d[walletId]) === null || _e === void 0 ? void 0 : _e.testnet) === null || _f === void 0 ? void 0 : _f.find((acc) => acc.chain === cryptoassets_1.ChainId.Bitcoin);
        expect(account === null || account === void 0 ? void 0 : account.chain).toBe(cryptoassets_1.ChainId.Bitcoin);
        expect(account === null || account === void 0 ? void 0 : account.balances.BTC).toBe('0');
    }));
});
//# sourceMappingURL=updateBalances.test.js.map