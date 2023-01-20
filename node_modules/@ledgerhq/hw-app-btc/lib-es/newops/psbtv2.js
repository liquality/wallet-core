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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BufferReader, BufferWriter, unsafeFrom64bitLE, unsafeTo64bitLE, } from "../buffertools";
export var psbtGlobal;
(function (psbtGlobal) {
    psbtGlobal[psbtGlobal["TX_VERSION"] = 2] = "TX_VERSION";
    psbtGlobal[psbtGlobal["FALLBACK_LOCKTIME"] = 3] = "FALLBACK_LOCKTIME";
    psbtGlobal[psbtGlobal["INPUT_COUNT"] = 4] = "INPUT_COUNT";
    psbtGlobal[psbtGlobal["OUTPUT_COUNT"] = 5] = "OUTPUT_COUNT";
    psbtGlobal[psbtGlobal["TX_MODIFIABLE"] = 6] = "TX_MODIFIABLE";
    psbtGlobal[psbtGlobal["VERSION"] = 251] = "VERSION";
})(psbtGlobal || (psbtGlobal = {}));
export var psbtIn;
(function (psbtIn) {
    psbtIn[psbtIn["NON_WITNESS_UTXO"] = 0] = "NON_WITNESS_UTXO";
    psbtIn[psbtIn["WITNESS_UTXO"] = 1] = "WITNESS_UTXO";
    psbtIn[psbtIn["PARTIAL_SIG"] = 2] = "PARTIAL_SIG";
    psbtIn[psbtIn["SIGHASH_TYPE"] = 3] = "SIGHASH_TYPE";
    psbtIn[psbtIn["REDEEM_SCRIPT"] = 4] = "REDEEM_SCRIPT";
    psbtIn[psbtIn["BIP32_DERIVATION"] = 6] = "BIP32_DERIVATION";
    psbtIn[psbtIn["FINAL_SCRIPTSIG"] = 7] = "FINAL_SCRIPTSIG";
    psbtIn[psbtIn["FINAL_SCRIPTWITNESS"] = 8] = "FINAL_SCRIPTWITNESS";
    psbtIn[psbtIn["PREVIOUS_TXID"] = 14] = "PREVIOUS_TXID";
    psbtIn[psbtIn["OUTPUT_INDEX"] = 15] = "OUTPUT_INDEX";
    psbtIn[psbtIn["SEQUENCE"] = 16] = "SEQUENCE";
    psbtIn[psbtIn["TAP_KEY_SIG"] = 19] = "TAP_KEY_SIG";
    psbtIn[psbtIn["TAP_BIP32_DERIVATION"] = 22] = "TAP_BIP32_DERIVATION";
})(psbtIn || (psbtIn = {}));
export var psbtOut;
(function (psbtOut) {
    psbtOut[psbtOut["REDEEM_SCRIPT"] = 0] = "REDEEM_SCRIPT";
    psbtOut[psbtOut["BIP_32_DERIVATION"] = 2] = "BIP_32_DERIVATION";
    psbtOut[psbtOut["AMOUNT"] = 3] = "AMOUNT";
    psbtOut[psbtOut["SCRIPT"] = 4] = "SCRIPT";
    psbtOut[psbtOut["TAP_BIP32_DERIVATION"] = 7] = "TAP_BIP32_DERIVATION";
})(psbtOut || (psbtOut = {}));
var PSBT_MAGIC_BYTES = Buffer.from([0x70, 0x73, 0x62, 0x74, 0xff]);
var NoSuchEntry = /** @class */ (function (_super) {
    __extends(NoSuchEntry, _super);
    function NoSuchEntry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NoSuchEntry;
}(Error));
export { NoSuchEntry };
/**
 * Implements Partially Signed Bitcoin Transaction version 2, BIP370, as
 * documented at https://github.com/bitcoin/bips/blob/master/bip-0370.mediawiki
 * and https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki
 *
 * A psbt is a data structure that can carry all relevant information about a
 * transaction through all stages of the signing process. From constructing an
 * unsigned transaction to extracting the final serialized transaction ready for
 * broadcast.
 *
 * This implementation is limited to what's needed in ledgerjs to carry out its
 * duties, which means that support for features like multisig or taproot script
 * path spending are not implemented. Specifically, it supports p2pkh,
 * p2wpkhWrappedInP2sh, p2wpkh and p2tr key path spending.
 *
 * This class is made purposefully dumb, so it's easy to add support for
 * complemantary fields as needed in the future.
 */
