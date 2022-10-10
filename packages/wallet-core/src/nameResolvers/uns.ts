import { HttpClient } from '@chainify/client';
import { Nullable } from '@chainify/types';
import { IAsset, AssetTypes, ChainId, getChain } from '@liquality/cryptoassets';
import { Network } from '@liquality/cryptoassets/dist/src/types';
import { Resolution, ResolutionResponse } from '@unstoppabledomains/resolution';
import buildConfig from '../build.config';
import { NameResolver } from './nameResolver';

const reg = RegExp('^[.a-z0-9-]+$');
const resolution = new Resolution();
const unsConfig = buildConfig.nameResolvers.uns;

interface TldsResponse {
  tlds: string[];
}

function getUNSKey(asset: IAsset, noVersion: boolean = false): string {
  const symbol = asset.matchingAsset ? asset.matchingAsset : asset.code;
  if (noVersion) {
    return `crypto.${symbol}.address`;
  }
  const chainKey = multiAssetChainKey(asset.chain);
  if (chainKey) {
    if (asset.type == AssetTypes.native && asset.chain != ChainId.Polygon) {
      return `crypto.${symbol}.address`;
    }
    return `crypto.${symbol}.version.${chainKey}.address`;
  } else {
    return `crypto.${symbol}.address`;
  }
}

function multiAssetChainKey(chainId: ChainId): string | null {
  return getChain(Network.Mainnet, chainId).nameService?.uns || null;
}

class UNSResolver implements NameResolver {
  supportedTlds: string[] | null;

  async lookupDomain(address: string, asset: IAsset): Promise<Nullable<string>> {
    try {
      const domain = this.preparedDomain(address);
      if (await this.isValidTLD(domain)) {
        const data: ResolutionResponse = await HttpClient.get(
          unsConfig.resolutionService + domain,
          {},
          { headers: { Authorization: `Bearer ${unsConfig.alchemyKey}` } }
        );
        return data?.records[getUNSKey(asset)] ?? data?.records[getUNSKey(asset, true)] ?? null;
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

export { UNSResolver, getUNSKey };
