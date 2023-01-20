import varuint from "varuint-bitcoin";
export function unsafeTo64bitLE(n) {
    // we want to represent the input as a 8-bytes array
    if (n > Number.MAX_SAFE_INTEGER) {
        throw new Error("Can't convert numbers > MAX_SAFE_INT");
    }
    var byteArray = Buffer.alloc(8, 0);
    for (var index = 0; index < byteArray.length; index++) {
        var byte = n & 0xff;
        byteArray[index] = byte;
        n = (n - byte) / 256;
    }
    return byteArray;
}
export function unsafeFrom64bitLE(byteArray) {
    var value = 0;
    if (byteArray.length != 8) {
        throw new Error("Expected Bufffer of lenght 8");
    }
    if (byteArray[7] != 0) {
        throw new Error("Can't encode numbers > MAX_SAFE_INT");
    }
    if (byteArray[6] > 0x1f) {
        throw new Error("Can't encode numbers > MAX_SAFE_INT");
    }
    for (var i = byteArray.length - 1; i >= 0; i--) {
        value = value * 256 + byteArray[i];
    }
    return value;
}
var BufferWriter = /** @class */ (function () {
    function BufferWriter() {
        this.bufs = [];
    }
    BufferWriter.prototype.write = function (alloc, fn) {
        var b = Buffer.alloc(alloc);
        fn(b);
        this.bufs.push(b);
    };
    BufferWriter.prototype.writeUInt8 = function (i) {
        this.write(1, function (b) { return b.writeUInt8(i, 0); });
    };
    BufferWriter.prototype.writeInt32 = function (i) {
        this.write(4, function (b) { return b.writeInt32LE(i, 0); });
    };
    BufferWriter.prototype.writeUInt32 = function (i) {
        this.write(4, function (b) { return b.writeUInt32LE(i, 0); });
    };
    BufferWriter.prototype.writeUInt64 = function (i) {
        var bytes = unsafeTo64bitLE(i);
        this.writeSlice(bytes);
    };
    BufferWriter.prototype.writeVarInt = function (i) {
        this.bufs.push(varuint.encode(i));
    };
    BufferWriter.prototype.writeSlice = function (slice) {
        this.bufs.push(Buffer.from(slice));
    };
    BufferWriter.prototype.writeVarSlice = function (slice) {
        this.writeVarInt(slice.length);
        this.writeSlice(slice);
    };
    BufferWriter.prototype.buffer = function () {
        return Buffer.concat(this.bufs);
    };
    return BufferWriter;
}());
export { BufferWriter };
var BufferReader = /** @class */ (function () {
    function BufferReader(buffer, offset) {
        if (offset === void 0) { offset = 0; }
        this.buffer = buffer;
        this.offset = offset;
    }
    BufferReader.prototype.available = function () {
        return this.buffer.length - this.offset;
    };
    BufferReader.prototype.readUInt8 = function () {
        var result = this.buffer.readUInt8(this.offset);
        this.offset++;
        return result;
    };
    BufferReader.prototype.readInt32 = function () {
        var result = this.buffer.readInt32LE(this.offset);
        this.offset += 4;
        return result;
    };
    BufferReader.prototype.readUInt32 = function () {
        var result = this.buffer.readUInt32LE(this.offset);
        this.offset += 4;
        return result;
    };
    BufferReader.prototype.readUInt64 = function () {
        var buf = this.readSlice(8);
        var n = unsafeFrom64bitLE(buf);
        return n;
    };
    BufferReader.prototype.readVarInt = function () {
        var vi = varuint.decode(this.buffer, this.offset);
        this.offset += varuint.decode.bytes;
        return vi;
    };
    BufferReader.prototype.readSlice = function (n) {
        if (this.buffer.length < this.offset + n) {
            throw new Error("Cannot read slice out of bounds");
        }
        var result = this.buffer.slice(this.offset, this.offset + n);
        this.offset += n;
        return result;
    };
    BufferReader.prototype.readVarSlice = function () {
        return this.readSlice(this.readVarInt());
    };
    BufferReader.prototype.readVector = function () {
        var count = this.readVarInt();
        var vector = [];
        for (var i = 0; i < count; i++)
            vector.push(this.readVarSlice());
        return vector;
    };
    return BufferReader;
}());
export { BufferReader };
//# sourceMappingURL=buffertools.js.map