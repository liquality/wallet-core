import { ChainId } from '@liquality/cryptoassets';
import { Asset, Network, SwapProviderType } from './store/types';
export interface SwapProviderDefinition {
    name: string;
    icon: string;
    type: SwapProviderType;
    [x: string | number | symbol]: unknown;
}
export interface WalletCoreConfig {
    defaultAssets: {
        [key in Network]: Asset[];
    };
    swapProviders: {
        [key in Network]: {
            [providerType in SwapProviderType]?: SwapProviderDefinition;
        };
    };
    networks: Network[];
    chains: ChainId[];
    supportedBridgeAssets: Asset[];
    discordUrl: string;
    infuraApiKey: string;
    exploraApis: {
        [key in Network]: string;
    };
    batchEsploraApis: {
        [key in Network]: string;
    };
    nameResolvers: {
        uns: {
            resolutionService: string;
            tldAPI: string;
            alchemyKey: string;
        };
    };
}
declare const config: WalletCoreConfig;
export default config;
