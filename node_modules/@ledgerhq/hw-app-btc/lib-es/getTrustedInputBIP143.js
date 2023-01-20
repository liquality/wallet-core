import shajs from "sha.js";
import { serializeTransaction } from "./serializeTransaction";
export function getTrustedInputBIP143(transport, indexLookup, transaction, additionals) {
    if (additionals === void 0) { additionals = []; }
    if (!transaction) {
        throw new Error("getTrustedInputBIP143: missing tx");
    }
    var isDecred = additionals.includes("decred");
    if (isDecred) {
        throw new Error("Decred does not implement BIP143");
    }
    var hash = shajs("sha256")
        .update(shajs("sha256").update(serializeTransaction(transaction, true)).digest())
        .digest();
    var data = Buffer.alloc(4);
    data.writeUInt32LE(indexLookup, 0);
    var outputs = transaction.outputs, locktime = transaction.locktime;
    if (!outputs || !locktime) {
        throw new Error("getTrustedInputBIP143: locktime & outputs is expected");
    }
    if (!outputs[indexLookup]) {
        throw new Error("getTrustedInputBIP143: wrong index");
    }
    hash = Buffer.concat([hash, data, outputs[indexLookup].amount]);
    return hash.toString("hex");
}
//# sourceMappingURL=getTrustedInputBIP143.js.map