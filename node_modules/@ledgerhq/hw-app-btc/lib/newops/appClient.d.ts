/// <reference types="node" />
import Transport from "@ledgerhq/hw-transport";
import { PsbtV2 } from "./psbtv2";
import { WalletPolicy } from "./policy";
/**
 * This class encapsulates the APDU protocol documented at
 * https://github.com/LedgerHQ/app-bitcoin-new/blob/master/doc/bitcoin.md
 */
export declare class AppClient {
    transport: Transport;
    constructor(transport: Transport);
    private makeRequest;
    getExtendedPubkey(display: boolean, pathElements: number[]): Promise<string>;
    getWalletAddress(walletPolicy: WalletPolicy, walletHMAC: Buffer | null, change: number, addressIndex: number, display: boolean): Promise<string>;
    signPsbt(psbt: PsbtV2, walletPolicy: WalletPolicy, walletHMAC: Buffer | null, progressCallback: () => void): Promise<Map<number, Buffer>>;
    getMasterFingerprint(): Promise<Buffer>;
}
//# sourceMappingURL=appClient.d.ts.map