import { PsbtV2 } from "./psbtv2";
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
export declare function finalize(psbt: PsbtV2): void;
//# sourceMappingURL=psbtFinalizer.d.ts.map