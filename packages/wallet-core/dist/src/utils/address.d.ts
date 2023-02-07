import { BitcoinTypes } from '@chainify/bitcoin';
export declare function shortenAddress(address: string): string;
export declare const BitcoinAddressType: typeof BitcoinTypes.AddressType;
export declare const BTC_ADDRESS_TYPE_TO_PREFIX: {
    legacy: number;
    "p2sh-segwit": number;
    bech32: number;
};
