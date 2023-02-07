declare const _default: {
    gasLimit: {
        send: {
            native: number;
            nonNative: number;
        };
        sendL1: {
            native: number;
            nonNative: number;
        };
    };
    id: import("../../..").ChainId;
    name: string;
    code: string;
    color: string;
    nativeAsset: import("../../..").IAsset[];
    isEVM: boolean;
    hasTokens: boolean;
    nftProviderType?: import("../../../types").NftProviderType | undefined;
    isMultiLayered: boolean;
    averageBlockTime: number;
    safeConfirmations: number;
    txFailureTimeoutMs: number;
    nameService?: import("../../../interfaces/IChain").INameService | undefined;
    network: import("../../../interfaces/INetwork").INetwork;
    faucetUrl?: string | undefined;
    explorerViews: import("../../../types").ExplorerView[];
    multicallSupport: boolean;
    ledgerSupport: boolean;
    fees: import("../../../interfaces/IFees").IFees;
    EIP1559: boolean;
    supportCustomFees: boolean;
    feeMultiplier?: import("../../../types").FeeMultiplier | undefined;
};
export default _default;
