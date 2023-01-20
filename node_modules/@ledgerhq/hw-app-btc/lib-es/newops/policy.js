import { crypto } from "bitcoinjs-lib";
import { pathArrayToString } from "../bip32";
import { BufferWriter } from "../buffertools";
import { hashLeaf, Merkle } from "./merkle";
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
        return crypto.sha256(this.serialize());
    };
    WalletPolicy.prototype.serialize = function () {
        var keyBuffers = this.keys.map(function (k) {
            return Buffer.from(k, "ascii");
        });
        var m = new Merkle(keyBuffers.map(function (k) { return hashLeaf(k); }));
        var buf = new BufferWriter();
        buf.writeUInt8(0x01); // wallet type (policy map)
        buf.writeUInt8(0); // length of wallet name (empty string for default wallets)
        buf.writeVarSlice(Buffer.from(this.descriptorTemplate, "ascii"));
        buf.writeVarInt(this.keys.length), buf.writeSlice(m.getRoot());
        return buf.buffer();
    };
    return WalletPolicy;
}());
export { WalletPolicy };
export function createKey(masterFingerprint, path, xpub) {
    var accountPath = pathArrayToString(path);
    return "[".concat(masterFingerprint.toString("hex")).concat(accountPath.substring(1), "]").concat(xpub, "/**");
}
//# sourceMappingURL=policy.js.map