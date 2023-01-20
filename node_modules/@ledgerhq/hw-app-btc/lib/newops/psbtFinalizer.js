"use strict";
exports.__esModule = true;
exports.finalize = void 0;
var buffertools_1 = require("../buffertools");
var psbtv2_1 = require("./psbtv2");
/**
 * This roughly implements the "input finalizer" role of BIP370 (PSBTv2
 * https://github.com/bitcoin/bips/blob/master/bip-0370.mediawiki). However
 * the role is documented in BIP174 (PSBTv0
 * https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki).
 *
 * Verify that all inputs have a signature, and set inputFinalScriptwitness
 * and/or inputFinalScriptSig depending on the type of the spent outputs. Clean
 * fields that aren't useful anymore, partial signatures, redeem script and
 * derivation paths.
 *
 * @param psbt The psbt with all signatures added as partial sigs, either
 * through PSBT_IN_PARTIAL_SIG or PSBT_IN_TAP_KEY_SIG
 */
function finalize(psbt) {
    // First check that each input has a signature
    var inputCount = psbt.getGlobalInputCount();
    for (var i = 0; i < inputCount; i++) {
        var legacyPubkeys = psbt.getInputKeyDatas(i, psbtv2_1.psbtIn.PARTIAL_SIG);
        var taprootSig = psbt.getInputTapKeySig(i);
        if (legacyPubkeys.length == 0 && !taprootSig) {
            throw Error("No signature for input ".concat(i, " present"));
        }
        if (legacyPubkeys.length > 0) {
            if (legacyPubkeys.length > 1) {
                throw Error("Expected exactly one signature, got ".concat(legacyPubkeys.length));
            }
            if (taprootSig) {
                throw Error("Both taproot and non-taproot signatures present.");
            }
            var isSegwitV0 = !!psbt.getInputWitnessUtxo(i);
            var redeemScript = psbt.getInputRedeemScript(i);
            var isWrappedSegwit = !!redeemScript;
            var signature = psbt.getInputPartialSig(i, legacyPubkeys[0]);
            if (!signature)
                throw new Error("Expected partial signature for input " + i);
            if (isSegwitV0) {
                var witnessBuf = new buffertools_1.BufferWriter();
                witnessBuf.writeVarInt(2);
                witnessBuf.writeVarInt(signature.length);
                witnessBuf.writeSlice(signature);
                witnessBuf.writeVarInt(legacyPubkeys[0].length);
                witnessBuf.writeSlice(legacyPubkeys[0]);
                psbt.setInputFinalScriptwitness(i, witnessBuf.buffer());
                if (isWrappedSegwit) {
                    if (!redeemScript || redeemScript.length == 0) {
                        throw new Error("Expected non-empty redeemscript. Can't finalize intput " + i);
                    }
                    var scriptSigBuf = new buffertools_1.BufferWriter();
                    // Push redeemScript length
                    scriptSigBuf.writeUInt8(redeemScript.length);
                    scriptSigBuf.writeSlice(redeemScript);
                    psbt.setInputFinalScriptsig(i, scriptSigBuf.buffer());
                }
            }
            else {
                // Legacy input
                var scriptSig = new buffertools_1.BufferWriter();
                writePush(scriptSig, signature);
                writePush(scriptSig, legacyPubkeys[0]);
                psbt.setInputFinalScriptsig(i, scriptSig.buffer());
            }
        }
        else {
            // Taproot input
            var signature = psbt.getInputTapKeySig(i);
            if (!signature) {
                throw Error("No taproot signature found");
            }
            if (signature.length != 64 && signature.length != 65) {
                throw Error("Unexpected length of schnorr signature.");
            }
            var witnessBuf = new buffertools_1.BufferWriter();
            witnessBuf.writeVarInt(1);
            witnessBuf.writeVarSlice(signature);
            psbt.setInputFinalScriptwitness(i, witnessBuf.buffer());
        }
        clearFinalizedInput(psbt, i);
    }
}
exports.finalize = finalize;
/**
 * Deletes fields that are no longer neccesary from the psbt.
 *
 * Note, the spec doesn't say anything about removing ouput fields
 * like PSBT_OUT_BIP32_DERIVATION_PATH and others, so we keep them
 * without actually knowing why. I think we should remove them too.
 */
function clearFinalizedInput(psbt, inputIndex) {
    var keyTypes = [
        psbtv2_1.psbtIn.BIP32_DERIVATION,
        psbtv2_1.psbtIn.PARTIAL_SIG,
        psbtv2_1.psbtIn.TAP_BIP32_DERIVATION,
        psbtv2_1.psbtIn.TAP_KEY_SIG,
    ];
    var witnessUtxoAvailable = !!psbt.getInputWitnessUtxo(inputIndex);
    var nonWitnessUtxoAvailable = !!psbt.getInputNonWitnessUtxo(inputIndex);
    if (witnessUtxoAvailable && nonWitnessUtxoAvailable) {
        // Remove NON_WITNESS_UTXO for segwit v0 as it's only needed while signing.
        // Segwit v1 doesn't have NON_WITNESS_UTXO set.
        // See https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki#cite_note-7
        keyTypes.push(psbtv2_1.psbtIn.NON_WITNESS_UTXO);
    }
    psbt.deleteInputEntries(inputIndex, keyTypes);
}
/**
 * Writes a script push operation to buf, which looks different
 * depending on the size of the data. See
 * https://en.bitcoin.it/wiki/Script#Constants
 *
 * @param buf the BufferWriter to write to
 * @param data the Buffer to be pushed.
 */
function writePush(buf, data) {
    if (data.length <= 75) {
        buf.writeUInt8(data.length);
    }
    else if (data.length <= 256) {
        buf.writeUInt8(76);
        buf.writeUInt8(data.length);
    }
    else if (data.length <= 256 * 256) {
        buf.writeUInt8(77);
        var b = Buffer.alloc(2);
        b.writeUInt16LE(data.length, 0);
        buf.writeSlice(b);
    }
    buf.writeSlice(data);
}
//# sourceMappingURL=psbtFinalizer.js.map