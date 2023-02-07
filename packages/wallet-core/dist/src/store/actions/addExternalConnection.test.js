"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
describe('add external connection', () => {
    jest.setTimeout(60000);
    test('should be able validate externalConnections & forgetDappConnections', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
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
        expect(walletId).not.toBeNull();
        const mainnetAccounts = (_c = (_b = (_a = wallet === null || wallet === void 0 ? void 0 : wallet.state) === null || _a === void 0 ? void 0 : _a.enabledAssets) === null || _b === void 0 ? void 0 : _b.mainnet) === null || _c === void 0 ? void 0 : _c[walletId];
        expect(mainnetAccounts).not.toBeNull();
        const account = (_f = (_e = (_d = wallet.state.accounts) === null || _d === void 0 ? void 0 : _d[walletId]) === null || _e === void 0 ? void 0 : _e.mainnet) === null || _f === void 0 ? void 0 : _f[1];
        expect(account === null || account === void 0 ? void 0 : account.chain).toBe(cryptoassets_1.ChainId.Ethereum);
        const ethAccountId = account === null || account === void 0 ? void 0 : account.id;
        const ethereumAddress = account === null || account === void 0 ? void 0 : account.addresses[0];
        expect(ethereumAddress).not.toBeNull();
        const originName = 'https://uniswap.org/';
        const externalConnection = {
            origin: originName,
            chain: cryptoassets_1.ChainId.Ethereum,
            accountId: ethAccountId,
            setDefaultEthereum: true,
        };
        yield wallet.dispatch.addExternalConnection(externalConnection);
        expect(Object.keys(wallet.state.externalConnections[walletId]).length).toEqual(1);
        expect((_h = (_g = wallet.state.externalConnections[walletId]) === null || _g === void 0 ? void 0 : _g[originName]) === null || _h === void 0 ? void 0 : _h.defaultEthereum).toEqual(ethAccountId);
        expect(Object.keys((_k = (_j = wallet.state.externalConnections[walletId]) === null || _j === void 0 ? void 0 : _j[originName]) === null || _k === void 0 ? void 0 : _k.ethereum).length).toBeGreaterThan(0);
        expect((_m = (_l = wallet.state.externalConnections[walletId]) === null || _l === void 0 ? void 0 : _l[originName]) === null || _m === void 0 ? void 0 : _m.ethereum[0]).toEqual(ethAccountId);
        yield wallet.dispatch.forgetDappConnections();
        expect(Object.keys(wallet.state.externalConnections[walletId]).length).toEqual(0);
    }));
    test('should be able validate externalConnections for multiple origins', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
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
        const mainnetAccounts = (_q = (_p = (_o = wallet === null || wallet === void 0 ? void 0 : wallet.state) === null || _o === void 0 ? void 0 : _o.enabledAssets) === null || _p === void 0 ? void 0 : _p.mainnet) === null || _q === void 0 ? void 0 : _q[walletId];
        expect(mainnetAccounts).not.toBeNull();
        const account = (_s = (_r = wallet.state.accounts) === null || _r === void 0 ? void 0 : _r[walletId]) === null || _s === void 0 ? void 0 : _s.mainnet;
        const ethAccountId = account === null || account === void 0 ? void 0 : account[1].id;
        const btcAccountId = account === null || account === void 0 ? void 0 : account[0].id;
        const ethereumAddress = account === null || account === void 0 ? void 0 : account[1].addresses[0];
        const bitcoinAddress = account === null || account === void 0 ? void 0 : account[0].addresses[0];
        expect(account === null || account === void 0 ? void 0 : account[1].chain).toBe(cryptoassets_1.ChainId.Ethereum);
        expect(account === null || account === void 0 ? void 0 : account[0].chain).toBe(cryptoassets_1.ChainId.Bitcoin);
        expect(ethereumAddress).not.toBeNull();
        expect(bitcoinAddress).not.toBeNull();
        const originNameOne = 'https://app.uniswap.org';
        const originNameTwo = 'https://app.aave.com';
        const externalConnection = {
            origin: originNameOne,
            chain: cryptoassets_1.ChainId.Ethereum,
            accountId: ethAccountId,
            setDefaultEthereum: true,
        };
        yield wallet.dispatch.addExternalConnection(externalConnection);
        yield wallet.dispatch.addExternalConnection({
            origin: originNameTwo,
            chain: cryptoassets_1.ChainId.Ethereum,
            accountId: ethAccountId,
            setDefaultEthereum: true,
        });
        expect(Object.keys(wallet.state.externalConnections[walletId]).length).toEqual(2);
        expect((_u = (_t = wallet.state.externalConnections[walletId]) === null || _t === void 0 ? void 0 : _t[originNameOne]) === null || _u === void 0 ? void 0 : _u.defaultEthereum).toEqual(ethAccountId);
        expect((_w = (_v = wallet.state.externalConnections[walletId]) === null || _v === void 0 ? void 0 : _v[originNameTwo]) === null || _w === void 0 ? void 0 : _w.defaultEthereum).toEqual(ethAccountId);
        expect(Object.keys((_y = (_x = wallet.state.externalConnections[walletId]) === null || _x === void 0 ? void 0 : _x[originNameOne]) === null || _y === void 0 ? void 0 : _y.ethereum).length).toBeGreaterThan(0);
        expect(Object.keys((_0 = (_z = wallet.state.externalConnections[walletId]) === null || _z === void 0 ? void 0 : _z[originNameTwo]) === null || _0 === void 0 ? void 0 : _0.ethereum).length).toBeGreaterThan(0);
        expect((_2 = (_1 = wallet.state.externalConnections[walletId]) === null || _1 === void 0 ? void 0 : _1[originNameOne]) === null || _2 === void 0 ? void 0 : _2.ethereum[0]).toEqual(ethAccountId);
        expect((_4 = (_3 = wallet.state.externalConnections[walletId]) === null || _3 === void 0 ? void 0 : _3[originNameTwo]) === null || _4 === void 0 ? void 0 : _4.ethereum[0]).toEqual(ethAccountId);
        yield wallet.dispatch.addExternalConnection({
            origin: originNameTwo,
            chain: cryptoassets_1.ChainId.Bitcoin,
            accountId: btcAccountId,
            setDefaultEthereum: false,
        });
        expect(Object.keys(wallet.state.externalConnections[walletId]).length).toEqual(2);
        expect((_6 = (_5 = wallet.state.externalConnections[walletId]) === null || _5 === void 0 ? void 0 : _5[originNameTwo]) === null || _6 === void 0 ? void 0 : _6.ethereum[0]).toEqual(ethAccountId);
        expect((_8 = (_7 = wallet.state.externalConnections[walletId]) === null || _7 === void 0 ? void 0 : _7[originNameTwo]) === null || _8 === void 0 ? void 0 : _8.bitcoin[0]).toEqual(btcAccountId);
    }));
});
//# sourceMappingURL=addExternalConnection.test.js.map