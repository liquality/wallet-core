/// <reference types="node" />
import Transport from "@ledgerhq/hw-transport";
export declare function provideOutputFullChangePath(transport: Transport, path: string): Promise<Buffer>;
export declare function hashOutputFull(transport: Transport, outputScript: Buffer, additionals?: Array<string>): Promise<Buffer | void>;
//# sourceMappingURL=finalizeInput.d.ts.map