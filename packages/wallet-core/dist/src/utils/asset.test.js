"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("../store/types");
const asset_1 = require("./asset");
describe('asset tests', () => {
    test('get native asset test', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect((0, asset_1.getNativeAsset)('DAI')).toBe('ETH');
        expect((0, asset_1.getNativeAsset)('MATIC')).toBe('MATIC');
        expect((0, asset_1.getNativeAsset)('UST')).toBe('UST');
        expect((0, asset_1.getNativeAsset)('LUNA')).toBe('LUNA');
        expect((0, asset_1.getNativeAsset)('SOV')).toBe('RBTC');
    }));
    test('is ERC20 test', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect((0, asset_1.isERC20)('ETH')).toBe(false);
        expect((0, asset_1.isERC20)('DAI')).toBe(true);
        expect((0, asset_1.isERC20)('USDT')).toBe(true);
        expect((0, asset_1.isERC20)('NEAR')).toBe(false);
    }));
    test('isChainEvmCompatible', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect((0, asset_1.isChainEvmCompatible)('ETH')).toBe(true);
        expect((0, asset_1.isERC20)('DAI')).toBe(true);
        expect((0, asset_1.isERC20)('USDT')).toBe(true);
        expect((0, asset_1.isERC20)('WBTC')).toBe(true);
        expect((0, asset_1.isERC20)('NEAR')).toBe(false);
        expect((0, asset_1.isERC20)('LUNA')).toBe(false);
        expect((0, asset_1.isERC20)('BTC')).toBe(false);
    }));
    test('getTransactionExplorerLink test', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let result = (0, asset_1.getTransactionExplorerLink)('f04298d08f77014851f1104a4d7a0248', 'ETH', types_1.Network.Mainnet);
        expect(result).toContain('https://etherscan.io/tx/');
        result = (0, asset_1.getTransactionExplorerLink)('f04298d08f77014851f1104a4d7a0248', 'DAI', types_1.Network.Mainnet);
        expect(result).toContain('https://etherscan.io/tx/');
        result = (0, asset_1.getTransactionExplorerLink)('f04298d08f77014851f1104a4d7a0248', 'USDT', types_1.Network.Mainnet);
        expect(result).toContain('https://etherscan.io/tx/');
        result = (0, asset_1.getTransactionExplorerLink)('f04298d08f77014851f1104a4d7a0248', 'WBTC', types_1.Network.Mainnet);
        expect(result).toContain('https://etherscan.io/tx/');
        result = (0, asset_1.getTransactionExplorerLink)('f04298d08f77014851f1104a4d7a0248', 'NEAR', types_1.Network.Mainnet);
        expect(result).toContain('https://explorer.near.org/transactions/');
    }));
});
//# sourceMappingURL=asset.test.js.map