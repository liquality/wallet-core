import type Transport from "@ledgerhq/hw-transport";
export declare function signMessage(transport: Transport, { path, messageHex, }: {
    path: string;
    messageHex: string;
}): Promise<{
    v: number;
    r: string;
    s: string;
}>;
//# sourceMappingURL=signMessage.d.ts.map