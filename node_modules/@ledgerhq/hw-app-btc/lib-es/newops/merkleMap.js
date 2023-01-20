import { createVarint } from "../varint";
import { hashLeaf, Merkle } from "./merkle";
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
var MerkleMap = /** @class */ (function () {
    /**
     * @param keys Sorted list of (unhashed) keys
     * @param values values, in corresponding order as the keys, and of equal length
     */
    function MerkleMap(keys, values) {
        if (keys.length != values.length) {
            throw new Error("keys and values should have the same length");
        }
        // Sanity check: verify that keys are actually sorted and with no duplicates
        for (var i = 0; i < keys.length - 1; i++) {
            if (keys[i].toString("hex") >= keys[i + 1].toString("hex")) {
                throw new Error("keys must be in strictly increasing order");
            }
        }
        this.keys = keys;
        this.keysTree = new Merkle(keys.map(function (k) { return hashLeaf(k); }));
        this.values = values;
        this.valuesTree = new Merkle(values.map(function (v) { return hashLeaf(v); }));
    }
    MerkleMap.prototype.commitment = function () {
        // returns a buffer between 65 and 73 (included) bytes long
        return Buffer.concat([
            createVarint(this.keys.length),
            this.keysTree.getRoot(),
            this.valuesTree.getRoot(),
        ]);
    };
    return MerkleMap;
}());
export { MerkleMap };
//# sourceMappingURL=merkleMap.js.map