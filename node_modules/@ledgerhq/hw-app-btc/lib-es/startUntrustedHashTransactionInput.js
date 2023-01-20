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
import { createVarint } from "./varint";
import { MAX_SCRIPT_BLOCK } from "./constants";
export function startUntrustedHashTransactionInputRaw(transport, newTransaction, firstRound, transactionData, bip143, overwinter, additionals) {
    if (bip143 === void 0) { bip143 = false; }
    if (overwinter === void 0) { overwinter = false; }
    if (additionals === void 0) { additionals = []; }
    var p2 = additionals.includes("cashaddr")
        ? 0x03
        : bip143
            ? additionals.includes("sapling")
                ? 0x05
                : overwinter
                    ? 0x04
                    : 0x02
            : 0x00;
    return transport.send(0xe0, 0x44, firstRound ? 0x00 : 0x80, newTransaction ? p2 : 0x80, transactionData);
}
export function startUntrustedHashTransactionInput(transport, newTransaction, transaction, inputs, bip143, overwinter, additionals, useTrustedInputForSegwit) {
    if (bip143 === void 0) { bip143 = false; }
    if (overwinter === void 0) { overwinter = false; }
    if (additionals === void 0) { additionals = []; }
    if (useTrustedInputForSegwit === void 0) { useTrustedInputForSegwit = false; }
    return __awaiter(this, void 0, void 0, function () {
        var data, i, isDecred, _a, _b, input, prefix, inputValue, scriptBlocks, offset, blockSize, scriptBlocks_1, scriptBlocks_1_1, scriptBlock, e_1_1, e_2_1;
        var e_2, _c, e_1, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    data = Buffer.concat([
                        transaction.version,
                        transaction.timestamp || Buffer.alloc(0),
                        transaction.nVersionGroupId || Buffer.alloc(0),
                        createVarint(transaction.inputs.length),
                    ]);
                    return [4 /*yield*/, startUntrustedHashTransactionInputRaw(transport, newTransaction, true, data, bip143, overwinter, additionals)];
                case 1:
                    _e.sent();
                    i = 0;
                    isDecred = additionals.includes("decred");
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 15, 16, 17]);
                    _a = __values(transaction.inputs), _b = _a.next();
                    _e.label = 3;
                case 3:
                    if (!!_b.done) return [3 /*break*/, 14];
                    input = _b.value;
                    prefix = void 0;
                    inputValue = inputs[i].value;
                    if (bip143) {
                        if (useTrustedInputForSegwit && inputs[i].trustedInput) {
                            prefix = Buffer.from([0x01, inputValue.length]);
                        }
                        else {
                            prefix = Buffer.from([0x02]);
                        }
                    }
                    else {
                        if (inputs[i].trustedInput) {
                            prefix = Buffer.from([0x01, inputs[i].value.length]);
                        }
                        else {
                            prefix = Buffer.from([0x00]);
                        }
                    }
                    data = Buffer.concat([
                        prefix,
                        inputValue,
                        isDecred ? Buffer.from([0x00]) : Buffer.alloc(0),
                        createVarint(input.script.length),
                    ]);
                    return [4 /*yield*/, startUntrustedHashTransactionInputRaw(transport, newTransaction, false, data, bip143, overwinter, additionals)];
                case 4:
                    _e.sent();
                    scriptBlocks = [];
                    offset = 0;
                    if (input.script.length === 0) {
                        scriptBlocks.push(input.sequence);
                    }
                    else {
                        while (offset !== input.script.length) {
                            blockSize = input.script.length - offset > MAX_SCRIPT_BLOCK
                                ? MAX_SCRIPT_BLOCK
                                : input.script.length - offset;
                            if (offset + blockSize !== input.script.length) {
                                scriptBlocks.push(input.script.slice(offset, offset + blockSize));
                            }
                            else {
                                scriptBlocks.push(Buffer.concat([
                                    input.script.slice(offset, offset + blockSize),
                                    input.sequence,
                                ]));
                            }
                            offset += blockSize;
                        }
                    }
                    _e.label = 5;
                case 5:
                    _e.trys.push([5, 10, 11, 12]);
                    scriptBlocks_1 = (e_1 = void 0, __values(scriptBlocks)), scriptBlocks_1_1 = scriptBlocks_1.next();
                    _e.label = 6;
                case 6:
                    if (!!scriptBlocks_1_1.done) return [3 /*break*/, 9];
                    scriptBlock = scriptBlocks_1_1.value;
                    return [4 /*yield*/, startUntrustedHashTransactionInputRaw(transport, newTransaction, false, scriptBlock, bip143, overwinter, additionals)];
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8:
                    scriptBlocks_1_1 = scriptBlocks_1.next();
                    return [3 /*break*/, 6];
                case 9: return [3 /*break*/, 12];
                case 10:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 11:
                    try {
                        if (scriptBlocks_1_1 && !scriptBlocks_1_1.done && (_d = scriptBlocks_1["return"])) _d.call(scriptBlocks_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 12:
                    i++;
                    _e.label = 13;
                case 13:
                    _b = _a.next();
                    return [3 /*break*/, 3];
                case 14: return [3 /*break*/, 17];
                case 15:
                    e_2_1 = _e.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 17];
                case 16:
                    try {
                        if (_b && !_b.done && (_c = _a["return"])) _c.call(_a);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=startUntrustedHashTransactionInput.js.map