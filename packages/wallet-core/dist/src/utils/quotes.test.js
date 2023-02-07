"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Process = tslib_1.__importStar(require("process"));
const index_1 = require("../index");
const types_1 = require("../store/types");
const defaultOptions_1 = tslib_1.__importDefault(require("../walletOptions/defaultOptions"));
const quotes_1 = require("./quotes");
describe('quotes utils tests', () => {
    jest.setTimeout(90000);
    const createNotification = jest.fn();
    const wallet = (0, index_1.setupWallet)(Object.assign(Object.assign({}, defaultOptions_1.default), { createNotification }));
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
    it('should be able test calculateQuoteRate against testnet', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const walletId = wallet.state.activeWalletId;
        expect(walletId).toBeDefined();
        yield wallet.dispatch.updateMarketData({
            network: types_1.Network.Testnet,
        });
        const quotes = yield wallet.dispatch.getQuotes({
            network: types_1.Network.Testnet,
            from: 'BTC',
            to: 'ETH',
            fromAccountId: walletId,
            toAccountId: walletId,
            amount: '1',
        });
        expect(quotes).toBeDefined();
        expect(quotes.quotes.length).toBeGreaterThan(0);
        const result = (0, quotes_1.calculateQuoteRate)(quotes.quotes[0]);
        expect(result).toBeDefined();
        expect(result).not.toBeNaN();
    }));
    it('should be able test sortQuotes against testnet', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const walletId = wallet.state.activeWalletId;
        expect(walletId).toBeDefined();
        yield wallet.dispatch.updateMarketData({
            network: types_1.Network.Testnet,
        });
        let quotes = yield wallet.dispatch.getQuotes({
            network: types_1.Network.Testnet,
            from: 'BTC',
            to: 'ETH',
            fromAccountId: walletId,
            toAccountId: walletId,
            amount: '1',
        });
        expect(quotes).toBeDefined();
        expect(quotes.quotes.length).toBeGreaterThan(0);
        let result = (0, quotes_1.sortQuotes)(quotes.quotes, types_1.Network.Testnet);
        expect(result).toBeDefined();
        expect(result).not.toBeNaN();
        quotes = yield wallet.dispatch.getQuotes({
            network: types_1.Network.Testnet,
            from: 'ETH',
            to: 'DAI',
            fromAccountId: walletId,
            toAccountId: walletId,
            amount: '1',
        });
        expect(quotes).toBeDefined();
        expect(quotes.quotes.length).toBeGreaterThan(0);
        result = (0, quotes_1.sortQuotes)(quotes.quotes, types_1.Network.Testnet);
        expect(result).toBeDefined();
        expect(result).not.toBeNaN();
    }));
});
//# sourceMappingURL=quotes.test.js.map