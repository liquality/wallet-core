/// <reference types="node" />
export declare enum psbtGlobal {
    TX_VERSION = 2,
    FALLBACK_LOCKTIME = 3,
    INPUT_COUNT = 4,
    OUTPUT_COUNT = 5,
    TX_MODIFIABLE = 6,
    VERSION = 251
}
export declare enum psbtIn {
    NON_WITNESS_UTXO = 0,
    WITNESS_UTXO = 1,
    PARTIAL_SIG = 2,
    SIGHASH_TYPE = 3,
    REDEEM_SCRIPT = 4,
    BIP32_DERIVATION = 6,
    FINAL_SCRIPTSIG = 7,
    FINAL_SCRIPTWITNESS = 8,
    PREVIOUS_TXID = 14,
    OUTPUT_INDEX = 15,
    SEQUENCE = 16,
    TAP_KEY_SIG = 19,
    TAP_BIP32_DERIVATION = 22
}
export declare enum psbtOut {
    REDEEM_SCRIPT = 0,
    BIP_32_DERIVATION = 2,
    AMOUNT = 3,
    SCRIPT = 4,
    TAP_BIP32_DERIVATION = 7
}
export declare class NoSuchEntry extends Error {
}
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
export declare class PsbtV2 {
    protected globalMap: Map<string, Buffer>;
    protected inputMaps: Map<string, Buffer>[];
    protected outputMaps: Map<string, Buffer>[];
    setGlobalTxVersion(version: number): void;
    getGlobalTxVersion(): number;
    setGlobalFallbackLocktime(locktime: number): void;
    getGlobalFallbackLocktime(): number | undefined;
    setGlobalInputCount(inputCount: number): void;
    getGlobalInputCount(): number;
    setGlobalOutputCount(outputCount: number): void;
    getGlobalOutputCount(): number;
    setGlobalTxModifiable(byte: Buffer): void;
    getGlobalTxModifiable(): Buffer | undefined;
    setGlobalPsbtVersion(psbtVersion: number): void;
    getGlobalPsbtVersion(): number;
    setInputNonWitnessUtxo(inputIndex: number, transaction: Buffer): void;
    getInputNonWitnessUtxo(inputIndex: number): Buffer | undefined;
    setInputWitnessUtxo(inputIndex: number, amount: Buffer, scriptPubKey: Buffer): void;
    getInputWitnessUtxo(inputIndex: number): {
        amount: Buffer;
        scriptPubKey: Buffer;
    } | undefined;
    setInputPartialSig(inputIndex: number, pubkey: Buffer, signature: Buffer): void;
    getInputPartialSig(inputIndex: number, pubkey: Buffer): Buffer | undefined;
    setInputSighashType(inputIndex: number, sigHashtype: number): void;
    getInputSighashType(inputIndex: number): number | undefined;
    setInputRedeemScript(inputIndex: number, redeemScript: Buffer): void;
    getInputRedeemScript(inputIndex: number): Buffer | undefined;
    setInputBip32Derivation(inputIndex: number, pubkey: Buffer, masterFingerprint: Buffer, path: number[]): void;
    getInputBip32Derivation(inputIndex: number, pubkey: Buffer): {
        masterFingerprint: Buffer;
        path: number[];
    } | undefined;
    setInputFinalScriptsig(inputIndex: number, scriptSig: Buffer): void;
    getInputFinalScriptsig(inputIndex: number): Buffer | undefined;
    setInputFinalScriptwitness(inputIndex: number, scriptWitness: Buffer): void;
    getInputFinalScriptwitness(inputIndex: number): Buffer;
    setInputPreviousTxId(inputIndex: number, txid: Buffer): void;
    getInputPreviousTxid(inputIndex: number): Buffer;
    setInputOutputIndex(inputIndex: number, outputIndex: number): void;
    getInputOutputIndex(inputIndex: number): number;
    setInputSequence(inputIndex: number, sequence: number): void;
    getInputSequence(inputIndex: number): number;
    setInputTapKeySig(inputIndex: number, sig: Buffer): void;
    getInputTapKeySig(inputIndex: number): Buffer | undefined;
    setInputTapBip32Derivation(inputIndex: number, pubkey: Buffer, hashes: Buffer[], masterFingerprint: Buffer, path: number[]): void;
    getInputTapBip32Derivation(inputIndex: number, pubkey: Buffer): {
        hashes: Buffer[];
        masterFingerprint: Buffer;
        path: number[];
    };
    getInputKeyDatas(inputIndex: number, keyType: KeyType): Buffer[];
    setOutputRedeemScript(outputIndex: number, redeemScript: Buffer): void;
    getOutputRedeemScript(outputIndex: number): Buffer;
    setOutputBip32Derivation(outputIndex: number, pubkey: Buffer, masterFingerprint: Buffer, path: number[]): void;
    getOutputBip32Derivation(outputIndex: number, pubkey: Buffer): {
        masterFingerprint: Buffer;
        path: number[];
    };
    setOutputAmount(outputIndex: number, amount: number): void;
    getOutputAmount(outputIndex: number): number;
    setOutputScript(outputIndex: number, scriptPubKey: Buffer): void;
    getOutputScript(outputIndex: number): Buffer;
    setOutputTapBip32Derivation(outputIndex: number, pubkey: Buffer, hashes: Buffer[], fingerprint: Buffer, path: number[]): void;
    getOutputTapBip32Derivation(outputIndex: number, pubkey: Buffer): {
        hashes: Buffer[];
        masterFingerprint: Buffer;
        path: number[];
    };
    deleteInputEntries(inputIndex: number, keyTypes: psbtIn[]): void;
    copy(to: PsbtV2): void;
    copyMaps(from: Map<string, Buffer>[], to: Map<string, Buffer>[]): void;
    copyMap(from: Map<string, Buffer>, to: Map<string, Buffer>): void;
    serialize(): Buffer;
    deserialize(psbt: Buffer): void;
    private readKeyPair;
    private getKeyDatas;
    private isKeyType;
    private setGlobal;
    private getGlobal;
    private getGlobalOptional;
    private setInput;
    private getInput;
    private getInputOptional;
    private setOutput;
    private getOutput;
    private getMap;
    private encodeBip32Derivation;
    private decodeBip32Derivation;
    private writeBip32Derivation;
    private readBip32Derivation;
    private encodeTapBip32Derivation;
    private decodeTapBip32Derivation;
}
declare type KeyType = number;
export {};
//# sourceMappingURL=psbtv2.d.ts.map