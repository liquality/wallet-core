"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
test('should be able to create wallet with imported false', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
    yield wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: false,
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].id).not.toBe(undefined);
    expect(wallet.state.wallets[0].name).toEqual('Account 1');
    expect(wallet.state.wallets[0].mnemonic).toBe('test');
    expect(wallet.state.wallets[0].at).not.toBe(0);
    expect(wallet.state.unlockedAt).toBe(0);
    expect(wallet.state.activeNetwork).toBe('mainnet');
    expect(wallet.state.wallets[0].imported).toBe(false);
    expect(wallet.state.activeWalletId).not.toBe(null);
    const numberOfAccounts = wallet.state.accounts;
    const walletId = wallet.state.activeWalletId;
    expect(numberOfAccounts[walletId]).not.toBe(undefined);
    expect(numberOfAccounts[walletId]).toHaveProperty('mainnet');
    expect(numberOfAccounts[walletId]).toHaveProperty('testnet');
    expect(wallet.state.enabledChains[walletId]).toHaveProperty('mainnet');
    expect(wallet.state.enabledChains[walletId]).toHaveProperty('testnet');
    expect(wallet.state.enabledChains[walletId]).toHaveProperty('testnet');
    expect(wallet.state.enabledChains[walletId]).toHaveProperty('mainnet');
}));
test('should be able to create wallet with imported true', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
    yield wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    expect(wallet.state.wallets[0].imported).toBe(true);
}));
//# sourceMappingURL=createWallet.test.js.map