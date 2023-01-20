"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.__esModule = true;
exports.MerkelizedPsbt = void 0;
var merkleMap_1 = require("./merkleMap");
var psbtv2_1 = require("./psbtv2");
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
var MerkelizedPsbt = /** @class */ (function (_super) {
    __extends(MerkelizedPsbt, _super);
    function MerkelizedPsbt(psbt) {
        var _this = _super.call(this) || this;
        _this.inputMerkleMaps = [];
        _this.outputMerkleMaps = [];
        psbt.copy(_this);
        _this.globalMerkleMap = MerkelizedPsbt.createMerkleMap(_this.globalMap);
        for (var i = 0; i < _this.getGlobalInputCount(); i++) {
            _this.inputMerkleMaps.push(MerkelizedPsbt.createMerkleMap(_this.inputMaps[i]));
        }
        _this.inputMapCommitments = __spreadArray([], __read(_this.inputMerkleMaps.values()), false).map(function (v) {
            return v.commitment();
        });
        for (var i = 0; i < _this.getGlobalOutputCount(); i++) {
            _this.outputMerkleMaps.push(MerkelizedPsbt.createMerkleMap(_this.outputMaps[i]));
        }
        _this.outputMapCommitments = __spreadArray([], __read(_this.outputMerkleMaps.values()), false).map(function (v) {
            return v.commitment();
        });
        return _this;
    }
    // These public functions are for MerkelizedPsbt.
    MerkelizedPsbt.prototype.getGlobalSize = function () {
        return this.globalMap.size;
    };
    MerkelizedPsbt.prototype.getGlobalKeysValuesRoot = function () {
        return this.globalMerkleMap.commitment();
    };
    MerkelizedPsbt.createMerkleMap = function (map) {
        var sortedKeysStrings = __spreadArray([], __read(map.keys()), false).sort();
        var values = sortedKeysStrings.map(function (k) {
            var v = map.get(k);
            if (!v) {
                throw new Error("No value for key " + k);
            }
            return v;
        });
        var sortedKeys = sortedKeysStrings.map(function (k) { return Buffer.from(k, "hex"); });
        var merkleMap = new merkleMap_1.MerkleMap(sortedKeys, values);
        return merkleMap;
    };
    return MerkelizedPsbt;
}(psbtv2_1.PsbtV2));
exports.MerkelizedPsbt = MerkelizedPsbt;
//# sourceMappingURL=merkelizedPsbt.js.map