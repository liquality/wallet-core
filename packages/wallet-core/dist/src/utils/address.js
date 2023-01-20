"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BTC_ADDRESS_TYPE_TO_PREFIX = exports.BitcoinAddressType = exports.shortenAddress = void 0;
const bitcoin_1 = require("@chainify/bitcoin");
function shortenAddress(address) {
    const prefix = address.startsWith('0x') ? '0x' : '';
    const isTerra = address.startsWith('terra');
    return `${prefix}${address.replace('0x', '').substring(0, prefix ? 4 : 6)}...${address.substring(isTerra ? address.length - 6 : address.length - 4)}`;
}
exports.shortenAddress = shortenAddress;
exports.BitcoinAddressType = bitcoin_1.BitcoinTypes.AddressType;
exports.BTC_ADDRESS_TYPE_TO_PREFIX = {
    [exports.BitcoinAddressType.LEGACY]: 44,
    [exports.BitcoinAddressType.P2SH_SEGWIT]: 49,
    [exports.BitcoinAddressType.BECH32]: 84,
};
//# sourceMappingURL=address.js.map