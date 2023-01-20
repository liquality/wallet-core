"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.hardenedPathOf = exports.getXpubComponents = exports.pubkeyFromXpub = exports.pathStringToArray = exports.pathArrayToString = exports.bip32asBuffer = exports.pathElementsToBuffer = void 0;
var bip32_path_1 = __importDefault(require("bip32-path"));
var bs58check_1 = __importDefault(require("bs58check"));
function pathElementsToBuffer(paths) {
    var buffer = Buffer.alloc(1 + paths.length * 4);
    buffer[0] = paths.length;
    paths.forEach(function (element, index) {
        buffer.writeUInt32BE(element, 1 + 4 * index);
    });
    return buffer;
}
exports.pathElementsToBuffer = pathElementsToBuffer;
function bip32asBuffer(path) {
    var pathElements = !path ? [] : pathStringToArray(path);
    return pathElementsToBuffer(pathElements);
}
exports.bip32asBuffer = bip32asBuffer;
function pathArrayToString(pathElements) {
    // Limitation: bippath can't handle and empty path. It shouldn't affect us
    // right now, but might in the future.
    // TODO: Fix support for empty path.
    return bip32_path_1["default"].fromPathArray(pathElements).toString();
}
exports.pathArrayToString = pathArrayToString;
function pathStringToArray(path) {
    return bip32_path_1["default"].fromString(path).toPathArray();
}
exports.pathStringToArray = pathStringToArray;
function pubkeyFromXpub(xpub) {
    var xpubBuf = bs58check_1["default"].decode(xpub);
    return xpubBuf.slice(xpubBuf.length - 33);
}
exports.pubkeyFromXpub = pubkeyFromXpub;
function getXpubComponents(xpub) {
    var xpubBuf = bs58check_1["default"].decode(xpub);
    return {
        chaincode: xpubBuf.slice(13, 13 + 32),
        pubkey: xpubBuf.slice(xpubBuf.length - 33),
        version: xpubBuf.readUInt32BE(0)
    };
}
exports.getXpubComponents = getXpubComponents;
function hardenedPathOf(pathElements) {
    for (var i = pathElements.length - 1; i >= 0; i--) {
        if (pathElements[i] >= 0x80000000) {
            return pathElements.slice(0, i + 1);
        }
    }
    return [];
}
exports.hardenedPathOf = hardenedPathOf;
//# sourceMappingURL=bip32.js.map