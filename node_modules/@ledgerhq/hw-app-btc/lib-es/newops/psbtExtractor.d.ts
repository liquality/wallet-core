/// <reference types="node" />
import { PsbtV2 } from "./psbtv2";
/**
 * This implements the "Transaction Extractor" role of BIP370 (PSBTv2
 * https://github.com/bitcoin/bips/blob/master/bip-0370.mediawiki#transaction-extractor). However
 * the role is partially documented in BIP174 (PSBTv0
 * https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki#transaction-extractor).
 */
export declare function extract(psbt: PsbtV2): Buffer;
//# sourceMappingURL=psbtExtractor.d.ts.map