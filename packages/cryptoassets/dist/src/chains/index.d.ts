import { BaseChain } from './BaseChain';
import { ChainId, Network } from '../types';
export declare const MAINNET_SUPPORTED_CHAINS: Record<ChainId, BaseChain>;
export declare const TESTNET_SUPPORTED_CHAINS: Record<ChainId, BaseChain>;
export declare function getChain(network: Network, chainId: ChainId): BaseChain;
export declare function getNativeAssetCode(network: Network, chainId: ChainId, index?: number): string;
export declare function isEvmChain(network: Network, chainId: ChainId): boolean;
export declare function getAllSupportedChains(): {
    mainnet: Record<ChainId, BaseChain>;
    testnet: Record<ChainId, BaseChain>;
};
export declare function getAllEvmChains(): {
    mainnet: import("../types").ChainsMap;
    testnet: import("../types").ChainsMap;
};
export declare function getAllUtxoChains(): {
    mainnet: import("../types").ChainsMap;
    testnet: import("../types").ChainsMap;
};
export declare function getAllNonEvmChains(): {
    mainnet: import("../types").ChainsMap;
    testnet: import("../types").ChainsMap;
};
