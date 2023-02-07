import { IAsset } from './interfaces/IAsset';
import { IChain } from './interfaces/IChain';
export declare enum AssetTypes {
    native = "native",
    erc20 = "erc20"
}
export declare type AssetType = AssetTypes.native | AssetTypes.erc20;
export declare enum ChainId {
    Bitcoin = "bitcoin",
    Ethereum = "ethereum",
    Rootstock = "rsk",
    BinanceSmartChain = "bsc",
    Near = "near",
    Polygon = "polygon",
    Arbitrum = "arbitrum",
    Solana = "solana",
    Fuse = "fuse",
    Terra = "terra",
    Avalanche = "avalanche",
    Optimism = "optimism"
}
export declare type AssetMap = Record<string, IAsset>;
export declare type ExplorerView = {
    tx?: string;
    address?: string;
    token?: string;
};
export declare type FeeMultiplier = {
    slowMultiplier: number;
    averageMultiplier: number;
    fastMultiplier: number;
};
export declare type MakeOptional<Type, Key extends keyof Type> = Omit<Type, Key> & Partial<Type>;
export declare enum Network {
    Mainnet = "mainnet",
    Testnet = "testnet"
}
export declare type ChainsMap = {
    [key in ChainId]?: IChain;
};
export declare enum NftProviderType {
    OpenSea = "opensea",
    Moralis = "moralis",
    Covalent = "covalent"
}
