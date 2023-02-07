"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cryptoassets_1 = tslib_1.__importDefault(require("../utils/cryptoassets"));
const uns_1 = require("./uns");
describe('chainToUNSKey', () => {
    it('returns correct key for bitcoin', () => {
        const bitcoin = cryptoassets_1.default['BTC'];
        expect((0, uns_1.getUNSKey)(bitcoin)).toBe('crypto.BTC.address');
    });
    it('returns correct key for polygon', () => {
        const matic = cryptoassets_1.default['MATIC'];
        expect((0, uns_1.getUNSKey)(matic)).toBe('crypto.MATIC.version.MATIC.address');
    });
    it('returns ETH for unsupported EVM chain', () => {
        const eth = cryptoassets_1.default['ETH'];
        expect((0, uns_1.getUNSKey)(eth)).toBe('crypto.ETH.address');
    });
});
describe('uns resolver', () => {
    jest.setTimeout(90000);
    const unsResolver = new uns_1.UNSResolver();
    it('should resolve polygon address', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const matic = cryptoassets_1.default['MATIC'];
        const address = yield unsResolver.lookupDomain('shaista.blockchain', matic);
        expect(address).toBe('0xada3bccf641da3b1b1553ed70e7f38c7ad1b3023');
    }));
});
//# sourceMappingURL=uns.test.js.map