/// <reference types="node" />
import { MerkleMap } from "./merkleMap";
import { PsbtV2 } from "./psbtv2";
/**
 * This class merkelizes a PSBTv2, by merkelizing the different
 * maps of the psbt. This is used during the transaction signing process,
 * where the hardware app can request specific parts of the psbt from the
 * client code and be sure that the response data actually belong to the psbt.
 * The reason for this is the limited amount of memory available to the app,
 * so it can't always store the full psbt in memory.
 *
 * The signing process is documented at
 * https://github.com/LedgerHQ/app-bitcoin-new/blob/master/doc/bitcoin.md#sign_psbt
 */
export declare class MerkelizedPsbt extends PsbtV2 {
    globalMerkleMap: MerkleMap;
    inputMerkleMaps: MerkleMap[];
    outputMerkleMaps: MerkleMap[];
    inputMapCommitments: Buffer[];
    outputMapCommitments: Buffer[];
    constructor(psbt: PsbtV2);
    getGlobalSize(): number;
    getGlobalKeysValuesRoot(): Buffer;
    private static createMerkleMap;
}
//# sourceMappingURL=merkelizedPsbt.d.ts.map