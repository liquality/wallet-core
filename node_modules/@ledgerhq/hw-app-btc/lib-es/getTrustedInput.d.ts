/// <reference types="node" />
import type Transport from "@ledgerhq/hw-transport";
import type { Transaction } from "./types";
export declare function getTrustedInputRaw(transport: Transport, transactionData: Buffer, indexLookup?: number | null | undefined): Promise<string>;
export declare function getTrustedInput(transport: Transport, indexLookup: number, transaction: Transaction, additionals?: Array<string>): Promise<string>;
//# sourceMappingURL=getTrustedInput.d.ts.map