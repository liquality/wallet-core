/// <reference types="node" />
/**
 * This class implements the merkle tree used by Ledger Bitcoin app v2+,
 * which is documented at
 * https://github.com/LedgerHQ/app-bitcoin-new/blob/master/doc/merkle.md
 */
export declare class Merkle {
    private leaves;
    private rootNode;
    private leafNodes;
    private h;
    constructor(leaves: Buffer[], hasher?: (buf: Buffer) => Buffer);
    getRoot(): Buffer;
    size(): number;
    getLeaves(): Buffer[];
    getLeafHash(index: number): Buffer;
    getProof(index: number): Buffer[];
    calculateRoot(leaves: Buffer[]): {
        root: Node;
        leaves: Node[];
    };
    hashNode(left: Buffer, right: Buffer): Buffer;
}
export declare function hashLeaf(buf: Buffer, hashFunction?: (buf: Buffer) => Buffer): Buffer;
declare class Node {
    leftChild?: Node;
    rightChild?: Node;
    parent?: Node;
    hash: Buffer;
    constructor(left: Node | undefined, right: Node | undefined, hash: Buffer);
    isLeaf(): boolean;
}
export {};
//# sourceMappingURL=merkle.d.ts.map