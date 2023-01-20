import type Transport from "@ledgerhq/hw-transport";
import type { Transaction } from "./types";
/**
 *
 */
export declare type SignP2SHTransactionArg = {
    inputs: Array<[
        Transaction,
        number,
        string | null | undefined,
        number | null | undefined
    ]>;
    associatedKeysets: string[];
    outputScriptHex: string;
    lockTime?: number;
    sigHashType?: number;
    segwit?: boolean;
    transactionVersion?: number;
};
export declare function signP2SHTransaction(transport: Transport, arg: SignP2SHTransactionArg): Promise<string[]>;
//# sourceMappingURL=signP2SHTransaction.d.ts.map