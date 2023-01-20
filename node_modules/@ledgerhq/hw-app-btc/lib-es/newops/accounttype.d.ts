/// <reference types="node" />
import { DefaultDescriptorTemplate } from "./policy";
import { PsbtV2 } from "./psbtv2";
export declare type SpendingCondition = {
    scriptPubKey: Buffer;
    redeemScript?: Buffer;
};
export declare type SpentOutput = {
    cond: SpendingCondition;
    amount: Buffer;
};
/**
 * Encapsulates differences between account types, for example p2wpkh,
 * p2wpkhWrapped, p2tr.
 */
export interface AccountType {
    /**
     * Generates a scriptPubKey (output script) from a list of public keys. If a
     * p2sh redeemScript or a p2wsh witnessScript is needed it will also be set on
     * the returned SpendingCondition.
     *
     * The pubkeys are expected to be 33 byte ecdsa compressed pubkeys.
     */
    spendingCondition(pubkeys: Buffer[]): SpendingCondition;
    /**
     * Populates the psbt with account type-specific data for an input.
     * @param i The index of the input map to populate
     * @param inputTx The full transaction containing the spent output. This may
     * be omitted for taproot.
     * @param spentOutput The amount and spending condition of the spent output
     * @param pubkeys The 33 byte ecdsa compressed public keys involved in the input
     * @param pathElems The paths corresponding to the pubkeys, in same order.
     */
    setInput(i: number, inputTx: Buffer | undefined, spentOutput: SpentOutput, pubkeys: Buffer[], pathElems: number[][]): void;
    /**
     * Populates the psbt with account type-specific data for an output. This is typically
     * done for change outputs and other outputs that goes to the same account as
     * being spent from.
     * @param i The index of the output map to populate
     * @param cond The spending condition for this output
     * @param pubkeys The 33 byte ecdsa compressed public keys involved in this output
     * @param paths The paths corresponding to the pubkeys, in same order.
     */
    setOwnOutput(i: number, cond: SpendingCondition, pubkeys: Buffer[], paths: number[][]): void;
    /**
     * Returns the descriptor template for this account type. Currently only
     * DefaultDescriptorTemplates are allowed, but that might be changed in the
     * future. See class WalletPolicy for more information on descriptor
     * templates.
     */
    getDescriptorTemplate(): DefaultDescriptorTemplate;
}
interface BaseAccount extends AccountType {
}
declare abstract class BaseAccount implements AccountType {
    protected psbt: PsbtV2;
    protected masterFp: Buffer;
    constructor(psbt: PsbtV2, masterFp: Buffer);
}
/**
 * Superclass for single signature accounts. This will make sure that the pubkey
 * arrays and path arrays in the method arguments contains exactly one element
 * and calls an abstract method to do the actual work.
 */
declare abstract class SingleKeyAccount extends BaseAccount {
    spendingCondition(pubkeys: Buffer[]): SpendingCondition;
    protected abstract singleKeyCondition(pubkey: Buffer): SpendingCondition;
    setInput(i: number, inputTx: Buffer | undefined, spentOutput: SpentOutput, pubkeys: Buffer[], pathElems: number[][]): void;
    protected abstract setSingleKeyInput(i: number, inputTx: Buffer | undefined, spentOutput: SpentOutput, pubkey: Buffer, path: number[]): any;
    setOwnOutput(i: number, cond: SpendingCondition, pubkeys: Buffer[], paths: number[][]): void;
    protected abstract setSingleKeyOutput(i: number, cond: SpendingCondition, pubkey: Buffer, path: number[]): any;
}
export declare class p2pkh extends SingleKeyAccount {
    singleKeyCondition(pubkey: Buffer): SpendingCondition;
    setSingleKeyInput(i: number, inputTx: Buffer | undefined, _spentOutput: SpentOutput, pubkey: Buffer, path: number[]): void;
    setSingleKeyOutput(i: number, cond: SpendingCondition, pubkey: Buffer, path: number[]): void;
    getDescriptorTemplate(): DefaultDescriptorTemplate;
}
export declare class p2tr extends SingleKeyAccount {
    singleKeyCondition(pubkey: Buffer): SpendingCondition;
    setSingleKeyInput(i: number, _inputTx: Buffer | undefined, spentOutput: SpentOutput, pubkey: Buffer, path: number[]): void;
    setSingleKeyOutput(i: number, cond: SpendingCondition, pubkey: Buffer, path: number[]): void;
    getDescriptorTemplate(): DefaultDescriptorTemplate;
    private hashTapTweak;
    /**
     * Calculates a taproot output key from an internal key. This output key will be
     * used as witness program in a taproot output. The internal key is tweaked
     * according to recommendation in BIP341:
     * https://github.com/bitcoin/bips/blob/master/bip-0341.mediawiki#cite_ref-22-0
     *
     * @param internalPubkey A 32 byte x-only taproot internal key
     * @returns The output key
     */
    getTaprootOutputKey(internalPubkey: Buffer): Buffer;
}
export declare class p2wpkhWrapped extends SingleKeyAccount {
    singleKeyCondition(pubkey: Buffer): SpendingCondition;
    setSingleKeyInput(i: number, inputTx: Buffer | undefined, spentOutput: SpentOutput, pubkey: Buffer, path: number[]): void;
    setSingleKeyOutput(i: number, cond: SpendingCondition, pubkey: Buffer, path: number[]): void;
    getDescriptorTemplate(): DefaultDescriptorTemplate;
    private createRedeemScript;
}
export declare class p2wpkh extends SingleKeyAccount {
    singleKeyCondition(pubkey: Buffer): SpendingCondition;
    setSingleKeyInput(i: number, inputTx: Buffer | undefined, spentOutput: SpentOutput, pubkey: Buffer, path: number[]): void;
    setSingleKeyOutput(i: number, cond: SpendingCondition, pubkey: Buffer, path: number[]): void;
    getDescriptorTemplate(): DefaultDescriptorTemplate;
}
export {};
//# sourceMappingURL=accounttype.d.ts.map