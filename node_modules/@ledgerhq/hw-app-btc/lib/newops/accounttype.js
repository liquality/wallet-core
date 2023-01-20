"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.p2wpkh = exports.p2wpkhWrapped = exports.p2tr = exports.p2pkh = void 0;
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var tiny_secp256k1_1 = require("tiny-secp256k1");
var buffertools_1 = require("../buffertools");
var constants_1 = require("../constants");
var hashPublicKey_1 = require("../hashPublicKey");
var BaseAccount = /** @class */ (function () {
    function BaseAccount(psbt, masterFp) {
        this.psbt = psbt;
        this.masterFp = masterFp;
    }
    return BaseAccount;
}());
/**
 * Superclass for single signature accounts. This will make sure that the pubkey
 * arrays and path arrays in the method arguments contains exactly one element
 * and calls an abstract method to do the actual work.
 */
var SingleKeyAccount = /** @class */ (function (_super) {
    __extends(SingleKeyAccount, _super);
    function SingleKeyAccount() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SingleKeyAccount.prototype.spendingCondition = function (pubkeys) {
        if (pubkeys.length != 1) {
            throw new Error("Expected single key, got " + pubkeys.length);
        }
        return this.singleKeyCondition(pubkeys[0]);
    };
    SingleKeyAccount.prototype.setInput = function (i, inputTx, spentOutput, pubkeys, pathElems) {
        if (pubkeys.length != 1) {
            throw new Error("Expected single key, got " + pubkeys.length);
        }
        if (pathElems.length != 1) {
            throw new Error("Expected single path, got " + pathElems.length);
        }
        this.setSingleKeyInput(i, inputTx, spentOutput, pubkeys[0], pathElems[0]);
    };
    SingleKeyAccount.prototype.setOwnOutput = function (i, cond, pubkeys, paths) {
        if (pubkeys.length != 1) {
            throw new Error("Expected single key, got " + pubkeys.length);
        }
        if (paths.length != 1) {
            throw new Error("Expected single path, got " + paths.length);
        }
        this.setSingleKeyOutput(i, cond, pubkeys[0], paths[0]);
    };
    return SingleKeyAccount;
}(BaseAccount));
var p2pkh = /** @class */ (function (_super) {
    __extends(p2pkh, _super);
    function p2pkh() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    p2pkh.prototype.singleKeyCondition = function (pubkey) {
        var buf = new buffertools_1.BufferWriter();
        var pubkeyHash = (0, hashPublicKey_1.hashPublicKey)(pubkey);
        buf.writeSlice(Buffer.from([constants_1.OP_DUP, constants_1.OP_HASH160, constants_1.HASH_SIZE]));
        buf.writeSlice(pubkeyHash);
        buf.writeSlice(Buffer.from([constants_1.OP_EQUALVERIFY, constants_1.OP_CHECKSIG]));
        return { scriptPubKey: buf.buffer() };
    };
    p2pkh.prototype.setSingleKeyInput = function (i, inputTx, _spentOutput, pubkey, path) {
        if (!inputTx) {
            throw new Error("Full input base transaction required");
        }
        this.psbt.setInputNonWitnessUtxo(i, inputTx);
        this.psbt.setInputBip32Derivation(i, pubkey, this.masterFp, path);
    };
    p2pkh.prototype.setSingleKeyOutput = function (i, cond, pubkey, path) {
        this.psbt.setOutputBip32Derivation(i, pubkey, this.masterFp, path);
    };
    p2pkh.prototype.getDescriptorTemplate = function () {
        return "pkh(@0)";
    };
    return p2pkh;
}(SingleKeyAccount));
exports.p2pkh = p2pkh;
var p2tr = /** @class */ (function (_super) {
    __extends(p2tr, _super);
    function p2tr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    p2tr.prototype.singleKeyCondition = function (pubkey) {
        var xonlyPubkey = pubkey.slice(1); // x-only pubkey
        var buf = new buffertools_1.BufferWriter();
        var outputKey = this.getTaprootOutputKey(xonlyPubkey);
        buf.writeSlice(Buffer.from([0x51, 32])); // push1, pubkeylen
        buf.writeSlice(outputKey);
        return { scriptPubKey: buf.buffer() };
    };
    p2tr.prototype.setSingleKeyInput = function (i, _inputTx, spentOutput, pubkey, path) {
        var xonly = pubkey.slice(1);
        this.psbt.setInputTapBip32Derivation(i, xonly, [], this.masterFp, path);
        this.psbt.setInputWitnessUtxo(i, spentOutput.amount, spentOutput.cond.scriptPubKey);
    };
    p2tr.prototype.setSingleKeyOutput = function (i, cond, pubkey, path) {
        var xonly = pubkey.slice(1);
        this.psbt.setOutputTapBip32Derivation(i, xonly, [], this.masterFp, path);
    };
    p2tr.prototype.getDescriptorTemplate = function () {
        return "tr(@0)";
    };
    /*
    The following two functions are copied from wallet-btc and adapted.
    They should be moved to a library to avoid code reuse.
    */
    p2tr.prototype.hashTapTweak = function (x) {
        // hash_tag(x) = SHA256(SHA256(tag) || SHA256(tag) || x), see BIP340
        // See https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki#specification
        var h = bitcoinjs_lib_1.crypto.sha256(Buffer.from("TapTweak", "utf-8"));
        return bitcoinjs_lib_1.crypto.sha256(Buffer.concat([h, h, x]));
    };
    /**
     * Calculates a taproot output key from an internal key. This output key will be
     * used as witness program in a taproot output. The internal key is tweaked
     * according to recommendation in BIP341:
     * https://github.com/bitcoin/bips/blob/master/bip-0341.mediawiki#cite_ref-22-0
     *
     * @param internalPubkey A 32 byte x-only taproot internal key
     * @returns The output key
     */
    p2tr.prototype.getTaprootOutputKey = function (internalPubkey) {
        if (internalPubkey.length != 32) {
            throw new Error("Expected 32 byte pubkey. Got " + internalPubkey.length);
        }
        // A BIP32 derived key can be converted to a schnorr pubkey by dropping
        // the first byte, which represent the oddness/evenness. In schnorr all
        // pubkeys are even.
        // https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki#public-key-conversion
        var evenEcdsaPubkey = Buffer.concat([
            Buffer.from([0x02]),
            internalPubkey,
        ]);
        var tweak = this.hashTapTweak(internalPubkey);
        // Q = P + int(hash_TapTweak(bytes(P)))G
        var outputEcdsaKey = Buffer.from((0, tiny_secp256k1_1.pointAddScalar)(evenEcdsaPubkey, tweak));
        // Convert to schnorr.
        var outputSchnorrKey = outputEcdsaKey.slice(1);
        // Create address
        return outputSchnorrKey;
    };
    return p2tr;
}(SingleKeyAccount));
exports.p2tr = p2tr;
var p2wpkhWrapped = /** @class */ (function (_super) {
    __extends(p2wpkhWrapped, _super);
    function p2wpkhWrapped() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    p2wpkhWrapped.prototype.singleKeyCondition = function (pubkey) {
        var buf = new buffertools_1.BufferWriter();
        var redeemScript = this.createRedeemScript(pubkey);
        var scriptHash = (0, hashPublicKey_1.hashPublicKey)(redeemScript);
        buf.writeSlice(Buffer.from([constants_1.OP_HASH160, constants_1.HASH_SIZE]));
        buf.writeSlice(scriptHash);
        buf.writeUInt8(constants_1.OP_EQUAL);
        return { scriptPubKey: buf.buffer(), redeemScript: redeemScript };
    };
    p2wpkhWrapped.prototype.setSingleKeyInput = function (i, inputTx, spentOutput, pubkey, path) {
        if (!inputTx) {
            throw new Error("Full input base transaction required");
        }
        this.psbt.setInputNonWitnessUtxo(i, inputTx);
        this.psbt.setInputBip32Derivation(i, pubkey, this.masterFp, path);
        var userSuppliedRedeemScript = spentOutput.cond.redeemScript;
        var expectedRedeemScript = this.createRedeemScript(pubkey);
        if (userSuppliedRedeemScript &&
            !expectedRedeemScript.equals(userSuppliedRedeemScript)) {
            // At what point might a user set the redeemScript on its own?
            throw new Error("User-supplied redeemScript ".concat(userSuppliedRedeemScript.toString("hex"), " doesn't\n       match expected ").concat(expectedRedeemScript.toString("hex"), " for input ").concat(i));
        }
        this.psbt.setInputRedeemScript(i, expectedRedeemScript);
        this.psbt.setInputWitnessUtxo(i, spentOutput.amount, spentOutput.cond.scriptPubKey);
    };
    p2wpkhWrapped.prototype.setSingleKeyOutput = function (i, cond, pubkey, path) {
        this.psbt.setOutputRedeemScript(i, cond.redeemScript);
        this.psbt.setOutputBip32Derivation(i, pubkey, this.masterFp, path);
    };
    p2wpkhWrapped.prototype.getDescriptorTemplate = function () {
        return "sh(wpkh(@0))";
    };
    p2wpkhWrapped.prototype.createRedeemScript = function (pubkey) {
        var pubkeyHash = (0, hashPublicKey_1.hashPublicKey)(pubkey);
        return Buffer.concat([Buffer.from("0014", "hex"), pubkeyHash]);
    };
    return p2wpkhWrapped;
}(SingleKeyAccount));
exports.p2wpkhWrapped = p2wpkhWrapped;
var p2wpkh = /** @class */ (function (_super) {
    __extends(p2wpkh, _super);
    function p2wpkh() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    p2wpkh.prototype.singleKeyCondition = function (pubkey) {
        var buf = new buffertools_1.BufferWriter();
        var pubkeyHash = (0, hashPublicKey_1.hashPublicKey)(pubkey);
        buf.writeSlice(Buffer.from([0, constants_1.HASH_SIZE]));
        buf.writeSlice(pubkeyHash);
        return { scriptPubKey: buf.buffer() };
    };
    p2wpkh.prototype.setSingleKeyInput = function (i, inputTx, spentOutput, pubkey, path) {
        if (!inputTx) {
            throw new Error("Full input base transaction required");
        }
        this.psbt.setInputNonWitnessUtxo(i, inputTx);
        this.psbt.setInputBip32Derivation(i, pubkey, this.masterFp, path);
        this.psbt.setInputWitnessUtxo(i, spentOutput.amount, spentOutput.cond.scriptPubKey);
    };
    p2wpkh.prototype.setSingleKeyOutput = function (i, cond, pubkey, path) {
        this.psbt.setOutputBip32Derivation(i, pubkey, this.masterFp, path);
    };
    p2wpkh.prototype.getDescriptorTemplate = function () {
        return "wpkh(@0)";
    };
    return p2wpkh;
}(SingleKeyAccount));
exports.p2wpkh = p2wpkh;
//# sourceMappingURL=accounttype.js.map