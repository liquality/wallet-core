var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import invariant from "invariant";
import { MAX_SCRIPT_BLOCK } from "./constants";
import { createVarint } from "./varint";
export function getTrustedInputRaw(transport, transactionData, indexLookup) {
    return __awaiter(this, void 0, void 0, function () {
        var data, firstRound, prefix, trustedInput, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    firstRound = false;
                    if (typeof indexLookup === "number") {
                        firstRound = true;
                        prefix = Buffer.alloc(4);
                        prefix.writeUInt32BE(indexLookup, 0);
                        data = Buffer.concat([prefix, transactionData], transactionData.length + 4);
                    }
                    else {
                        data = transactionData;
                    }
                    return [4 /*yield*/, transport.send(0xe0, 0x42, firstRound ? 0x00 : 0x80, 0x00, data)];
                case 1:
                    trustedInput = _a.sent();
                    res = trustedInput.slice(0, trustedInput.length - 2).toString("hex");
                    return [2 /*return*/, res];
            }
        });
    });
}
export function getTrustedInput(transport, indexLookup, transaction, additionals) {
    if (additionals === void 0) { additionals = []; }
    return __awaiter(this, void 0, void 0, function () {
        var version, inputs, outputs, locktime, nExpiryHeight, extraData, isDecred, isXST, processScriptBlocks, processWholeScriptBlock, inputs_1, inputs_1_1, input, isXSTV2, treeField, data, e_1_1, outputs_1, outputs_1_1, output, data, e_2_1, endData, extraPart, data, res;
        var e_1, _a, e_2, _b;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    version = transaction.version, inputs = transaction.inputs, outputs = transaction.outputs, locktime = transaction.locktime, nExpiryHeight = transaction.nExpiryHeight, extraData = transaction.extraData;
                    if (!outputs || !locktime) {
                        throw new Error("getTrustedInput: locktime & outputs is expected");
                    }
                    isDecred = additionals.includes("decred");
                    isXST = additionals.includes("stealthcoin");
                    processScriptBlocks = function (script, sequence) { return __awaiter(_this, void 0, void 0, function () {
                        var seq, scriptBlocks, offset, blockSize, res, scriptBlocks_1, scriptBlocks_1_1, scriptBlock, e_3_1;
                        var e_3, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    seq = sequence || Buffer.alloc(0);
                                    scriptBlocks = [];
                                    offset = 0;
                                    while (offset !== script.length) {
                                        blockSize = script.length - offset > MAX_SCRIPT_BLOCK
                                            ? MAX_SCRIPT_BLOCK
                                            : script.length - offset;
                                        if (offset + blockSize !== script.length) {
                                            scriptBlocks.push(script.slice(offset, offset + blockSize));
                                        }
                                        else {
                                            scriptBlocks.push(Buffer.concat([script.slice(offset, offset + blockSize), seq]));
                                        }
                                        offset += blockSize;
                                    }
                                    // Handle case when no script length: we still want to pass the sequence
                                    // relatable: https://github.com/LedgerHQ/ledger-live-desktop/issues/1386
                                    if (script.length === 0) {
                                        scriptBlocks.push(seq);
                                    }
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 6, 7, 8]);
                                    scriptBlocks_1 = __values(scriptBlocks), scriptBlocks_1_1 = scriptBlocks_1.next();
                                    _b.label = 2;
                                case 2:
                                    if (!!scriptBlocks_1_1.done) return [3 /*break*/, 5];
                                    scriptBlock = scriptBlocks_1_1.value;
                                    return [4 /*yield*/, getTrustedInputRaw(transport, scriptBlock)];
                                case 3:
                                    res = _b.sent();
                                    _b.label = 4;
                                case 4:
                                    scriptBlocks_1_1 = scriptBlocks_1.next();
                                    return [3 /*break*/, 2];
                                case 5: return [3 /*break*/, 8];
                                case 6:
                                    e_3_1 = _b.sent();
                                    e_3 = { error: e_3_1 };
                                    return [3 /*break*/, 8];
                                case 7:
                                    try {
                                        if (scriptBlocks_1_1 && !scriptBlocks_1_1.done && (_a = scriptBlocks_1["return"])) _a.call(scriptBlocks_1);
                                    }
                                    finally { if (e_3) throw e_3.error; }
                                    return [7 /*endfinally*/];
                                case 8: return [2 /*return*/, res];
                            }
                        });
                    }); };
                    processWholeScriptBlock = function (block) {
                        return getTrustedInputRaw(transport, block);
                    };
                    return [4 /*yield*/, getTrustedInputRaw(transport, Buffer.concat([
                            transaction.version,
                            transaction.timestamp || Buffer.alloc(0),
                            transaction.nVersionGroupId || Buffer.alloc(0),
                            createVarint(inputs.length),
                        ]), indexLookup)];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 8, 9, 10]);
                    inputs_1 = __values(inputs), inputs_1_1 = inputs_1.next();
                    _c.label = 3;
                case 3:
                    if (!!inputs_1_1.done) return [3 /*break*/, 7];
                    input = inputs_1_1.value;
                    isXSTV2 = isXST &&
                        Buffer.compare(version, Buffer.from([0x02, 0x00, 0x00, 0x00])) === 0;
                    treeField = isDecred
                        ? input.tree || Buffer.from([0x00])
                        : Buffer.alloc(0);
                    data = Buffer.concat([
                        input.prevout,
                        treeField,
                        isXSTV2 ? Buffer.from([0x00]) : createVarint(input.script.length),
                    ]);
                    return [4 /*yield*/, getTrustedInputRaw(transport, data)];
                case 4:
                    _c.sent();
                    // iteration (eachSeries) ended
                    // TODO notify progress
                    // deferred.notify("input");
                    // Reference: https://github.com/StealthSend/Stealth/commit/5be35d6c2c500b32ed82e5d6913d66d18a4b0a7f#diff-e8db9b851adc2422aadfffca88f14c91R566
                    return [4 /*yield*/, (isDecred
                            ? processWholeScriptBlock(Buffer.concat([input.script, input.sequence]))
                            : isXSTV2
                                ? processWholeScriptBlock(input.sequence)
                                : processScriptBlocks(input.script, input.sequence))];
                case 5:
                    // iteration (eachSeries) ended
                    // TODO notify progress
                    // deferred.notify("input");
                    // Reference: https://github.com/StealthSend/Stealth/commit/5be35d6c2c500b32ed82e5d6913d66d18a4b0a7f#diff-e8db9b851adc2422aadfffca88f14c91R566
                    _c.sent();
                    _c.label = 6;
                case 6:
                    inputs_1_1 = inputs_1.next();
                    return [3 /*break*/, 3];
                case 7: return [3 /*break*/, 10];
                case 8:
                    e_1_1 = _c.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 10];
                case 9:
                    try {
                        if (inputs_1_1 && !inputs_1_1.done && (_a = inputs_1["return"])) _a.call(inputs_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 10: return [4 /*yield*/, getTrustedInputRaw(transport, createVarint(outputs.length))];
                case 11:
                    _c.sent();
                    _c.label = 12;
                case 12:
                    _c.trys.push([12, 17, 18, 19]);
                    outputs_1 = __values(outputs), outputs_1_1 = outputs_1.next();
                    _c.label = 13;
                case 13:
                    if (!!outputs_1_1.done) return [3 /*break*/, 16];
                    output = outputs_1_1.value;
                    data = Buffer.concat([
                        output.amount,
                        isDecred ? Buffer.from([0x00, 0x00]) : Buffer.alloc(0),
                        createVarint(output.script.length),
                        output.script,
                    ]);
                    return [4 /*yield*/, getTrustedInputRaw(transport, data)];
                case 14:
                    _c.sent();
                    _c.label = 15;
                case 15:
                    outputs_1_1 = outputs_1.next();
                    return [3 /*break*/, 13];
                case 16: return [3 /*break*/, 19];
                case 17:
                    e_2_1 = _c.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 19];
                case 18:
                    try {
                        if (outputs_1_1 && !outputs_1_1.done && (_b = outputs_1["return"])) _b.call(outputs_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 19:
                    endData = [];
                    if (nExpiryHeight && nExpiryHeight.length > 0) {
                        endData.push(nExpiryHeight);
                    }
                    if (extraData && extraData.length > 0) {
                        endData.push(extraData);
                    }
                    if (endData.length) {
                        data = Buffer.concat(endData);
                        extraPart = isDecred
                            ? data
                            : Buffer.concat([createVarint(data.length), data]);
                    }
                    return [4 /*yield*/, processScriptBlocks(Buffer.concat([locktime, extraPart || Buffer.alloc(0)]))];
                case 20:
                    res = _c.sent();
                    invariant(res, "missing result in processScriptBlocks");
                    return [2 /*return*/, res];
            }
        });
    });
}
//# sourceMappingURL=getTrustedInput.js.map