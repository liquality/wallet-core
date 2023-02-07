"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../../walletOptions/defaultOptions"));
const types_1 = require("../../types");
test('accounts createAccount', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
    const walletId = wallet.state.activeWalletId;
    expect((_a = wallet.state.accounts[walletId]) === null || _a === void 0 ? void 0 : _a.mainnet.length).toBe(13);
    const account = (_b = wallet.state.accounts) === null || _b === void 0 ? void 0 : _b[walletId];
    const btcMainnetAccountDetails = account === null || account === void 0 ? void 0 : account.mainnet[0];
    yield wallet.dispatch.createAccount({
        walletId: walletId,
        network: types_1.Network.Mainnet,
        account: Object.assign(Object.assign({}, btcMainnetAccountDetails), { name: 'Bitcoin account 2' }),
    });
    expect((_c = wallet.state.accounts[walletId]) === null || _c === void 0 ? void 0 : _c.mainnet.length).toBe(14);
}));
//# sourceMappingURL=createAccount.test.js.map