import { ChainId } from './types';
import { FallbackProvider } from '@ethersproject/providers';
export declare const getRpcUrl: (chainId: ChainId, archive?: boolean) => Promise<string>;
export declare const getRpcUrls: (chainId: ChainId, archive?: boolean) => Promise<string[]>;
export declare const getRpcProvider: (chainId: number, archive?: boolean) => Promise<FallbackProvider>;
export declare const getMulticallAddress: (chainId: ChainId) => Promise<string | undefined>;
