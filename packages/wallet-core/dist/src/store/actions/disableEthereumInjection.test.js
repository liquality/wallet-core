"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
describe('disableEthereumInjection & enableEthereumInjection', () => {
    it('should be able to disable injectEthereumChain', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
        yield wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: 'test',
            imported: true,
        });
        yield wallet.dispatch.unlockWallet({
            key: '0x1234567890123456789012345678901234567890',
        });
        expect(wallet.state.injectEthereum).toBe(true);
        yield wallet.dispatch.disableEthereumInjection();
        expect(wallet.state.injectEthereum).toBe(false);
        yield wallet.dispatch.enableEthereumInjection();
        expect(wallet.state.injectEthereum).toBe(true);
    }));
});
//# sourceMappingURL=disableEthereumInjection.test.js.map