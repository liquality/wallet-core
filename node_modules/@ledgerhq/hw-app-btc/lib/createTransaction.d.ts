/// <reference types="node" />
import type Transport from "@ledgerhq/hw-transport";
import type { AddressFormat } from "./getWalletPublicKey";
import type { Transaction } from "./types";
export type { AddressFormat };
/**
 *
 */
export declare type CreateTransactionArg = {
    inputs: Array<[
        Transaction,
        number,
        string | null | undefined,
        number | null | undefined
    ]>;
    associatedKeysets: string[];
    changePath?: string;
    outputScriptHex: string;
    lockTime?: number;
    sigHashType?: number;
    segwit?: boolean;
    initialTimestamp?: number;
    additionals: Array<string>;
    expiryHeight?: Buffer;
    useTrustedInputForSegwit?: boolean;
    onDeviceStreaming?: (arg0: {
        progress: number;
        total: number;
        index: number;
    }) => void;
    onDeviceSignatureRequested?: () => void;
    onDeviceSignatureGranted?: () => void;
};
export declare function createTransaction(transport: Transport, arg: CreateTransactionArg): Promise<string>;
//# sourceMappingURL=createTransaction.d.ts.map