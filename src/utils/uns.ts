import { HttpClient } from '@chainify/client';
import { ChainId } from '@liquality/cryptoassets';
import { Resolution } from '@unstoppabledomains/resolution';
import buildConfig from '../build.config';

const reg = RegExp('^[.a-z0-9-]+$')
const resolution = new Resolution()

interface NameResolver {
    reverseLookup(address: string): Promise<string | null>
    lookupDomain(address: string, chainId: ChainId): Promise<string | null>
    isValidTLD(domain: string): Promise<boolean>
}

export class UNSResolver implements NameResolver {
    supportedTlds: string[] | null
    getUNSKey(chainId: ChainId): string {
        const unsKey = this.chainToUNSKey(chainId)
        return 'crypto.' + unsKey + '.address'
    }

    chainToUNSKey(chainId: ChainId): string {
        switch (chainId) {
            case ChainId.Bitcoin:
                return 'BTC'
            case ChainId.Avalanche:
                return 'AVAX'
            case ChainId.BinanceSmartChain:
                return 'BNB'
            case ChainId.BitcoinCash:
                return 'BCH'
            case ChainId.Fuse:
                return 'FUSE'
            case ChainId.Near:
                return 'NEAR'
            case ChainId.Polygon:
                return 'MATIC'
            case ChainId.Solana:
                return 'SOL'
            case ChainId.Terra:
                return 'LUNA'
            case ChainId.Rootstock:
                return 'RSK'
            case ChainId.Ethereum:
            case ChainId.Arbitrum:
            default:
                return 'ETH'
        }

    }

    async lookupDomain(address: string, chainId: ChainId): Promise<string | null> {
        try {
            const domain = this.preparedDomain(address)
            if (await this.isValidTLD(domain)) {
                const data = await HttpClient.get(
                    buildConfig.resolutionService + domain,
                    {},
                    { headers: { "Authorization": `Bearer ${buildConfig.alchemyKey}` } }
                )
                return data?.records[this.getUNSKey(chainId)] ?? null
            }
            return null
        } catch (e) {
            return null
        }
    }

    async isValidTLD(domain: string): Promise<boolean> {
        if (!this.supportedTlds) {
            const response = await fetch(buildConfig.tldAPI)
            const data = await response.json()
            if (data['tlds']) {
                this.supportedTlds = data['tlds']
            }
        }
        return this.supportedTlds?.some((tld) => domain.endsWith(tld)) ?? false
    }

    preparedDomain(domain: string): string {
        const retVal = domain ? domain.trim().toLowerCase() : ''
        if (!reg.test(retVal)) {
            throw 'Invalid domain name'
        }
        return retVal
    }

    async reverseLookup(address: string): Promise<string | null> {
        try {
            const domain = await resolution.reverse(address)
            return domain
        } catch (e) {
            return null
        }
    }
}
