"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.hashPublicKey = void 0;
var ripemd160_1 = __importDefault(require("ripemd160"));
var sha_js_1 = __importDefault(require("sha.js"));
function hashPublicKey(buffer) {
    return new ripemd160_1["default"]().update((0, sha_js_1["default"])("sha256").update(buffer).digest()).digest();
}
exports.hashPublicKey = hashPublicKey;
//# sourceMappingURL=hashPublicKey.js.map