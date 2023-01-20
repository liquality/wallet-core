"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.__esModule = true;
exports.signP2SHTransaction = void 0;
var getTrustedInput_1 = require("./getTrustedInput");
var startUntrustedHashTransactionInput_1 = require("./startUntrustedHashTransactionInput");
var getTrustedInputBIP143_1 = require("./getTrustedInputBIP143");
var signTransaction_1 = require("./signTransaction");
var finalizeInput_1 = require("./finalizeInput");
var constants_1 = require("./constants");
var defaultArg = {
    lockTime: constants_1.DEFAULT_LOCKTIME,
    sigHashType: constants_1.SIGHASH_ALL,
    segwit: false,
    transactionVersion: constants_1.DEFAULT_VERSION
};
function signP2SHTransaction(transport, arg) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, inputs, associatedKeysets, outputScriptHex, lockTime, sigHashType, segwit, transactionVersion, nullScript, nullPrevout, defaultVersion, trustedInputs, regularOutputs, signatures, firstRun, resuming, targetTransaction, getTrustedInputCall, outputScript, inputs_1, inputs_1_1, input, trustedInput, sequence, outputs, index, e_1_1, i, sequence, i, input, script, pseudoTX, pseudoTrustedInputs, signature;
        var e_1, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = __assign(__assign({}, defaultArg), arg), inputs = _a.inputs, associatedKeysets = _a.associatedKeysets, outputScriptHex = _a.outputScriptHex, lockTime = _a.lockTime, sigHashType = _a.sigHashType, segwit = _a.segwit, transactionVersion = _a.transactionVersion;
                    nullScript = Buffer.alloc(0);
                    nullPrevout = Buffer.alloc(0);
                    defaultVersion = Buffer.alloc(4);
                    defaultVersion.writeUInt32LE(transactionVersion, 0);
                    trustedInputs = [];
                    regularOutputs = [];
                    signatures = [];
                    firstRun = true;
                    resuming = false;
                    targetTransaction = {
                        inputs: [],
                        version: defaultVersion
                    };
                    getTrustedInputCall = segwit ? getTrustedInputBIP143_1.getTrustedInputBIP143 : getTrustedInput_1.getTrustedInput;
                    outputScript = Buffer.from(outputScriptHex, "hex");
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, 8, 9]);
                    inputs_1 = __values(inputs), inputs_1_1 = inputs_1.next();
                    _c.label = 2;
                case 2:
                    if (!!inputs_1_1.done) return [3 /*break*/, 6];
                    input = inputs_1_1.value;
                    if (!!resuming) return [3 /*break*/, 4];
                    return [4 /*yield*/, getTrustedInputCall(transport, input[1], input[0])];
                case 3:
                    trustedInput = _c.sent();
                    sequence = Buffer.alloc(4);
                    sequence.writeUInt32LE(input.length >= 4 && typeof input[3] === "number"
                        ? input[3]
                        : constants_1.DEFAULT_SEQUENCE, 0);
                    trustedInputs.push({
                        trustedInput: false,
                        value: segwit
                            ? Buffer.from(trustedInput, "hex")
                            : Buffer.from(trustedInput, "hex").slice(4, 4 + 0x24),
                        sequence: sequence
                    });
                    _c.label = 4;
                case 4:
                    outputs = input[0].outputs;
                    index = input[1];
                    if (outputs && index <= outputs.length - 1) {
                        regularOutputs.push(outputs[index]);
                    }
                    _c.label = 5;
                case 5:
                    inputs_1_1 = inputs_1.next();
                    return [3 /*break*/, 2];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_1_1 = _c.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        if (inputs_1_1 && !inputs_1_1.done && (_b = inputs_1["return"])) _b.call(inputs_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 9:
                    // Pre-build the target transaction
                    for (i = 0; i < inputs.length; i++) {
                        sequence = Buffer.alloc(4);
                        sequence.writeUInt32LE(inputs[i].length >= 4 && typeof inputs[i][3] === "number"
                            ? inputs[i][3]
                            : constants_1.DEFAULT_SEQUENCE, 0);
                        targetTransaction.inputs.push({
                            script: nullScript,
                            prevout: nullPrevout,
                            sequence: sequence
                        });
                    }
                    if (!segwit) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, startUntrustedHashTransactionInput_1.startUntrustedHashTransactionInput)(transport, true, targetTransaction, trustedInputs, true)];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, (0, finalizeInput_1.hashOutputFull)(transport, outputScript)];
                case 11:
                    _c.sent();
                    _c.label = 12;
                case 12:
                    i = 0;
                    _c.label = 13;
                case 13:
                    if (!(i < inputs.length)) return [3 /*break*/, 19];
                    input = inputs[i];
                    script = inputs[i].length >= 3 && typeof input[2] === "string"
                        ? Buffer.from(input[2], "hex")
                        : regularOutputs[i].script;
                    pseudoTX = Object.assign({}, targetTransaction);
                    pseudoTrustedInputs = segwit ? [trustedInputs[i]] : trustedInputs;
                    if (segwit) {
                        pseudoTX.inputs = [__assign(__assign({}, pseudoTX.inputs[i]), { script: script })];
                    }
                    else {
                        pseudoTX.inputs[i].script = script;
                    }
                    return [4 /*yield*/, (0, startUntrustedHashTransactionInput_1.startUntrustedHashTransactionInput)(transport, !segwit && firstRun, pseudoTX, pseudoTrustedInputs, segwit)];
                case 14:
                    _c.sent();
                    if (!!segwit) return [3 /*break*/, 16];
                    return [4 /*yield*/, (0, finalizeInput_1.hashOutputFull)(transport, outputScript)];
                case 15:
                    _c.sent();
                    _c.label = 16;
                case 16: return [4 /*yield*/, (0, signTransaction_1.signTransaction)(transport, associatedKeysets[i], lockTime, sigHashType)];
                case 17:
                    signature = _c.sent();
                    signatures.push(segwit
                        ? signature.toString("hex")
                        : signature.slice(0, signature.length - 1).toString("hex"));
                    targetTransaction.inputs[i].script = nullScript;
                    if (firstRun) {
                        firstRun = false;
                    }
                    _c.label = 18;
                case 18:
                    i++;
                    return [3 /*break*/, 13];
                case 19: return [2 /*return*/, signatures];
            }
        });
    });
}
exports.signP2SHTransaction = signP2SHTransaction;
//# sourceMappingURL=signP2SHTransaction.js.map