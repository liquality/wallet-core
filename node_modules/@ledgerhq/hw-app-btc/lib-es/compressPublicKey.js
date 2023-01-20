export function compressPublicKey(publicKey) {
    var prefix = (publicKey[64] & 1) !== 0 ? 0x03 : 0x02;
    var prefixBuffer = Buffer.alloc(1);
    prefixBuffer[0] = prefix;
    return Buffer.concat([prefixBuffer, publicKey.slice(1, 1 + 32)]);
}
//# sourceMappingURL=compressPublicKey.js.map