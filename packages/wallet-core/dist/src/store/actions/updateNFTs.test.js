"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
describe('updateNFTs tests', () => {
    it('should getNFT assets for ETH', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
        yield wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: 'rough symbol license spirit advance pact catalog vibrant dream great usage empty',
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
        const accountIds = [wallet.getters.accountsData.find((a) => a.chain === 'ethereum').id];
        const assets = yield wallet.dispatch.updateNFTs({
            walletId: wallet.state.activeWalletId,
            network: wallet.state.activeNetwork,
            accountIds,
        });
        expect(assets).toEqual(Array(accountIds.length).fill([]));
    }));
});
//# sourceMappingURL=updateNFTs.test.js.map