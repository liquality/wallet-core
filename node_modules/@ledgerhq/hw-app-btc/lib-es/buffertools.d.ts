/// <reference types="node" />
export declare function unsafeTo64bitLE(n: number): Buffer;
export declare function unsafeFrom64bitLE(byteArray: Buffer): number;
export declare class BufferWriter {
    private bufs;
    write(alloc: number, fn: (b: Buffer) => void): void;
    writeUInt8(i: number): void;
    writeInt32(i: number): void;
    writeUInt32(i: number): void;
    writeUInt64(i: number): void;
    writeVarInt(i: number): void;
    writeSlice(slice: Buffer): void;
    writeVarSlice(slice: Buffer): void;
    buffer(): Buffer;
}
export declare class BufferReader {
    buffer: Buffer;
    offset: number;
    constructor(buffer: Buffer, offset?: number);
    available(): number;
    readUInt8(): number;
    readInt32(): number;
    readUInt32(): number;
    readUInt64(): number;
    readVarInt(): number;
    readSlice(n: number): Buffer;
    readVarSlice(): Buffer;
    readVector(): Buffer[];
}
//# sourceMappingURL=buffertools.d.ts.map