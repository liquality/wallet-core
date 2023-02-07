import { Network, SwapProviderType } from '../store/types';
declare function getSwapProviderConfig(network: Network, providerId: SwapProviderType): import("../build.config").SwapProviderDefinition | undefined;
declare function getSwapProviderInfo(network: Network, providerId: SwapProviderType): {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    fees: string[];
} | {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    fees: string[];
} | {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    fees: string[];
} | {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    fees: string[];
} | {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    fees: string[];
} | {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    fees: string[];
} | {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    fees: string[];
} | {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    fees: string[];
} | {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    fees: string[];
} | {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    fees: string[];
} | {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    fees: string[];
} | {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    fees: string[];
} | {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    fees: string[];
} | {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    fees: string[];
};
declare const getLiqualityLiquidityForAsset: ({ asset, network, }: {
    asset: string;
    network: Network;
}) => Promise<number>;
export { getSwapProviderConfig, getSwapProviderInfo, getLiqualityLiquidityForAsset };
