"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
const types_1 = require("../types");
test('Should be able create wallet and add custom tokens', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
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
    yield wallet.dispatch.addCustomToken({
        network: types_1.Network.Mainnet,
        walletId: wallet.state.activeWalletId,
        chain: cryptoassets_1.ChainId.Ethereum,
        symbol: 'TST',
        name: 'Test Token',
        contractAddress: '0x1234567890123456789012345678901234567890',
        decimals: 18,
    });
    expect((_a = wallet.state.customTokens.mainnet) === null || _a === void 0 ? void 0 : _a[wallet.state.activeWalletId][0].symbol).toBe('TST');
    expect((_b = wallet.state.customTokens.mainnet) === null || _b === void 0 ? void 0 : _b[wallet.state.activeWalletId][0].name).toBe('Test Token');
    expect((_c = wallet.state.customTokens.mainnet) === null || _c === void 0 ? void 0 : _c[wallet.state.activeWalletId][0].contractAddress).toBe('0x1234567890123456789012345678901234567890');
    expect((_d = wallet.state.customTokens.mainnet) === null || _d === void 0 ? void 0 : _d[wallet.state.activeWalletId][0].decimals).toBe(18);
    expect((_e = wallet.state.customTokens.mainnet) === null || _e === void 0 ? void 0 : _e[wallet.state.activeWalletId][0].chain).toBe('ethereum');
    yield wallet.dispatch.addCustomToken({
        network: types_1.Network.Testnet,
        walletId: wallet.state.activeWalletId,
        chain: cryptoassets_1.ChainId.Bitcoin,
        symbol: 'BCTS',
        name: 'Test Bitcoin',
        contractAddress: '0x1234567890123456789012343333378901234567890',
        decimals: 11,
    });
    expect((_f = wallet.state.customTokens.testnet) === null || _f === void 0 ? void 0 : _f[wallet.state.activeWalletId][0].symbol).toBe('BCTS');
    expect((_g = wallet.state.customTokens.testnet) === null || _g === void 0 ? void 0 : _g[wallet.state.activeWalletId][0].name).toBe('Test Bitcoin');
    expect((_h = wallet.state.customTokens.testnet) === null || _h === void 0 ? void 0 : _h[wallet.state.activeWalletId][0].contractAddress).toBe('0x1234567890123456789012343333378901234567890');
    expect((_j = wallet.state.customTokens.testnet) === null || _j === void 0 ? void 0 : _j[wallet.state.activeWalletId][0].decimals).toBe(11);
    expect((_k = wallet.state.customTokens.testnet) === null || _k === void 0 ? void 0 : _k[wallet.state.activeWalletId][0].chain).toBe('bitcoin');
}));
//# sourceMappingURL=addCustomToken.test.js.map