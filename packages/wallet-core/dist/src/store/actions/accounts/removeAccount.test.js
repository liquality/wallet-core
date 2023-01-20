"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../../walletOptions/defaultOptions"));
const types_1 = require("../../types");
describe('Remove account', () => {
    test.skip('should be able to remove account', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
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
        const walletId = wallet.state.activeWalletId;
        const account = (_a = wallet.state.accounts) === null || _a === void 0 ? void 0 : _a[walletId];
        const btcMainnetAccountId = account === null || account === void 0 ? void 0 : account.mainnet[0].id;
        const ethMainnetAccountId = account === null || account === void 0 ? void 0 : account.mainnet[1].id;
        const btcTestnetAccountId = account === null || account === void 0 ? void 0 : account.testnet[0].id;
        const ethTestnetAccountId = account === null || account === void 0 ? void 0 : account.testnet[1].id;
        yield wallet.dispatch.removeAccount({
            network: types_1.Network.Mainnet,
            walletId: walletId,
            id: btcMainnetAccountId,
        });
        yield wallet.dispatch.removeAccount({
            network: types_1.Network.Mainnet,
            walletId: walletId,
            id: ethMainnetAccountId,
        });
        yield wallet.dispatch.removeAccount({
            network: types_1.Network.Testnet,
            walletId: walletId,
            id: ethTestnetAccountId,
        });
        yield wallet.dispatch.removeAccount({
            network: types_1.Network.Testnet,
            walletId: walletId,
            id: btcTestnetAccountId,
        });
        expect(account === null || account === void 0 ? void 0 : account.mainnet[0].id).not.toBe(btcMainnetAccountId);
        expect(account === null || account === void 0 ? void 0 : account.mainnet.length).toBe(5);
        expect(account === null || account === void 0 ? void 0 : account.testnet.length).toBe(5);
    }));
});
//# sourceMappingURL=removeAccount.test.js.map