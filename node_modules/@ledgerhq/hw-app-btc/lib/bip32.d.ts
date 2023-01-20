/// <reference types="node" />
export declare function pathElementsToBuffer(paths: number[]): Buffer;
export declare function bip32asBuffer(path: string): Buffer;
export declare function pathArrayToString(pathElements: number[]): string;
export declare function pathStringToArray(path: string): number[];
export declare function pubkeyFromXpub(xpub: string): Buffer;
export declare function getXpubComponents(xpub: string): {
    chaincode: Buffer;
    pubkey: Buffer;
    version: number;
};
export declare function hardenedPathOf(pathElements: number[]): number[];
//# sourceMappingURL=bip32.d.ts.map