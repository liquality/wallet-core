import bippath from "bip32-path";
import bs58check from "bs58check";
export function pathElementsToBuffer(paths) {
    var buffer = Buffer.alloc(1 + paths.length * 4);
    buffer[0] = paths.length;
    paths.forEach(function (element, index) {
        buffer.writeUInt32BE(element, 1 + 4 * index);
    });
    return buffer;
}
export function bip32asBuffer(path) {
    var pathElements = !path ? [] : pathStringToArray(path);
    return pathElementsToBuffer(pathElements);
}
export function pathArrayToString(pathElements) {
    // Limitation: bippath can't handle and empty path. It shouldn't affect us
    // right now, but might in the future.
    // TODO: Fix support for empty path.
    return bippath.fromPathArray(pathElements).toString();
}
export function pathStringToArray(path) {
    return bippath.fromString(path).toPathArray();
}
export function pubkeyFromXpub(xpub) {
    var xpubBuf = bs58check.decode(xpub);
    return xpubBuf.slice(xpubBuf.length - 33);
}
export function getXpubComponents(xpub) {
    var xpubBuf = bs58check.decode(xpub);
    return {
        chaincode: xpubBuf.slice(13, 13 + 32),
        pubkey: xpubBuf.slice(xpubBuf.length - 33),
        version: xpubBuf.readUInt32BE(0)
    };
}
export function hardenedPathOf(pathElements) {
    for (var i = pathElements.length - 1; i >= 0; i--) {
        if (pathElements[i] >= 0x80000000) {
            return pathElements.slice(0, i + 1);
        }
    }
    return [];
}
//# sourceMappingURL=bip32.js.map