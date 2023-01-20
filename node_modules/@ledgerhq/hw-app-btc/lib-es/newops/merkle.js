var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { crypto } from "bitcoinjs-lib";
/**
 * This class implements the merkle tree used by Ledger Bitcoin app v2+,
 * which is documented at
 * https://github.com/LedgerHQ/app-bitcoin-new/blob/master/doc/merkle.md
 */
var Merkle = /** @class */ (function () {
    function Merkle(leaves, hasher) {
        if (hasher === void 0) { hasher = crypto.sha256; }
        this.leaves = leaves;
        this.h = hasher;
        var nodes = this.calculateRoot(leaves);
        this.rootNode = nodes.root;
        this.leafNodes = nodes.leaves;
    }
    Merkle.prototype.getRoot = function () {
        return this.rootNode.hash;
    };
    Merkle.prototype.size = function () {
        return this.leaves.length;
    };
    Merkle.prototype.getLeaves = function () {
        return this.leaves;
    };
    Merkle.prototype.getLeafHash = function (index) {
        return this.leafNodes[index].hash;
    };
    Merkle.prototype.getProof = function (index) {
        if (index >= this.leaves.length)
            throw Error("Index out of bounds");
        return proveNode(this.leafNodes[index]);
    };
    Merkle.prototype.calculateRoot = function (leaves) {
        var n = leaves.length;
        if (n == 0) {
            return {
                root: new Node(undefined, undefined, Buffer.alloc(32, 0)),
                leaves: []
            };
        }
        if (n == 1) {
            var newNode = new Node(undefined, undefined, leaves[0]);
            return { root: newNode, leaves: [newNode] };
        }
        var leftCount = highestPowerOf2LessThan(n);
        var leftBranch = this.calculateRoot(leaves.slice(0, leftCount));
        var rightBranch = this.calculateRoot(leaves.slice(leftCount));
        var leftChild = leftBranch.root;
        var rightChild = rightBranch.root;
        var hash = this.hashNode(leftChild.hash, rightChild.hash);
        var node = new Node(leftChild, rightChild, hash);
        leftChild.parent = node;
        rightChild.parent = node;
        return { root: node, leaves: leftBranch.leaves.concat(rightBranch.leaves) };
    };
    Merkle.prototype.hashNode = function (left, right) {
        return this.h(Buffer.concat([Buffer.from([1]), left, right]));
    };
    return Merkle;
}());
export { Merkle };
export function hashLeaf(buf, hashFunction) {
    if (hashFunction === void 0) { hashFunction = crypto.sha256; }
    return hashConcat(Buffer.from([0]), buf, hashFunction);
}
function hashConcat(bufA, bufB, hashFunction) {
    return hashFunction(Buffer.concat([bufA, bufB]));
}
var Node = /** @class */ (function () {
    function Node(left, right, hash) {
        this.leftChild = left;
        this.rightChild = right;
        this.hash = hash;
    }
    Node.prototype.isLeaf = function () {
        return this.leftChild == undefined;
    };
    return Node;
}());
function proveNode(node) {
    if (!node.parent) {
        return [];
    }
    if (node.parent.leftChild == node) {
        if (!node.parent.rightChild) {
            throw new Error("Expected right child to exist");
        }
        return __spreadArray([node.parent.rightChild.hash], __read(proveNode(node.parent)), false);
    }
    else {
        if (!node.parent.leftChild) {
            throw new Error("Expected left child to exist");
        }
        return __spreadArray([node.parent.leftChild.hash], __read(proveNode(node.parent)), false);
    }
}
function highestPowerOf2LessThan(n) {
    if (n < 2) {
        throw Error("Expected n >= 2");
    }
    if (isPowerOf2(n)) {
        return n / 2;
    }
    return 1 << Math.floor(Math.log2(n));
}
function isPowerOf2(n) {
    return (n & (n - 1)) == 0;
}
//# sourceMappingURL=merkle.js.map