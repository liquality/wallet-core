import type Transport from "@ledgerhq/hw-transport";
/**
 * address format is one of legacy | p2sh | bech32 | cashaddr
 */
export declare type AddressFormat = "legacy" | "p2sh" | "bech32" | "bech32m" | "cashaddr";
export declare function getWalletPublicKey(transport: Transport, options: {
    path: string;
    verify?: boolean;
    format?: AddressFormat;
}): Promise<{
    publicKey: string;
    bitcoinAddress: string;
    chainCode: string;
}>;
//# sourceMappingURL=getWalletPublicKey.d.ts.map