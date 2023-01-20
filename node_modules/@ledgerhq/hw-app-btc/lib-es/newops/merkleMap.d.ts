/// <reference types="node" />
import { Merkle } from "./merkle";
/**
 * This implements "Merkelized Maps", documented at
 * https://github.com/LedgerHQ/app-bitcoin-new/blob/master/doc/merkle.md#merkleized-maps
 *
 * A merkelized map consist of two merkle trees, one for the keys of
 * a map and one for the values of the same map, thus the two merkle
 * trees have the same shape. The commitment is the number elements
 * in the map followed by the keys' merkle root followed by the
 * values' merkle root.
 */
export declare class MerkleMap {
    keys: Buffer[];
    keysTree: Merkle;
    values: Buffer[];
    valuesTree: Merkle;
    /**
     * @param keys Sorted list of (unhashed) keys
     * @param values values, in corresponding order as the keys, and of equal length
     */
    constructor(keys: Buffer[], values: Buffer[]);
    commitment(): Buffer;
}
//# sourceMappingURL=merkleMap.d.ts.map