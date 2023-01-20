import { bip32asBuffer } from "./bip32";
export function signTransaction(transport, path, lockTime, sigHashType, expiryHeight, additionals) {
    if (additionals === void 0) { additionals = []; }
    var isDecred = additionals.includes("decred");
    var pathsBuffer = bip32asBuffer(path);
    var lockTimeBuffer = Buffer.alloc(4);
    lockTimeBuffer.writeUInt32BE(lockTime, 0);
    var buffer = isDecred
        ? Buffer.concat([
            pathsBuffer,
            lockTimeBuffer,
            expiryHeight || Buffer.from([0x00, 0x00, 0x00, 0x00]),
            Buffer.from([sigHashType]),
        ])
        : Buffer.concat([
            pathsBuffer,
            Buffer.from([0x00]),
            lockTimeBuffer,
            Buffer.from([sigHashType]),
        ]);
    if (expiryHeight && !isDecred) {
        buffer = Buffer.concat([buffer, expiryHeight]);
    }
    return transport.send(0xe0, 0x48, 0x00, 0x00, buffer).then(function (result) {
        if (result.length > 0) {
            result[0] = 0x30;
            return result.slice(0, result.length - 2);
        }
        return result;
    });
}
//# sourceMappingURL=signTransaction.js.map