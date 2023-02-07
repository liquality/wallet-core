import { Network as ChainifyNetwork } from '@chainify/types';
import { ChainId } from '@liquality/cryptoassets';
import { Network } from '../store/types';
export declare const Networks: Network[];
export declare type ChainNetworksType = Record<string, {
    mainnet: ChainifyNetwork;
    testnet: ChainifyNetwork;
}>;
export declare const ChainNetworks: ChainNetworksType;
export declare function getRpcUrl(chainId: ChainId, network?: Network): string;
