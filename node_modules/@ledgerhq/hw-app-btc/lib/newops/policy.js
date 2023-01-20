"use strict";
exports.__esModule = true;
exports.createKey = exports.WalletPolicy = void 0;
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var bip32_1 = require("../bip32");
var buffertools_1 = require("../buffertools");
var merkle_1 = require("./merkle");
/**
 * The Bitcon hardware app uses a descriptors-like thing to describe
 * how to construct output scripts from keys. A "Wallet Policy" consists
 * of a "Descriptor Template" and a list of "keys". A key is basically
 * a serialized BIP32 extended public key with some added derivation path
 * information. This is documented at
 * https://github.com/LedgerHQ/app-bitcoin-new/blob/master/doc/wallet.md
 */
var WalletPolicy = /** @class */ (function () {
    /**
     * For now, we only support default descriptor templates.
     */
    function WalletPolicy(descriptorTemplate, key) {
        this.descriptorTemplate = descriptorTemplate;
        this.keys = [key];
    }
    WalletPolicy.prototype.getWalletId = function () {
        // wallet_id (sha256 of the wallet serialization),
        return bitcoinjs_lib_1.crypto.sha256(this.serialize());
    };
    WalletPolicy.prototype.serialize = function () {
        var keyBuffers = this.keys.map(function (k) {
            return Buffer.from(k, "ascii");
        });
        var m = new merkle_1.Merkle(keyBuffers.map(function (k) { return (0, merkle_1.hashLeaf)(k); }));
        var buf = new buffertools_1.BufferWriter();
        buf.writeUInt8(0x01); // wallet type (policy map)
        buf.writeUInt8(0); // length of wallet name (empty string for default wallets)
        buf.writeVarSlice(Buffer.from(this.descriptorTemplate, "ascii"));
        buf.writeVarInt(this.keys.length), buf.writeSlice(m.getRoot());
        return buf.buffer();
    };
    return WalletPolicy;
}());
exports.WalletPolicy = WalletPolicy;
function createKey(masterFingerprint, path, xpub) {
    var accountPath = (0, bip32_1.pathArrayToString)(path);
    return "[".concat(masterFingerprint.toString("hex")).concat(accountPath.substring(1), "]").concat(xpub, "/**");
}
exports.createKey = createKey;
//# sourceMappingURL=policy.js.map