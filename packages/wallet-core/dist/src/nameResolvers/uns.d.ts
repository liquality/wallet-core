import { Nullable } from '@chainify/types';
import { IAsset } from '@liquality/cryptoassets';
import { NameResolver } from './nameResolver';
declare function getUNSKey(asset: IAsset, noVersion?: boolean): string;
declare class UNSResolver implements NameResolver {
    supportedTlds: string[] | null;
    lookupDomain(address: string, asset: IAsset): Promise<Nullable<string>>;
    isValidTLD(domain: string): Promise<boolean>;
    preparedDomain(domain: string): string;
    reverseLookup(address: string): Promise<Nullable<string>>;
}
export { UNSResolver, getUNSKey };
