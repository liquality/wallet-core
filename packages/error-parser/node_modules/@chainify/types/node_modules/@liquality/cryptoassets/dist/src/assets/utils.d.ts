import { IAsset } from '../interfaces/IAsset';
import { AssetMap, ChainId, MakeOptional } from '../types';
export declare const transformTokenMap: (tokens: Record<string, MakeOptional<IAsset, 'type' | 'chain'>>, chain: ChainId) => AssetMap;
export declare const transformChainToTokenAddress: (tokens: AssetMap) => Record<string, AssetMap>;
