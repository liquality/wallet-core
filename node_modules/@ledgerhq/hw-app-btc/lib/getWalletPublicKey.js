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
exports.__esModule = true;
exports.getWalletPublicKey = void 0;
var bip32_1 = require("./bip32");
var addressFormatMap = {
    legacy: 0,
    p2sh: 1,
    bech32: 2,
    cashaddr: 3
};
function getWalletPublicKey(transport, options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, path, verify, format, buffer, p1, p2, response, publicKeyLength, addressLength, publicKey, bitcoinAddress, chainCode;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = __assign({ verify: false, format: "legacy" }, options), path = _a.path, verify = _a.verify, format = _a.format;
                    if (!(format in addressFormatMap)) {
                        throw new Error("btc.getWalletPublicKey invalid format=" + format);
                    }
                    buffer = (0, bip32_1.bip32asBuffer)(path);
                    p1 = verify ? 1 : 0;
                    p2 = addressFormatMap[format];
                    return [4 /*yield*/, transport.send(0xe0, 0x40, p1, p2, buffer)];
                case 1:
                    response = _b.sent();
                    publicKeyLength = response[0];
                    addressLength = response[1 + publicKeyLength];
                    publicKey = response.slice(1, 1 + publicKeyLength).toString("hex");
                    bitcoinAddress = response
                        .slice(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength)
                        .toString("ascii");
                    chainCode = response
                        .slice(1 + publicKeyLength + 1 + addressLength, 1 + publicKeyLength + 1 + addressLength + 32)
                        .toString("hex");
                    return [2 /*return*/, {
                            publicKey: publicKey,
                            bitcoinAddress: bitcoinAddress,
                            chainCode: chainCode
                        }];
            }
        });
    });
}
exports.getWalletPublicKey = getWalletPublicKey;
//# sourceMappingURL=getWalletPublicKey.js.map