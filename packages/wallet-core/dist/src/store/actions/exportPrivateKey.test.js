"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
const types_1 = require("../types");
test('should be able to export private key', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
    yield wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'piece effort bind that embrace enrich remind powder sudden patient legend group',
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
    const privateKey = yield wallet.dispatch.exportPrivateKey({
        network: types_1.Network.Mainnet,
        walletId: walletId,
        accountId: ethAccountId,
        chainId: cryptoassets_1.ChainId.Ethereum,
    });
    expect(privateKey).not.toBeNull();
    expect(privateKey).not.toBe(undefined);
    expect(privateKey).not.toBe('N/A');
}));
//# sourceMappingURL=exportPrivateKey.test.js.map