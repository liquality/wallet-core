"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getTrustedInputBIP143 = void 0;
var sha_js_1 = __importDefault(require("sha.js"));
var serializeTransaction_1 = require("./serializeTransaction");
function getTrustedInputBIP143(transport, indexLookup, transaction, additionals) {
    if (additionals === void 0) { additionals = []; }
    if (!transaction) {
        throw new Error("getTrustedInputBIP143: missing tx");
    }
    var isDecred = additionals.includes("decred");
    if (isDecred) {
        throw new Error("Decred does not implement BIP143");
    }
    var hash = (0, sha_js_1["default"])("sha256")
        .update((0, sha_js_1["default"])("sha256").update((0, serializeTransaction_1.serializeTransaction)(transaction, true)).digest())
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
exports.getTrustedInputBIP143 = getTrustedInputBIP143;
//# sourceMappingURL=getTrustedInputBIP143.js.map