var PsbtV2 = /** @class */ (function () {
    function PsbtV2() {
        this.globalMap = new Map();
        this.inputMaps = [];
        this.outputMaps = [];
    }
    PsbtV2.prototype.setGlobalTxVersion = function (version) {
        this.setGlobal(psbtGlobal.TX_VERSION, uint32LE(version));
    };
    PsbtV2.prototype.getGlobalTxVersion = function () {
        return this.getGlobal(psbtGlobal.TX_VERSION).readUInt32LE(0);
    };
    PsbtV2.prototype.setGlobalFallbackLocktime = function (locktime) {
        this.setGlobal(psbtGlobal.FALLBACK_LOCKTIME, uint32LE(locktime));
    };
    PsbtV2.prototype.getGlobalFallbackLocktime = function () {
        var _a;
        return (_a = this.getGlobalOptional(psbtGlobal.FALLBACK_LOCKTIME)) === null || _a === void 0 ? void 0 : _a.readUInt32LE(0);
    };
    PsbtV2.prototype.setGlobalInputCount = function (inputCount) {
        this.setGlobal(psbtGlobal.INPUT_COUNT, varint(inputCount));
    };
    PsbtV2.prototype.getGlobalInputCount = function () {
        return fromVarint(this.getGlobal(psbtGlobal.INPUT_COUNT));
    };
    PsbtV2.prototype.setGlobalOutputCount = function (outputCount) {
        this.setGlobal(psbtGlobal.OUTPUT_COUNT, varint(outputCount));
    };
    PsbtV2.prototype.getGlobalOutputCount = function () {
        return fromVarint(this.getGlobal(psbtGlobal.OUTPUT_COUNT));
    };
    PsbtV2.prototype.setGlobalTxModifiable = function (byte) {
        this.setGlobal(psbtGlobal.TX_MODIFIABLE, byte);
    };
    PsbtV2.prototype.getGlobalTxModifiable = function () {
        return this.getGlobalOptional(psbtGlobal.TX_MODIFIABLE);
    };
    PsbtV2.prototype.setGlobalPsbtVersion = function (psbtVersion) {
        this.setGlobal(psbtGlobal.VERSION, uint32LE(psbtVersion));
    };
    PsbtV2.prototype.getGlobalPsbtVersion = function () {
        return this.getGlobal(psbtGlobal.VERSION).readUInt32LE(0);
    };
    PsbtV2.prototype.setInputNonWitnessUtxo = function (inputIndex, transaction) {
        this.setInput(inputIndex, psbtIn.NON_WITNESS_UTXO, b(), transaction);
    };
    PsbtV2.prototype.getInputNonWitnessUtxo = function (inputIndex) {
        return this.getInputOptional(inputIndex, psbtIn.NON_WITNESS_UTXO, b());
    };
    PsbtV2.prototype.setInputWitnessUtxo = function (inputIndex, amount, scriptPubKey) {
        var buf = new BufferWriter();
        buf.writeSlice(amount);
        buf.writeVarSlice(scriptPubKey);
        this.setInput(inputIndex, psbtIn.WITNESS_UTXO, b(), buf.buffer());
    };
    PsbtV2.prototype.getInputWitnessUtxo = function (inputIndex) {
        var utxo = this.getInputOptional(inputIndex, psbtIn.WITNESS_UTXO, b());
        if (!utxo)
            return undefined;
        var buf = new BufferReader(utxo);
        return { amount: buf.readSlice(8), scriptPubKey: buf.readVarSlice() };
    };
    PsbtV2.prototype.setInputPartialSig = function (inputIndex, pubkey, signature) {
        this.setInput(inputIndex, psbtIn.PARTIAL_SIG, pubkey, signature);
    };
    PsbtV2.prototype.getInputPartialSig = function (inputIndex, pubkey) {
        return this.getInputOptional(inputIndex, psbtIn.PARTIAL_SIG, pubkey);
    };
    PsbtV2.prototype.setInputSighashType = function (inputIndex, sigHashtype) {
        this.setInput(inputIndex, psbtIn.SIGHASH_TYPE, b(), uint32LE(sigHashtype));
    };
    PsbtV2.prototype.getInputSighashType = function (inputIndex) {
        var result = this.getInputOptional(inputIndex, psbtIn.SIGHASH_TYPE, b());
        if (!result)
            return undefined;
        return result.readUInt32LE(0);
    };
    PsbtV2.prototype.setInputRedeemScript = function (inputIndex, redeemScript) {
        this.setInput(inputIndex, psbtIn.REDEEM_SCRIPT, b(), redeemScript);
    };
    PsbtV2.prototype.getInputRedeemScript = function (inputIndex) {
        return this.getInputOptional(inputIndex, psbtIn.REDEEM_SCRIPT, b());
    };
    PsbtV2.prototype.setInputBip32Derivation = function (inputIndex, pubkey, masterFingerprint, path) {
        if (pubkey.length != 33)
            throw new Error("Invalid pubkey length: " + pubkey.length);
        this.setInput(inputIndex, psbtIn.BIP32_DERIVATION, pubkey, this.encodeBip32Derivation(masterFingerprint, path));
    };
    PsbtV2.prototype.getInputBip32Derivation = function (inputIndex, pubkey) {
        var buf = this.getInputOptional(inputIndex, psbtIn.BIP32_DERIVATION, pubkey);
        if (!buf)
            return undefined;
        return this.decodeBip32Derivation(buf);
    };
    PsbtV2.prototype.setInputFinalScriptsig = function (inputIndex, scriptSig) {
        this.setInput(inputIndex, psbtIn.FINAL_SCRIPTSIG, b(), scriptSig);
    };
    PsbtV2.prototype.getInputFinalScriptsig = function (inputIndex) {
        return this.getInputOptional(inputIndex, psbtIn.FINAL_SCRIPTSIG, b());
    };
    PsbtV2.prototype.setInputFinalScriptwitness = function (inputIndex, scriptWitness) {
        this.setInput(inputIndex, psbtIn.FINAL_SCRIPTWITNESS, b(), scriptWitness);
    };
    PsbtV2.prototype.getInputFinalScriptwitness = function (inputIndex) {
        return this.getInput(inputIndex, psbtIn.FINAL_SCRIPTWITNESS, b());
    };
    PsbtV2.prototype.setInputPreviousTxId = function (inputIndex, txid) {
        this.setInput(inputIndex, psbtIn.PREVIOUS_TXID, b(), txid);
    };
    PsbtV2.prototype.getInputPreviousTxid = function (inputIndex) {
        return this.getInput(inputIndex, psbtIn.PREVIOUS_TXID, b());
    };
    PsbtV2.prototype.setInputOutputIndex = function (inputIndex, outputIndex) {
        this.setInput(inputIndex, psbtIn.OUTPUT_INDEX, b(), uint32LE(outputIndex));
    };
    PsbtV2.prototype.getInputOutputIndex = function (inputIndex) {
        return this.getInput(inputIndex, psbtIn.OUTPUT_INDEX, b()).readUInt32LE(0);
    };
    PsbtV2.prototype.setInputSequence = function (inputIndex, sequence) {
        this.setInput(inputIndex, psbtIn.SEQUENCE, b(), uint32LE(sequence));
    };
    PsbtV2.prototype.getInputSequence = function (inputIndex) {
        var _a, _b;
        return ((_b = (_a = this.getInputOptional(inputIndex, psbtIn.SEQUENCE, b())) === null || _a === void 0 ? void 0 : _a.readUInt32LE(0)) !== null && _b !== void 0 ? _b : 0xffffffff);
    };
    PsbtV2.prototype.setInputTapKeySig = function (inputIndex, sig) {
        this.setInput(inputIndex, psbtIn.TAP_KEY_SIG, b(), sig);
    };
    PsbtV2.prototype.getInputTapKeySig = function (inputIndex) {
        return this.getInputOptional(inputIndex, psbtIn.TAP_KEY_SIG, b());
    };
    PsbtV2.prototype.setInputTapBip32Derivation = function (inputIndex, pubkey, hashes, masterFingerprint, path) {
        if (pubkey.length != 32)
            throw new Error("Invalid pubkey length: " + pubkey.length);
        var buf = this.encodeTapBip32Derivation(hashes, masterFingerprint, path);
        this.setInput(inputIndex, psbtIn.TAP_BIP32_DERIVATION, pubkey, buf);
    };
    PsbtV2.prototype.getInputTapBip32Derivation = function (inputIndex, pubkey) {
        var buf = this.getInput(inputIndex, psbtIn.TAP_BIP32_DERIVATION, pubkey);
        return this.decodeTapBip32Derivation(buf);
    };
    PsbtV2.prototype.getInputKeyDatas = function (inputIndex, keyType) {
        return this.getKeyDatas(this.inputMaps[inputIndex], keyType);
    };
    PsbtV2.prototype.setOutputRedeemScript = function (outputIndex, redeemScript) {
        this.setOutput(outputIndex, psbtOut.REDEEM_SCRIPT, b(), redeemScript);
    };
    PsbtV2.prototype.getOutputRedeemScript = function (outputIndex) {
        return this.getOutput(outputIndex, psbtOut.REDEEM_SCRIPT, b());
    };
    PsbtV2.prototype.setOutputBip32Derivation = function (outputIndex, pubkey, masterFingerprint, path) {
        this.setOutput(outputIndex, psbtOut.BIP_32_DERIVATION, pubkey, this.encodeBip32Derivation(masterFingerprint, path));
    };
    PsbtV2.prototype.getOutputBip32Derivation = function (outputIndex, pubkey) {
        var buf = this.getOutput(outputIndex, psbtOut.BIP_32_DERIVATION, pubkey);
        return this.decodeBip32Derivation(buf);
    };
    PsbtV2.prototype.setOutputAmount = function (outputIndex, amount) {
        this.setOutput(outputIndex, psbtOut.AMOUNT, b(), uint64LE(amount));
    };
    PsbtV2.prototype.getOutputAmount = function (outputIndex) {
        var buf = this.getOutput(outputIndex, psbtOut.AMOUNT, b());
        return unsafeFrom64bitLE(buf);
    };
    PsbtV2.prototype.setOutputScript = function (outputIndex, scriptPubKey) {
        this.setOutput(outputIndex, psbtOut.SCRIPT, b(), scriptPubKey);
    };
    PsbtV2.prototype.getOutputScript = function (outputIndex) {
        return this.getOutput(outputIndex, psbtOut.SCRIPT, b());
    };
    PsbtV2.prototype.setOutputTapBip32Derivation = function (outputIndex, pubkey, hashes, fingerprint, path) {
        var buf = this.encodeTapBip32Derivation(hashes, fingerprint, path);
        this.setOutput(outputIndex, psbtOut.TAP_BIP32_DERIVATION, pubkey, buf);
    };
    PsbtV2.prototype.getOutputTapBip32Derivation = function (outputIndex, pubkey) {
        var buf = this.getOutput(outputIndex, psbtOut.TAP_BIP32_DERIVATION, pubkey);
        return this.decodeTapBip32Derivation(buf);
    };
    PsbtV2.prototype.deleteInputEntries = function (inputIndex, keyTypes) {
        var _this = this;
        var map = this.inputMaps[inputIndex];
        map.forEach(function (_v, k, m) {
            if (_this.isKeyType(k, keyTypes)) {
                m["delete"](k);
            }
        });
    };
    PsbtV2.prototype.copy = function (to) {
        this.copyMap(this.globalMap, to.globalMap);
        this.copyMaps(this.inputMaps, to.inputMaps);
        this.copyMaps(this.outputMaps, to.outputMaps);
    };
    PsbtV2.prototype.copyMaps = function (from, to) {
        var _this = this;
        from.forEach(function (m, index) {
            var to_index = new Map();
            _this.copyMap(m, to_index);
            to[index] = to_index;
        });
    };
    PsbtV2.prototype.copyMap = function (from, to) {
        from.forEach(function (v, k) { return to.set(k, Buffer.from(v)); });
    };
    PsbtV2.prototype.serialize = function () {
        var buf = new BufferWriter();
        buf.writeSlice(Buffer.from([0x70, 0x73, 0x62, 0x74, 0xff]));
        serializeMap(buf, this.globalMap);
        this.inputMaps.forEach(function (map) {
            serializeMap(buf, map);
        });
        this.outputMaps.forEach(function (map) {
            serializeMap(buf, map);
        });
        return buf.buffer();
    };
    PsbtV2.prototype.deserialize = function (psbt) {
        var buf = new BufferReader(psbt);
        if (!buf.readSlice(5).equals(PSBT_MAGIC_BYTES)) {
            throw new Error("Invalid magic bytes");
        }
        while (this.readKeyPair(this.globalMap, buf))
            ;
        for (var i = 0; i < this.getGlobalInputCount(); i++) {
            this.inputMaps[i] = new Map();
            while (this.readKeyPair(this.inputMaps[i], buf))
                ;
        }
        for (var i = 0; i < this.getGlobalOutputCount(); i++) {
            this.outputMaps[i] = new Map();
            while (this.readKeyPair(this.outputMaps[i], buf))
                ;
        }
    };
    PsbtV2.prototype.readKeyPair = function (map, buf) {
        var keyLen = buf.readVarInt();
        if (keyLen == 0) {
            return false;
        }
        var keyType = buf.readUInt8();
        var keyData = buf.readSlice(keyLen - 1);
        var value = buf.readVarSlice();
        set(map, keyType, keyData, value);
        return true;
    };
    PsbtV2.prototype.getKeyDatas = function (map, keyType) {
        var _this = this;
        var result = [];
        map.forEach(function (_v, k) {
            if (_this.isKeyType(k, [keyType])) {
                result.push(Buffer.from(k.substring(2), "hex"));
            }
        });
        return result;
    };
    PsbtV2.prototype.isKeyType = function (hexKey, keyTypes) {
        var keyType = Buffer.from(hexKey.substring(0, 2), "hex").readUInt8(0);
        return keyTypes.some(function (k) { return k == keyType; });
    };
    PsbtV2.prototype.setGlobal = function (keyType, value) {
        var key = new Key(keyType, Buffer.from([]));
        this.globalMap.set(key.toString(), value);
    };
    PsbtV2.prototype.getGlobal = function (keyType) {
        return get(this.globalMap, keyType, b(), false);
    };
    PsbtV2.prototype.getGlobalOptional = function (keyType) {
        return get(this.globalMap, keyType, b(), true);
    };
    PsbtV2.prototype.setInput = function (index, keyType, keyData, value) {
        set(this.getMap(index, this.inputMaps), keyType, keyData, value);
    };
    PsbtV2.prototype.getInput = function (index, keyType, keyData) {
        return get(this.inputMaps[index], keyType, keyData, false);
    };
    PsbtV2.prototype.getInputOptional = function (index, keyType, keyData) {
        return get(this.inputMaps[index], keyType, keyData, true);
    };
    PsbtV2.prototype.setOutput = function (index, keyType, keyData, value) {
        set(this.getMap(index, this.outputMaps), keyType, keyData, value);
    };
    PsbtV2.prototype.getOutput = function (index, keyType, keyData) {
        return get(this.outputMaps[index], keyType, keyData, false);
    };
    PsbtV2.prototype.getMap = function (index, maps) {
        if (maps[index]) {
            return maps[index];
        }
        return (maps[index] = new Map());
    };
    PsbtV2.prototype.encodeBip32Derivation = function (masterFingerprint, path) {
        var buf = new BufferWriter();
        this.writeBip32Derivation(buf, masterFingerprint, path);
        return buf.buffer();
    };
    PsbtV2.prototype.decodeBip32Derivation = function (buffer) {
        var buf = new BufferReader(buffer);
        return this.readBip32Derivation(buf);
    };
    PsbtV2.prototype.writeBip32Derivation = function (buf, masterFingerprint, path) {
        buf.writeSlice(masterFingerprint);
        path.forEach(function (element) {
            buf.writeUInt32(element);
        });
    };
    PsbtV2.prototype.readBip32Derivation = function (buf) {
        var masterFingerprint = buf.readSlice(4);
        var path = [];
        while (buf.offset < buf.buffer.length) {
            path.push(buf.readUInt32());
        }
        return { masterFingerprint: masterFingerprint, path: path };
    };
    PsbtV2.prototype.encodeTapBip32Derivation = function (hashes, masterFingerprint, path) {
        var buf = new BufferWriter();
        buf.writeVarInt(hashes.length);
        hashes.forEach(function (h) {
            buf.writeSlice(h);
        });
        this.writeBip32Derivation(buf, masterFingerprint, path);
        return buf.buffer();
    };
    PsbtV2.prototype.decodeTapBip32Derivation = function (buffer) {
        var buf = new BufferReader(buffer);
        var hashCount = buf.readVarInt();
        var hashes = [];
        for (var i = 0; i < hashCount; i++) {
            hashes.push(buf.readSlice(32));
        }
        var deriv = this.readBip32Derivation(buf);
        return __assign({ hashes: hashes }, deriv);
    };
    return PsbtV2;
}());
export { PsbtV2 };
function get(map, keyType, keyData, acceptUndefined) {
    if (!map)
        throw Error("No such map");
    var key = new Key(keyType, keyData);
    var value = map.get(key.toString());
    if (!value) {
        if (acceptUndefined) {
            return undefined;
        }
        throw new NoSuchEntry(key.toString());
    }
    // Make sure to return a copy, to protect the underlying data.
    return Buffer.from(value);
}
var Key = /** @class */ (function () {
    function Key(keyType, keyData) {
        this.keyType = keyType;
        this.keyData = keyData;
    }
    Key.prototype.toString = function () {
        var buf = new BufferWriter();
        this.toBuffer(buf);
        return buf.buffer().toString("hex");
    };
    Key.prototype.serialize = function (buf) {
        buf.writeVarInt(1 + this.keyData.length);
        this.toBuffer(buf);
    };
    Key.prototype.toBuffer = function (buf) {
        buf.writeUInt8(this.keyType);
        buf.writeSlice(this.keyData);
    };
    return Key;
}());
var KeyPair = /** @class */ (function () {
    function KeyPair(key, value) {
        this.key = key;
        this.value = value;
    }
    KeyPair.prototype.serialize = function (buf) {
        this.key.serialize(buf);
        buf.writeVarSlice(this.value);
    };
    return KeyPair;
}());
function createKey(buf) {
    return new Key(buf.readUInt8(0), buf.slice(1));
}
function serializeMap(buf, map) {
    for (var k in map.keys) {
        var value = map.get(k);
        var keyPair = new KeyPair(createKey(Buffer.from(k, "hex")), value);
        keyPair.serialize(buf);
    }
    buf.writeUInt8(0);
}
function b() {
    return Buffer.from([]);
}
function set(map, keyType, keyData, value) {
    var key = new Key(keyType, keyData);
    map.set(key.toString(), value);
}
function uint32LE(n) {
    var b = Buffer.alloc(4);
    b.writeUInt32LE(n, 0);
    return b;
}
function uint64LE(n) {
    return unsafeTo64bitLE(n);
}
function varint(n) {
    var b = new BufferWriter();
    b.writeVarInt(n);
    return b.buffer();
}
function fromVarint(buf) {
    return new BufferReader(buf).readVarInt();
}
//# sourceMappingURL=psbtv2.js.map