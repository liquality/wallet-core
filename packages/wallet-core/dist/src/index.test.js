"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const build_config_1 = tslib_1.__importDefault(require("./build.config"));
const index_1 = require("./index");
const migrations_1 = require("./store/migrations");
const types_1 = require("./store/types");
const defaultOptions_1 = tslib_1.__importDefault(require("./walletOptions/defaultOptions"));
test('Initial State of wallet setup', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
    expect(wallet.state.rskLegacyDerivation).toBe(false);
    expect(wallet.state.version).toBe(migrations_1.LATEST_VERSION);
    expect(wallet.state.activeNetwork).toBe('mainnet');
    expect(wallet.state.injectEthereumChain).toBe('ethereum');
    expect(wallet.state.injectEthereum).toBe(true);
    wallet = (0, index_1.setupWallet)(Object.assign(Object.assign({}, defaultOptions_1.default), { initialState: Object.assign(Object.assign({}, wallet.state), { version: 18 }) }));
    expect(wallet.state.version).toBe(18);
}));
test('should be able to create wallet and validate mainnet accounts', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
test('Should be able to validate enabled chains', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
    yield wallet.dispatch.acceptTermsAndConditions({ analyticsAccepted: true });
    yield wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    yield wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    yield wallet.dispatch.setWhatsNewModalVersion({
        version: '1.0.0',
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);
    expect(wallet.state.termsAcceptedAt).not.toBe(0);
    expect(wallet.state.whatsNewModalVersion).toBe('1.0.0');
    expect(wallet.state.keyUpdatedAt).not.toBe(0);
    expect(wallet.state.unlockedAt).not.toBe(0);
    expect(wallet.state.setupAt).not.toBe(0);
    const walletId = wallet.state.activeWalletId;
    const mainnetAccounts = (_a = wallet.state.enabledChains[walletId]) === null || _a === void 0 ? void 0 : _a.mainnet;
    const testnetAccounts = (_b = wallet.state.enabledChains[walletId]) === null || _b === void 0 ? void 0 : _b.testnet;
    expect(mainnetAccounts).toEqual(build_config_1.default.chains);
    expect(testnetAccounts).toEqual(build_config_1.default.chains);
    expect(mainnetAccounts === null || mainnetAccounts === void 0 ? void 0 : mainnetAccounts.length).toEqual(12);
    expect(testnetAccounts === null || testnetAccounts === void 0 ? void 0 : testnetAccounts.length).toEqual(12);
}));
test('Should be able to validate assets with analytics false', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
    yield wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    yield wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    yield wallet.dispatch.initializeAnalyticsPreferences({
        accepted: false,
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);
    expect(wallet.state.analytics.userId).not.toBe(null);
    expect(wallet.state.analytics.acceptedDate).toBe(0);
    expect(wallet.state.analytics.askedDate).not.toBe(0);
    expect(wallet.state.analytics.askedTimes).toBe(0);
    expect(wallet.state.analytics.notAskAgain).toBe(false);
    const walletId = wallet.state.activeWalletId;
    const mainnetEnabledAssets = (_c = wallet.state.enabledAssets.mainnet) === null || _c === void 0 ? void 0 : _c[walletId];
    const testnetEnabledAssets = (_d = wallet.state.enabledAssets.testnet) === null || _d === void 0 ? void 0 : _d[walletId];
    expect(mainnetEnabledAssets === null || mainnetEnabledAssets === void 0 ? void 0 : mainnetEnabledAssets.length).toBeGreaterThan(1);
    expect(testnetEnabledAssets === null || testnetEnabledAssets === void 0 ? void 0 : testnetEnabledAssets.length).toBeGreaterThan(1);
}));
test('Should be able to create wallet with validate analytics true', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
    yield wallet.dispatch.toggleExperiment({
        name: types_1.ExperimentType.ManageAccounts,
    });
    expect(wallet.state.experiments.manageAccounts).toBe(true);
}));
test('Should be able create wallet and add custom token and remove token', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
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
    expect((_e = wallet.state.customTokens.mainnet) === null || _e === void 0 ? void 0 : _e[wallet.state.activeWalletId][0].symbol).toBe('TST');
    expect((_f = wallet.state.customTokens.mainnet) === null || _f === void 0 ? void 0 : _f[wallet.state.activeWalletId][0].name).toBe('Test Token');
    expect((_g = wallet.state.customTokens.mainnet) === null || _g === void 0 ? void 0 : _g[wallet.state.activeWalletId][0].contractAddress).toBe('0x1234567890123456789012345678901234567890');
    expect((_h = wallet.state.customTokens.mainnet) === null || _h === void 0 ? void 0 : _h[wallet.state.activeWalletId][0].decimals).toBe(18);
    expect((_j = wallet.state.customTokens.mainnet) === null || _j === void 0 ? void 0 : _j[wallet.state.activeWalletId][0].chain).toBe('ethereum');
    yield wallet.dispatch.addCustomToken({
        network: types_1.Network.Testnet,
        walletId: wallet.state.activeWalletId,
        chain: cryptoassets_1.ChainId.Bitcoin,
        symbol: 'BCTS',
        name: 'Test Bitcoin',
        contractAddress: '0x1234567890123456789012343333378901234567890',
        decimals: 11,
    });
    expect((_k = wallet.state.customTokens.testnet) === null || _k === void 0 ? void 0 : _k[wallet.state.activeWalletId][0].symbol).toBe('BCTS');
    expect((_l = wallet.state.customTokens.testnet) === null || _l === void 0 ? void 0 : _l[wallet.state.activeWalletId][0].name).toBe('Test Bitcoin');
    expect((_m = wallet.state.customTokens.testnet) === null || _m === void 0 ? void 0 : _m[wallet.state.activeWalletId][0].contractAddress).toBe('0x1234567890123456789012343333378901234567890');
    expect((_o = wallet.state.customTokens.testnet) === null || _o === void 0 ? void 0 : _o[wallet.state.activeWalletId][0].decimals).toBe(11);
    expect((_p = wallet.state.customTokens.testnet) === null || _p === void 0 ? void 0 : _p[wallet.state.activeWalletId][0].chain).toBe('bitcoin');
    yield wallet.dispatch.removeCustomToken({
        network: types_1.Network.Mainnet,
        walletId: wallet.state.activeWalletId,
        symbol: 'TST',
    });
    expect((_q = wallet.state.customTokens.mainnet) === null || _q === void 0 ? void 0 : _q[wallet.state.activeWalletId].length).toBe(0);
}));
//# sourceMappingURL=index.test.js.map