/// <reference types="node" />
import type Transport from "@ledgerhq/hw-transport";
import type { Transaction } from "./types";
export declare function startUntrustedHashTransactionInputRaw(transport: Transport, newTransaction: boolean, firstRound: boolean, transactionData: Buffer, bip143?: boolean, overwinter?: boolean, additionals?: Array<string>): Promise<Buffer>;
export declare function startUntrustedHashTransactionInput(transport: Transport, newTransaction: boolean, transaction: Transaction, inputs: Array<{
    trustedInput: boolean;
    value: Buffer;
}>, bip143?: boolean, overwinter?: boolean, additionals?: Array<string>, useTrustedInputForSegwit?: boolean): Promise<any>;
//# sourceMappingURL=startUntrustedHashTransactionInput.d.ts.map