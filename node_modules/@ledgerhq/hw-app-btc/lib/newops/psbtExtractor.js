"use strict";
exports.__esModule = true;
exports.extract = void 0;
var buffertools_1 = require("../buffertools");
/**
 * This implements the "Transaction Extractor" role of BIP370 (PSBTv2
 * https://github.com/bitcoin/bips/blob/master/bip-0370.mediawiki#transaction-extractor). However
 * the role is partially documented in BIP174 (PSBTv0
 * https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki#transaction-extractor).
 */
function extract(psbt) {
    var _a, _b;
    var tx = new buffertools_1.BufferWriter();
    tx.writeUInt32(psbt.getGlobalTxVersion());
    var isSegwit = !!psbt.getInputWitnessUtxo(0);
    if (isSegwit) {
        tx.writeSlice(Buffer.from([0, 1]));
    }
    var inputCount = psbt.getGlobalInputCount();
    tx.writeVarInt(inputCount);
    var witnessWriter = new buffertools_1.BufferWriter();
    for (var i = 0; i < inputCount; i++) {
        tx.writeSlice(psbt.getInputPreviousTxid(i));
        tx.writeUInt32(psbt.getInputOutputIndex(i));
        tx.writeVarSlice((_a = psbt.getInputFinalScriptsig(i)) !== null && _a !== void 0 ? _a : Buffer.from([]));
        tx.writeUInt32(psbt.getInputSequence(i));
        if (isSegwit) {
            witnessWriter.writeSlice(psbt.getInputFinalScriptwitness(i));
        }
    }
    var outputCount = psbt.getGlobalOutputCount();
    tx.writeVarInt(outputCount);
    for (var i = 0; i < outputCount; i++) {
        tx.writeUInt64(psbt.getOutputAmount(i));
        tx.writeVarSlice(psbt.getOutputScript(i));
    }
    tx.writeSlice(witnessWriter.buffer());
    tx.writeUInt32((_b = psbt.getGlobalFallbackLocktime()) !== null && _b !== void 0 ? _b : 0);
    return tx.buffer();
}
exports.extract = extract;
//# sourceMappingURL=psbtExtractor.js.map