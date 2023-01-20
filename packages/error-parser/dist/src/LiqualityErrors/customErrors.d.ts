export declare const CUSTOM_ERRORS: {
    NotFound: {
        Default: string;
        AccountTypeOption: (accountType: string) => string;
        LedgerTransportCreator: string;
        Client: (chainId: string) => string;
        Wallet: string;
        Account: (accountId: string) => string;
        Accounts: string;
        History: {
            Item: string;
            Transaction: string;
        };
        SwapProvider: {
            Statuses: string;
            FromTxType: string;
            ToTxType: string;
            timelineDiagramSteps: string;
            totalSteps: string;
            _txTypes: string;
            Config: (providerId: string, network: string) => string;
        };
        ContractAddress: string;
        FastBTC: {
            Logs: string;
            NewBitcoinTransferEvent: string;
        };
        RPC: (chainId: string, network: string) => string;
        Thorchain: {
            InboundAddress: (chain: string) => string;
            RouterAddress: (chain: string) => string;
            BaseNetworkFee: string;
            PoolData: string;
            Asset: string;
        };
        Chain: {
            DefaultColor: (chain: string) => string;
            Explorer: (chain: string) => string;
            DerivationPath: (chainId: string) => string;
            GasLimit: (chainId: string) => string;
            L1GasLimit: (chainId: string) => string;
            FeePrice: string;
            L1FeePrice: string;
        };
        Asset: {
            Default: string;
            Chain: (asset: string) => string;
            FeeAsset: (asset?: string) => string;
            Fees: (feeAsset: string) => string;
        };
        Nft: {
            MarketPlaceName: (chainId: string, network: string) => string;
            TransferLink: (chainId: string, network: string) => string;
            ExplorerLink: (chainId: string, network: string) => string;
        };
        AstroPortDenom: string;
    };
    Invalid: {
        Default: string;
        DomainName: string;
        AssetChainNotAccountChain: (asset: string, accountId: string) => string;
        TransactionType: (txType: string) => string;
        SwapProvider: {
            TxType: (txType: string) => string;
        };
        AstroPortSwapPair: (fromAssetType: string, toAssetType: string) => string;
        ThorchainMemoAction: (memoAction: string) => string;
        ChainGasFeeMisMatch: string;
        MessageType: (type: string) => string;
        Json: (err: any) => string;
    };
    Unsupported: {
        Default: string;
        SwapRoute: (fromChain: string, toChain: string) => string;
        Chain: string;
        NftAssetMap: (chainId: string, network: string) => string;
        PaymentURI: string;
        Method: string;
    };
    FailedAssert: {
        Default: string;
        SendTransaction: string;
        UniswapTokenCalculation: string;
        RehydrateState: string;
    };
    Unimplemented: {
        Default: string;
        Method: string;
    };
    Unknown: (err?: any) => string;
};
