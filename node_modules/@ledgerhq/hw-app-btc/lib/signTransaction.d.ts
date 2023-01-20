/// <reference types="node" />
import type Transport from "@ledgerhq/hw-transport";
export declare function signTransaction(transport: Transport, path: string, lockTime: number, sigHashType: number, expiryHeight?: Buffer, additionals?: Array<string>): Promise<Buffer>;
//# sourceMappingURL=signTransaction.d.ts.map