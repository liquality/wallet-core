import * as ethers from 'ethers';
import { Asset, Network } from '../store/types';
export declare const isERC20: (asset: Asset) => boolean;
export declare const isChainEvmCompatible: (asset: Asset, network?: Network) => boolean;
export declare const isAssetEvmNativeAsset: (asset: Asset, network?: Network) => boolean;
export declare const getNativeAsset: (asset: Asset, network?: Network) => string;
export declare const getFeeAsset: (asset: Asset) => string | undefined;
export declare const getAssetColorStyle: (asset: Asset) => {
    color: string;
};
export declare const getTransactionExplorerLink: (hash: string, asset: Asset, network: Network) => string;
export declare const getAddressExplorerLink: (address: string, asset: Asset, network: Network) => string;
export declare const getExplorerTransactionHash: (asset: Asset, hash: string) => string;
export declare const estimateGas: ({ data, to, value }: {
    data: string;
    to: string;
    value: ethers.BigNumber;
}) => Promise<ethers.ethers.BigNumber>;
export declare const getMarketplaceName: (asset: Asset, network: Network) => string;
export declare const getNftTransferLink: (asset: Asset, network: Network, tokenId: string, contract_address: string) => string;
export declare const getNftLink: (asset: Asset, network: Network) => string;
export declare const openseaLink: (network: Network) => string;
