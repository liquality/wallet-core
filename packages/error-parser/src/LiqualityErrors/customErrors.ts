export const CUSTOM_ERRORS = {
  NotFound: {
    Default: 'Something was not found',
    AccountTypeOption: (accountType: string) => `Option not found for account type ${accountType}`,
    LedgerTransportCreator: 'ledgerTransportCreator is not defined - unable to build ledger client',
    Client: (chainId: string) => `Client for chain ${chainId} not implemented`,
    Wallet: 'Wallet not found',
    Account: (accountId: string) => `Account with id ${accountId} not found`,
    Accounts: 'Accounts not found',
    History: {
      Item: 'Item does not exist',
      Transaction: 'Transaction not found',
    },
    SwapProvider: {
      Statuses:
        'statuses is not defined. Shape: { STATUS: { step: number, label: string, filterStatus: string, notification () : ({ message }) } }',
      FromTxType: "fromTxType is not defined. e.g. 'INITIATE'",
      ToTxType: "toTxType is not defined. e.g. 'REDEEM'",
      timelineDiagramSteps: "timelineDiagramSteps is not defined. e.g. ['APPROVE','SWAP']",
      totalSteps: 'totalSteps is not defined. e.g. 2',
      _txTypes: "_txTypes is not defined. e.g. {SWAP: 'SWAP'}",
      Config: (providerId: string, network: string) =>
        `Failed to retrieve swap provider config for ${providerId} on ${network}`,
    },
    ContractAddress: 'Missing contract address',
    FastBTC: {
      Logs: 'FastBTC logs missing',
      NewBitcoinTransferEvent: 'NewBitcoinTransfer event not found',
    },
    RPC: (chainId: string, network: string) => `RPC for ${chainId} ${network} not defined`,
    Thorchain: {
      InboundAddress: (chain: string) => `Inbound address for chain ${chain} not found`,
      RouterAddress: (chain: string) => `Router address for chain ${chain} not found`,
      BaseNetworkFee: 'baseNetworkFee not found',
      PoolData: 'pool data for ETH.ETH not found',
      Asset: 'Thorchain asset does not exist',
    },
    Chain: {
      DefaultColor: (chain: string) => `Default color for chain ${chain} not defined`,
      Explorer: (chain: string) => `Explorer definition not found for chain ${chain}`,
      DerivationPath: (chainId: string) => `Derivation path creator for chain ${chainId} not implemented`,
      GasLimit: (chainId: string) => `${chainId} doesn't have gas limit set`,
      L1GasLimit: (chainId: string) => `${chainId} doesn't have gas Layer 1 gas limit set`,
      FeePrice: 'feePrice is not defined.',
      L1FeePrice: 'l1FeePrice is not defined',
    },
    Asset: {
      Default: 'Asset does not exist',
      Chain: (asset: string) => `asset chain not available for ${asset}`,
      FeeAsset: (asset?: string) => `fee asset not available ${asset && 'for ' + asset}`,
      Fees: (feeAsset: string) => `fees not avaibale for ${feeAsset}`,
    },
    Nft: {
      MarketPlaceName: (chainId: string, network: string) => `Marketplace name for ${chainId} ${network} not defined`,
      TransferLink: (chainId: string, network: string) => `Transfer link for ${chainId} ${network} not defined`,
      ExplorerLink: (chainId: string, network: string) => `Nft explorer link for ${chainId} ${network} not defined`,
    },
    AstroPortDenom: 'denom unresolved but required for swaps from native',
  },
  Invalid: {
    Default: 'Incorrect input!',
    DomainName: 'Invalid domain name',
    AssetChainNotAccountChain: (asset: string, accountId: string) =>
      `${asset} and accountId: ${accountId} belong to different chains`,
    TransactionType: (txType: string) => `Invalid tx type ${txType}`,
    SwapProvider: {
      TxType: (txType: string) => `Invalid tx type ${txType}`,
    },
    AstroPortSwapPair: (fromAssetType: string, toAssetType: string) =>
      `Invalid swap pair From: ${fromAssetType} To: ${toAssetType}`,
    ThorchainMemoAction: (memoAction: string) => `Unknown memo action ${memoAction}`,
    ChainGasFeeMisMatch: 'suggestedGasFee does not match chain!',
    MessageType: (type: string) => `Received an invalid message type: ${type}`,
    Json: (err: any) => `Invalid Json: ${err}`,
  },
  Unsupported: {
    Default: 'Something is unsupported',
    SwapRoute: (fromChain: string, toChain: string) => `Route ${fromChain} - ${toChain} not supported`,
    Chain: `chain not supported`,
    NftAssetMap: (chainId: string, network: string) => `NFT asset map for ${chainId} ${network} is not supported`,
    PaymentURI: 'Unsupported payment URI',
    Method: 'Method not allowed',
  },
  FailedAssert: {
    Default: 'An assertion failed',
    SendTransaction: 'Did not send transaction',
    UniswapTokenCalculation: 'unable to calculate token0 token1',
    RehydrateState: 'State has already been synchronised with Background',
  },
  Unimplemented: {
    Default: 'Something is unimplemented',
    Method: 'Method is not implemented',
  },
  Unknown: (err?: any) => `An unknown error occured, ${err}`,
};
