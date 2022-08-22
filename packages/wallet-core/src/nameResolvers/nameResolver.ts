import { Nullable } from '@chainify/types';
import { ChainId } from '@liquality/cryptoassets';

export interface NameResolver {
  reverseLookup(address: string): Promise<Nullable<string>>;
  lookupDomain(address: string, chainId: ChainId): Promise<Nullable<string>>;
  isValidTLD(domain: string): Promise<boolean>;
}
