export declare global {
    interface Window {
        providerManager: {
            getProviderFor(asset: string): any;
            enable(chainId: string): Promise<{ accepted: boolean }>;
        };
    }
}
