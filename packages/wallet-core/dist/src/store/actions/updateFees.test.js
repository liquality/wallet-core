"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const index_1 = require("../../index");
const defaultOptions_1 = tslib_1.__importDefault(require("../../walletOptions/defaultOptions"));
const types_1 = require("../types");
describe('updateFees tests', () => {
    jest.setTimeout(90000);
    const wallet = (0, index_1.setupWallet)(defaultOptions_1.default);
    beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: 'rough symbol license spirit advance pact catalog vibrant dream great usage empty',
            imported: true,
        });
        yield wallet.dispatch.unlockWallet({
            key: '0x1234567890123456789012345678901234567890',
        });
    }));
    it('should be able to update mainnet assets fees', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        expect(wallet.state.wallets.length).toBe(1);
        const walletId = wallet.state.activeWalletId;
        const network = wallet.state.activeNetwork;
        const enabledChains = wallet.state.enabledChains[wallet.state.activeWalletId][network];
        const assets = enabledChains.map((chain) => (0, cryptoassets_1.getNativeAssetCode)(network, chain));
        expect(assets).not.toBeNull();
        for (const mainnetAsset of assets) {
            yield wallet.dispatch.updateFees({
                asset: mainnetAsset,
            });
        }
        const maintainElement = (_a = wallet.state.fees.mainnet) === null || _a === void 0 ? void 0 : _a[walletId];
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.BTC).toHaveProperty('slow');
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.BTC.slow.fee).not.toBe(0);
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.BTC.slow.wait).toBe(3600);
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.BTC).toHaveProperty('average');
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.BTC.average.fee).not.toBe(0);
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.BTC.average.wait).toBe(1800);
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.BTC).toHaveProperty('fast');
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.BTC.fast.fee).not.toBe(0);
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.BTC.fast.wait).toBe(600);
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.AVAX).toHaveProperty('slow');
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.AVAX).toHaveProperty('average');
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.AVAX).toHaveProperty('fast');
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.AVAX.slow.fee).not.toBe(0);
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.AVAX.average.fee).not.toBe(0);
        expect(maintainElement === null || maintainElement === void 0 ? void 0 : maintainElement.AVAX.fast.fee).not.toBe(0);
    }));
    it('should be able to update testnet assets fees', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _b;
        expect(wallet.state.wallets.length).toBe(1);
        yield wallet.dispatch.changeActiveNetwork({ network: types_1.Network.Testnet });
        const walletId = wallet.state.activeWalletId;
        const network = wallet.state.activeNetwork;
        const enabledChains = wallet.state.enabledChains[wallet.state.activeWalletId][network];
        const assets = enabledChains.map((chain) => (0, cryptoassets_1.getNativeAssetCode)(network, chain));
        expect(assets).not.toBeNull();
        for (const testnetAsset of assets) {
            if (testnetAsset === 'LUNA') {
                continue;
            }
            yield wallet.dispatch.updateFees({
                asset: testnetAsset,
            });
        }
        const testnetFeeElement = (_b = wallet.state.fees.testnet) === null || _b === void 0 ? void 0 : _b[walletId];
        expect(testnetFeeElement === null || testnetFeeElement === void 0 ? void 0 : testnetFeeElement.BTC).toHaveProperty('slow');
        expect(testnetFeeElement === null || testnetFeeElement === void 0 ? void 0 : testnetFeeElement.BTC.slow.fee).not.toBe(0);
        expect(testnetFeeElement === null || testnetFeeElement === void 0 ? void 0 : testnetFeeElement.BTC.slow.wait).toBe(3600);
        expect(testnetFeeElement === null || testnetFeeElement === void 0 ? void 0 : testnetFeeElement.BTC).toHaveProperty('average');
        expect(testnetFeeElement === null || testnetFeeElement === void 0 ? void 0 : testnetFeeElement.BTC.average.fee).not.toBe(0);
        expect(testnetFeeElement === null || testnetFeeElement === void 0 ? void 0 : testnetFeeElement.BTC.average.wait).toBe(1800);
        expect(testnetFeeElement === null || testnetFeeElement === void 0 ? void 0 : testnetFeeElement.BTC).toHaveProperty('fast');
        expect(testnetFeeElement === null || testnetFeeElement === void 0 ? void 0 : testnetFeeElement.BTC.fast.fee).not.toBe(0);
        expect(testnetFeeElement === null || testnetFeeElement === void 0 ? void 0 : testnetFeeElement.BTC.fast.wait).toBe(600);
        expect(testnetFeeElement === null || testnetFeeElement === void 0 ? void 0 : testnetFeeElement.AVAX).toHaveProperty('slow');
        expect(testnetFeeElement === null || testnetFeeElement === void 0 ? void 0 : testnetFeeElement.AVAX).toHaveProperty('average');
        expect(testnetFeeElement === null || testnetFeeElement === void 0 ? void 0 : testnetFeeElement.AVAX).toHaveProperty('fast');
        expect(testnetFeeElement === null || testnetFeeElement === void 0 ? void 0 : testnetFeeElement.AVAX.slow.fee).not.toBe(0);
        expect(testnetFeeElement === null || testnetFeeElement === void 0 ? void 0 : testnetFeeElement.AVAX.average.fee).not.toBe(0);
        expect(testnetFeeElement === null || testnetFeeElement === void 0 ? void 0 : testnetFeeElement.AVAX.fast.fee).not.toBe(0);
    }));
});
//# sourceMappingURL=updateFees.test.js.map