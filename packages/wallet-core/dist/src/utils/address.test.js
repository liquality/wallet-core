"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const address_1 = require("./address");
test('should be able to validate short address', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    expect((0, address_1.shortenAddress)('0x0d1f4b24cc8e8e9c0a8b0e8d8c8d8e8e8e8e8e8e8e')).toContain('...');
}));
test('should be able to validate terra short address', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    expect((0, address_1.shortenAddress)('0xterra1u4sntjr03074wdxtqvsamltzd2ynrsfra3502u')).toContain('...');
    expect((0, address_1.shortenAddress)('0xterra1u4sntjr03074wdxtqvsamltzd2ynrsfra3502u')).toContain('terr');
}));
//# sourceMappingURL=address.test.js.map