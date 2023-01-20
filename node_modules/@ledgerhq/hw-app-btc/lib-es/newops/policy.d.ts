/// <reference types="node" />
export declare type DefaultDescriptorTemplate = "pkh(@0)" | "sh(wpkh(@0))" | "wpkh(@0)" | "tr(@0)";
/**
 * The Bitcon hardware app uses a descriptors-like thing to describe
 * how to construct output scripts from keys. A "Wallet Policy" consists
 * of a "Descriptor Template" and a list of "keys". A key is basically
 * a serialized BIP32 extended public key with some added derivation path
 * information. This is documented at
 * https://github.com/LedgerHQ/app-bitcoin-new/blob/master/doc/wallet.md
 */
export declare class WalletPolicy {
    descriptorTemplate: string;
    keys: string[];
    /**
     * For now, we only support default descriptor templates.
     */
    constructor(descriptorTemplate: DefaultDescriptorTemplate, key: string);
    getWalletId(): Buffer;
    serialize(): Buffer;
}
export declare function createKey(masterFingerprint: Buffer, path: number[], xpub: string): string;
//# sourceMappingURL=policy.d.ts.map