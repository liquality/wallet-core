"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.signMessage = void 0;
var bip32_path_1 = __importDefault(require("bip32-path"));
var constants_1 = require("./constants");
function signMessage(transport, _a) {
    var path = _a.path, messageHex = _a.messageHex;
    return __awaiter(this, void 0, void 0, function () {
        var paths, message, offset, _loop_1, res, v, r, s;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    paths = bip32_path_1["default"].fromString(path).toPathArray();
                    message = Buffer.from(messageHex, "hex");
                    offset = 0;
                    _loop_1 = function () {
                        var maxChunkSize, chunkSize, buffer;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    maxChunkSize = offset === 0
                                        ? constants_1.MAX_SCRIPT_BLOCK - 1 - paths.length * 4 - 4
                                        : constants_1.MAX_SCRIPT_BLOCK;
                                    chunkSize = offset + maxChunkSize > message.length
                                        ? message.length - offset
                                        : maxChunkSize;
                                    buffer = Buffer.alloc(offset === 0 ? 1 + paths.length * 4 + 2 + chunkSize : chunkSize);
                                    if (offset === 0) {
                                        buffer[0] = paths.length;
                                        paths.forEach(function (element, index) {
                                            buffer.writeUInt32BE(element, 1 + 4 * index);
                                        });
                                        buffer.writeUInt16BE(message.length, 1 + 4 * paths.length);
                                        message.copy(buffer, 1 + 4 * paths.length + 2, offset, offset + chunkSize);
                                    }
                                    else {
                                        message.copy(buffer, 0, offset, offset + chunkSize);
                                    }
                                    return [4 /*yield*/, transport.send(0xe0, 0x4e, 0x00, offset === 0 ? 0x01 : 0x80, buffer)];
                                case 1:
                                    _c.sent();
                                    offset += chunkSize;
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    if (!(offset !== message.length)) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 1];
                case 3: return [4 /*yield*/, transport.send(0xe0, 0x4e, 0x80, 0x00, Buffer.from([0x00]))];
                case 4:
                    res = _b.sent();
                    v = res[0] - 0x30;
                    r = res.slice(4, 4 + res[3]);
                    if (r[0] === 0) {
                        r = r.slice(1);
                    }
                    r = r.toString("hex");
                    offset = 4 + res[3] + 2;
                    s = res.slice(offset, offset + res[offset - 1]);
                    if (s[0] === 0) {
                        s = s.slice(1);
                    }
                    s = s.toString("hex");
                    return [2 /*return*/, {
                            v: v,
                            r: r,
                            s: s
                        }];
            }
        });
    });
}
exports.signMessage = signMessage;
//# sourceMappingURL=signMessage.js.map