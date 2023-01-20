"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../../walletOptions/defaultOptions"));
const types_1 = require("../../types");
let wallet;
beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
    yield wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'rough symbol license spirit advance pact catalog vibrant dream great usage empty',
        imported: true,
    });
    yield wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    yield wallet.dispatch.setWhatsNewModalVersion({
        version: '1.0.0',
    });
}));
test.skip('should be able to toggle account', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const walletId = wallet.state.activeWalletId;
    const btcMainnetAccountId = (_a = wallet.state.accounts) === null || _a === void 0 ? void 0 : _a[walletId].mainnet[0].id;
    const ethMainnetAccountId = (_b = wallet.state.accounts) === null || _b === void 0 ? void 0 : _b[walletId].mainnet[1].id;
    yield wallet.dispatch.toggleAccount({
        network: types_1.Network.Mainnet,
        walletId: walletId,
        accounts: [btcMainnetAccountId, ethMainnetAccountId],
        enable: false,
    });
    expect((_c = wallet.state.accounts) === null || _c === void 0 ? void 0 : _c[walletId].mainnet[0].enabled).toBe(false);
    expect((_d = wallet.state.accounts) === null || _d === void 0 ? void 0 : _d[walletId].mainnet[1].enabled).toBe(false);
    yield wallet.dispatch.toggleAccount({
        network: types_1.Network.Mainnet,
        walletId: walletId,
        accounts: [btcMainnetAccountId, ethMainnetAccountId],
        enable: true,
    });
    expect((_e = wallet.state.accounts) === null || _e === void 0 ? void 0 : _e[walletId].mainnet[0].enabled).toBe(true);
    expect((_f = wallet.state.accounts) === null || _f === void 0 ? void 0 : _f[walletId].mainnet[1].enabled).toBe(true);
}));
//# sourceMappingURL=toggleAccount.test.js.map