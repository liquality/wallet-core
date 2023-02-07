"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Process = tslib_1.__importStar(require("process"));
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
const types_1 = require("../types");
describe('getQuotes tests', () => {
    jest.setTimeout(90000);
    const wallet = (0, index_1.setupWallet)(defaultOptions_1.default);
    let TEST_MNEMONIC = Process.env.TEST_MNEMONIC;
    if (!TEST_MNEMONIC) {
        throw new Error('Please set the TEST_MNEMONIC environment variable');
    }
    TEST_MNEMONIC = TEST_MNEMONIC.replace(/,/g, ' ');
    beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: TEST_MNEMONIC,
            imported: true,
        });
        yield wallet.dispatch.unlockWallet({
            key: '0x1234567890123456789012345678901234567890',
        });
        yield wallet.dispatch.changeActiveNetwork({
            network: types_1.Network.Testnet,
        });
    }));
});
//# sourceMappingURL=getQuotes.test.js.map