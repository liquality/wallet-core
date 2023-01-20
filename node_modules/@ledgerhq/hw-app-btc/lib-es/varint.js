export function getVarint(data, offset) {
    if (data[offset] < 0xfd) {
        return [data[offset], 1];
    }
    if (data[offset] === 0xfd) {
        return [(data[offset + 2] << 8) + data[offset + 1], 3];
    }
    if (data[offset] === 0xfe) {
        return [
            (data[offset + 4] << 24) +
                (data[offset + 3] << 16) +
                (data[offset + 2] << 8) +
                data[offset + 1],
            5,
        ];
    }
    throw new Error("getVarint called with unexpected parameters");
}
export function createVarint(value) {
    if (value < 0xfd) {
        var buffer_1 = Buffer.alloc(1);
        buffer_1[0] = value;
        return buffer_1;
    }
    if (value <= 0xffff) {
        var buffer_2 = Buffer.alloc(3);
        buffer_2[0] = 0xfd;
        buffer_2[1] = value & 0xff;
        buffer_2[2] = (value >> 8) & 0xff;
        return buffer_2;
    }
    var buffer = Buffer.alloc(5);
    buffer[0] = 0xfe;
    buffer[1] = value & 0xff;
    buffer[2] = (value >> 8) & 0xff;
    buffer[3] = (value >> 16) & 0xff;
    buffer[4] = (value >> 24) & 0xff;
    return buffer;
}
//# sourceMappingURL=varint.js.map