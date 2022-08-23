import { HttpClient } from '@chainify/client';
import { Nullable } from '@chainify/types';
import { ChainId, chains } from '@liquality/cryptoassets';
import { Resolution, ResolutionResponse } from '@unstoppabledomains/resolution';
import buildConfig from '../build.config';
import { NameResolver } from './nameResolver';

const reg = RegExp('^[.a-z0-9-]+$');
const resolution = new Resolution();
const unsConfig = buildConfig.nameResolvers.uns;

interface TldsResponse {
  tlds: string[];
}

function getUNSKey(chainId: ChainId) {
  const unsKey = chainToUNSKey(chainId);
  if (!unsKey) return null;
  return 'crypto.' + unsKey + '.address';
}

function chainToUNSKey(chainId: ChainId) {
  switch (chainId) {
    case ChainId.Bitcoin:
      return 'BTC';
    case ChainId.Avalanche:
      return 'AVAX';
    case ChainId.BinanceSmartChain:
      return 'BNB';
    case ChainId.BitcoinCash:
      return 'BCH';
    case ChainId.Fuse:
      return 'FUSE';
    case ChainId.Near:
      return 'NEAR';
    case ChainId.Polygon:
      return 'MATIC.version.MATIC';
    case ChainId.Solana:
      return 'SOL';
    case ChainId.Terra:
      return 'LUNA';
    case ChainId.Rootstock:
      return 'RSK';
    case ChainId.Ethereum:
      return 'ETH';
    default:
      return chains[chainId].evmCompatible ? 'ETH' : null;
  }
}

class UNSResolver implements NameResolver {
  supportedTlds: string[] | null;

  async lookupDomain(address: string, chainId: ChainId): Promise<Nullable<string>> {
    const unsKey = getUNSKey(chainId);
    if (!unsKey) {
      return null; // Chain is not supported for resolving domain
    }
    try {
      const domain = this.preparedDomain(address);
      if (await this.isValidTLD(domain)) {
        const data: ResolutionResponse = await HttpClient.get(
          unsConfig.resolutionService + domain,
          {},
          { headers: { Authorization: `Bearer ${unsConfig.alchemyKey}` } }
        );
        return data.records[unsKey] ?? null;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async isValidTLD(domain: string): Promise<boolean> {
    if (!this.supportedTlds) {
      const data: TldsResponse = await HttpClient.get(unsConfig.tldAPI);
      if (data.tlds) {
        this.supportedTlds = data.tlds;
      }
    }
    return this.supportedTlds?.some((tld) => domain.endsWith(tld)) ?? false;
  }

  preparedDomain(domain: string): string {
    const retVal = domain ? domain.trim().toLowerCase() : '';
    if (!reg.test(retVal)) {
      throw 'Invalid domain name';
    }
    return retVal;
  }

  async reverseLookup(address: string): Promise<Nullable<string>> {
    try {
      const domain = await resolution.reverse(address);
      return domain;
    } catch (e) {
      return null;
    }
  }
}

export { UNSResolver, chainToUNSKey, getUNSKey };
