"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fees_1 = require("./fees");
describe('fees tests', () => {
    test('should be able to validate ETH getSendFee', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = (0, fees_1.getSendFee)('ETH', 1);
        expect(result).not.toBeUndefined();
    }));
    test('should be able to validate BTC getSendFee', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = (0, fees_1.getSendFee)('BTC', 1);
        expect(result).not.toBeUndefined();
    }));
    test('should be able to validate getFeeLabel', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let result = (0, fees_1.getFeeLabel)('test');
        expect(result).toBe('');
        result = (0, fees_1.getFeeLabel)('slow');
        expect(result).toBe('Slow');
        result = (0, fees_1.getFeeLabel)('Average');
        expect(result).toBe('Avg');
    }));
    test('should be able to validate getTxFee', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let result = (0, fees_1.getTxFee)({
            ETH: 1,
        }, 'ETH', 1);
        expect(result).not.toBeUndefined();
        expect(result).not.toBe(NaN);
        result = (0, fees_1.getTxFee)({
            DAI: 1,
        }, 'DAI', 1);
        expect(result).not.toBeUndefined();
        expect(result).not.toBe(NaN);
        result = (0, fees_1.getTxFee)({
            UST: 1,
        }, 'UST', 1);
        expect(result).not.toBeUndefined();
        expect(result).not.toBe(NaN);
    }));
});
//# sourceMappingURL=fees.test.js.map