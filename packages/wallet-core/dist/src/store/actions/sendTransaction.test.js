"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const Process = tslib_1.__importStar(require("process"));
const index_1 = require("../../index");
const history_1 = require("../../utils/history");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
const types_1 = require("../types");
describe('sendTransaction tests', () => {
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
    }));
    it('should be able to do send transaction (AVAX) using testnet', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        yield wallet.dispatch.changeActiveNetwork({
            network: types_1.Network.Testnet,
        });
        expect(wallet.state.activeNetwork).toBe('testnet');
        const walletId = wallet.state.activeWalletId;
        let testnetEnabledAssets = (_c = (_b = (_a = wallet === null || wallet === void 0 ? void 0 : wallet.state) === null || _a === void 0 ? void 0 : _a.enabledAssets) === null || _b === void 0 ? void 0 : _b.testnet) === null || _c === void 0 ? void 0 : _c[walletId];
        testnetEnabledAssets = testnetEnabledAssets.filter((asset) => asset !== 'SOL');
        expect(testnetEnabledAssets === null || testnetEnabledAssets === void 0 ? void 0 : testnetEnabledAssets.length).not.toBe(0);
        yield wallet.dispatch.updateFees({
            asset: 'AVAX',
        });
        const account = (_f = (_e = (_d = wallet.state.accounts) === null || _d === void 0 ? void 0 : _d[walletId]) === null || _e === void 0 ? void 0 : _e.testnet) === null || _f === void 0 ? void 0 : _f.find((acc) => acc.chain === cryptoassets_1.ChainId.Avalanche);
        expect(account === null || account === void 0 ? void 0 : account.chain).toBe(cryptoassets_1.ChainId.Avalanche);
        const avaxAccountId = account === null || account === void 0 ? void 0 : account.id;
        const maintainElement = (_g = wallet.state.fees.testnet) === null || _g === void 0 ? void 0 : _g[walletId];
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.AVAX).toHaveProperty('fast');
        const avaxFeeObject = maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.AVAX.fast;
        yield wallet.dispatch.sendTransaction({
            network: types_1.Network.Testnet,
            walletId: wallet.state.activeWalletId,
            accountId: avaxAccountId,
            asset: 'AVAX',
            to: '0x9d6345f731e160cd90b65a91ab60f4f9e37bdbd2',
            amount: new bignumber_js_1.default(10000000000000),
            data: '',
            fee: avaxFeeObject.fee,
            gas: 21000,
            feeLabel: types_1.FeeLabel.Fast,
            fiatRate: 72,
        });
        expect(wallet.state.history.testnet).toHaveProperty(walletId);
        expect((_h = wallet.state.history.testnet) === null || _h === void 0 ? void 0 : _h[walletId].length).toBe(1);
        expect((_j = wallet.state.history.testnet) === null || _j === void 0 ? void 0 : _j[walletId][0].type).toBe('SEND');
        expect((_k = wallet.state.history.testnet) === null || _k === void 0 ? void 0 : _k[walletId][0].network).toBe('testnet');
        expect((_l = wallet.state.history.testnet) === null || _l === void 0 ? void 0 : _l[walletId][0]).toHaveProperty('txHash');
        const createNotification = jest.fn();
        const b = {
            title: 'Transaction sent',
            message: 'Sending 0.00001 AVAX to 0x9d6345f731e160cd90b65a91ab60f4f9e37bdbd2',
        };
        const bound = createNotification.bind(b);
        bound();
        expect(createNotification).toHaveBeenCalled();
        const historyObject = (_o = (_m = wallet.state.history.testnet) === null || _m === void 0 ? void 0 : _m[walletId]) === null || _o === void 0 ? void 0 : _o[0];
        expect((0, history_1.getStatusLabel)(historyObject)).toBe('Pending');
        expect((0, history_1.getStep)(historyObject)).toBe(0);
    }));
});
//# sourceMappingURL=sendTransaction.test.js.map