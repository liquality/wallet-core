"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
describe('setWhatsNewModalVersion tests', () => {
    it('should be able to validate set whatsNewModalShowed', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const wallet = yield (0, index_1.setupWallet)(defaultOptions_1.default);
        yield wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: 'test',
            imported: true,
        });
        yield wallet.dispatch.unlockWallet({
            key: '0x1234567890123456789012345678901234567890',
        });
        const version = '1.61.0';
        yield wallet.dispatch.setWhatsNewModalVersion({
            version: version,
        });
        expect(wallet.state.whatsNewModalVersion).toBe(version);
    }));
});
//# sourceMappingURL=setWhatsNewModalVersion.test.js.map