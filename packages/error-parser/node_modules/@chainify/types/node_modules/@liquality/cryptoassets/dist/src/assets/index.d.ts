import { IAsset } from '../interfaces/IAsset';
import { ChainId, Network } from '../types';
import { CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP, MAINNET_ERC20_ASSETS } from './mainnet/erc20';
import { MAINNET_NATIVE_ASSETS } from './mainnet/native';
import { CHAIN_TO_TESTNET_TOKEN_ADDRESS_MAP, TESTNET_ERC20_ASSETS } from './testnet/erc20';
import { TESTNET_NATIVE_ASSETS } from './testnet/native';
declare const MAINNET_ASSETS: {
    [x: string]: IAsset;
};
declare const TESTNET_ASSETS: {
    [x: string]: IAsset;
};
export { MAINNET_ASSETS, MAINNET_NATIVE_ASSETS, MAINNET_ERC20_ASSETS, CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP };
export { TESTNET_ASSETS, TESTNET_NATIVE_ASSETS, TESTNET_ERC20_ASSETS, CHAIN_TO_TESTNET_TOKEN_ADDRESS_MAP };
export declare function getAssetSendGasLimit(asset: IAsset, network: Network): number | undefined;
export declare function getAssetSendL1GasLimit(asset: IAsset, network: Network): number | undefined;
export declare function getAsset(network: Network, asset: string): IAsset;
export declare function getToken(chain: ChainId, tokenAddress: string): IAsset;
export declare function getAllAssets(): {
    mainnet: {
        [x: string]: IAsset;
    };
    testnet: {
        [x: string]: IAsset;
    };
};
export declare function getAllNativeAssets(): {
    mainnet: import("../types").AssetMap;
    testnet: import("../types").AssetMap;
};
export declare function getAllNonNativeAssets(): {
    mainnet: import("../types").AssetMap;
    testnet: import("../types").AssetMap;
};
