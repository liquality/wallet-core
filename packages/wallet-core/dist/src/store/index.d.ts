import { ActionContext as _ActionContext } from 'vuex';
import * as actions from './actions';
import { RootState } from './types';
declare const store: {
    readonly state: {
        readonly version: number;
        readonly key: string;
        readonly wallets: import("./types").Wallet[];
        readonly unlockedAt: number;
        readonly brokerReady: boolean;
        readonly encryptedWallets: string;
        readonly enabledAssets: {
            mainnet?: Record<string, string[]> | undefined;
            testnet?: Record<string, string[]> | undefined;
        };
        readonly customTokens: {
            mainnet?: Record<string, import("./types").CustomToken[]> | undefined;
            testnet?: Record<string, import("./types").CustomToken[]> | undefined;
        };
        readonly accounts: {
            [x: string]: Record<import("./types").Network, import("./types").Account[]> | undefined;
        };
        readonly fiatRates: {
            [x: string]: number;
        };
        readonly currenciesInfo: {
            [x: string]: import("bignumber.js").BigNumber;
        };
        readonly fees: {
            mainnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
            testnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
        };
        readonly history: {
            mainnet?: Record<string, import("./types").HistoryItem[]> | undefined;
            testnet?: Record<string, import("./types").HistoryItem[]> | undefined;
        };
        readonly marketData: {
            mainnet?: import("./types").MarketData[] | undefined;
            testnet?: import("./types").MarketData[] | undefined;
        };
        readonly activeNetwork: import("./types").Network;
        readonly activeWalletId: string;
        readonly keyUpdatedAt: number;
        readonly keySalt: string;
        readonly termsAcceptedAt: number;
        readonly setupAt: number;
        readonly injectEthereum: boolean;
        readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
        readonly usbBridgeWindowsId: number;
        readonly externalConnections: {
            [x: string]: Record<string, import("./types").Connections>;
        };
        readonly rskLegacyDerivation: boolean;
        readonly analytics: {
            userId: string;
            acceptedDate: number;
            askedDate: number;
            askedTimes: number;
            notAskAgain: boolean;
        };
        readonly experiments: {
            manageAccounts?: boolean | undefined;
            reportErrors?: boolean | undefined;
        };
        readonly whatsNewModalVersion: string;
        readonly enabledChains: {
            [x: string]: Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]> | undefined;
        };
        readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
        readonly customChainSeetings: {
            mainnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
            testnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
        };
    };
    getters: {
        readonly client: ({ network, walletId, chainId, accountId, useCache, accountType, accountIndex, }: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            accountId?: string | undefined;
            useCache?: boolean | undefined;
            accountType?: import("./types").AccountType | undefined;
            accountIndex?: number | undefined;
        }) => import("@chainify/client").Client<import("@chainify/client").Chain<any, import("@chainify/types").Network>, import("@chainify/client").Wallet<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
        readonly historyItemById: (network: import("./types").Network, walletId: string, id: string) => import("./types").HistoryItem | undefined;
        readonly cryptoassets: {
            [x: string]: import("@liquality/cryptoassets").IAsset;
        };
        readonly networkAccounts: readonly import("./types").Account[];
        readonly networkAssets: readonly string[];
        readonly allNetworkAssets: readonly string[];
        readonly activity: readonly import("./types").HistoryItem[];
        readonly totalFiatBalance: {
            readonly c: number[] | null;
            readonly e: number | null;
            readonly s: number | null;
            readonly absoluteValue: () => import("bignumber.js").BigNumber;
            readonly abs: () => import("bignumber.js").BigNumber;
            readonly comparedTo: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => number;
            readonly decimalPlaces: {
                (): number | null;
                (decimalPlaces: number, roundingMode?: import("bignumber.js").BigNumber.RoundingMode | undefined): import("bignumber.js").BigNumber;
            };
            readonly dp: {
                (): number | null;
                (decimalPlaces: number, roundingMode?: import("bignumber.js").BigNumber.RoundingMode | undefined): import("bignumber.js").BigNumber;
            };
            readonly dividedBy: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => import("bignumber.js").BigNumber;
            readonly div: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => import("bignumber.js").BigNumber;
            readonly dividedToIntegerBy: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => import("bignumber.js").BigNumber;
            readonly idiv: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => import("bignumber.js").BigNumber;
            readonly exponentiatedBy: {
                (n: import("bignumber.js").BigNumber.Value, m?: import("bignumber.js").BigNumber.Value | undefined): import("bignumber.js").BigNumber;
                (n: number, m?: import("bignumber.js").BigNumber.Value | undefined): import("bignumber.js").BigNumber;
            };
            readonly pow: {
                (n: import("bignumber.js").BigNumber.Value, m?: import("bignumber.js").BigNumber.Value | undefined): import("bignumber.js").BigNumber;
                (n: number, m?: import("bignumber.js").BigNumber.Value | undefined): import("bignumber.js").BigNumber;
            };
            readonly integerValue: (rm?: import("bignumber.js").BigNumber.RoundingMode | undefined) => import("bignumber.js").BigNumber;
            readonly isEqualTo: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => boolean;
            readonly eq: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => boolean;
            readonly isFinite: () => boolean;
            readonly isGreaterThan: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => boolean;
            readonly gt: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => boolean;
            readonly isGreaterThanOrEqualTo: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => boolean;
            readonly gte: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => boolean;
            readonly isInteger: () => boolean;
            readonly isLessThan: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => boolean;
            readonly lt: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => boolean;
            readonly isLessThanOrEqualTo: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => boolean;
            readonly lte: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => boolean;
            readonly isNaN: () => boolean;
            readonly isNegative: () => boolean;
            readonly isPositive: () => boolean;
            readonly isZero: () => boolean;
            readonly minus: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => import("bignumber.js").BigNumber;
            readonly modulo: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => import("bignumber.js").BigNumber;
            readonly mod: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => import("bignumber.js").BigNumber;
            readonly multipliedBy: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => import("bignumber.js").BigNumber;
            readonly times: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => import("bignumber.js").BigNumber;
            readonly negated: () => import("bignumber.js").BigNumber;
            readonly plus: (n: import("bignumber.js").BigNumber.Value, base?: number | undefined) => import("bignumber.js").BigNumber;
            readonly precision: {
                (includeZeros?: boolean | undefined): number;
                (significantDigits: number, roundingMode?: import("bignumber.js").BigNumber.RoundingMode | undefined): import("bignumber.js").BigNumber;
            };
            readonly sd: {
                (includeZeros?: boolean | undefined): number;
                (significantDigits: number, roundingMode?: import("bignumber.js").BigNumber.RoundingMode | undefined): import("bignumber.js").BigNumber;
            };
            readonly shiftedBy: (n: number) => import("bignumber.js").BigNumber;
            readonly squareRoot: () => import("bignumber.js").BigNumber;
            readonly sqrt: () => import("bignumber.js").BigNumber;
            readonly toExponential: {
                (decimalPlaces: number, roundingMode?: import("bignumber.js").BigNumber.RoundingMode | undefined): string;
                (): string;
            };
            readonly toFixed: {
                (decimalPlaces: number, roundingMode?: import("bignumber.js").BigNumber.RoundingMode | undefined): string;
                (): string;
            };
            readonly toFormat: {
                (decimalPlaces: number, roundingMode: import("bignumber.js").BigNumber.RoundingMode, format?: import("bignumber.js").BigNumber.Format | undefined): string;
                (decimalPlaces: number, roundingMode?: import("bignumber.js").BigNumber.RoundingMode | undefined): string;
                (decimalPlaces?: number | undefined): string;
                (decimalPlaces: number, format: import("bignumber.js").BigNumber.Format): string;
                (format: import("bignumber.js").BigNumber.Format): string;
            };
            readonly toFraction: (max_denominator?: import("bignumber.js").BigNumber.Value | undefined) => [import("bignumber.js").BigNumber, import("bignumber.js").BigNumber];
            readonly toJSON: () => string;
            readonly toNumber: () => number;
            readonly toPrecision: {
                (significantDigits: number, roundingMode?: import("bignumber.js").BigNumber.RoundingMode | undefined): string;
                (): string;
            };
            readonly toString: (base?: number | undefined) => string;
            readonly valueOf: () => string;
        };
        readonly accountItem: (accountId: string) => import("./types").Account | undefined;
        readonly suggestedFeePrices: (asset: string) => import("@chainify/types").FeeDetails | undefined;
        readonly accountsWithBalance: readonly import("./types").Account[];
        readonly accountsData: readonly import("./types").Account[];
        readonly accountFiatBalance: (walletId: string, network: import("./types").Network, accountId: string) => import("bignumber.js").BigNumber;
        readonly assetFiatBalance: (asset: string, balance: import("bignumber.js").BigNumber) => import("bignumber.js").BigNumber | null;
        readonly assetMarketCap: (asset: string) => import("@chainify/types").Nullable<import("bignumber.js").BigNumber>;
        readonly chainAssets: {
            readonly bitcoin?: string[] | undefined;
            readonly ethereum?: string[] | undefined;
            readonly rsk?: string[] | undefined;
            readonly bsc?: string[] | undefined;
            readonly near?: string[] | undefined;
            readonly polygon?: string[] | undefined;
            readonly arbitrum?: string[] | undefined;
            readonly solana?: string[] | undefined;
            readonly fuse?: string[] | undefined;
            readonly terra?: string[] | undefined;
            readonly avalanche?: string[] | undefined;
            readonly optimism?: string[] | undefined;
        };
        readonly analyticsEnabled: Readonly<boolean>;
        readonly allNftCollections: {
            [x: string]: import("./types").NFTWithAccount[];
        };
        readonly accountNftCollections: (accountId: string) => import("./types").NFTCollections<import("./types").NFT>;
        readonly mergedChainSettings: {
            readonly bitcoin: import("../types").ChainifyNetwork;
            readonly ethereum: import("../types").ChainifyNetwork;
            readonly rsk: import("../types").ChainifyNetwork;
            readonly bsc: import("../types").ChainifyNetwork;
            readonly near: import("../types").ChainifyNetwork;
            readonly polygon: import("../types").ChainifyNetwork;
            readonly arbitrum: import("../types").ChainifyNetwork;
            readonly solana: import("../types").ChainifyNetwork;
            readonly fuse: import("../types").ChainifyNetwork;
            readonly terra: import("../types").ChainifyNetwork;
            readonly avalanche: import("../types").ChainifyNetwork;
            readonly optimism: import("../types").ChainifyNetwork;
        };
        readonly chainSettings: readonly {
            chain: string;
            asset: string;
            network: import("../types").ChainifyNetwork;
        }[];
    };
    commit: {
        SET_STATE: (payload: {
            newState: RootState;
        }) => void;
        CREATE_WALLET: (payload: {
            key: string;
            keySalt: string;
            encryptedWallets: string;
            wallet: import("./types").Wallet;
        }) => void;
        ACCEPT_TNC: () => void;
        CHANGE_ACTIVE_WALLETID: (payload: {
            walletId: string;
        }) => void;
        CHANGE_ACTIVE_NETWORK: (payload: {
            network: import("./types").Network;
        }) => void;
        CHANGE_PASSWORD: (payload: {
            key: string;
            keySalt: string;
            encryptedWallets: string;
        }) => void;
        LOCK_WALLET: () => void;
        UNLOCK_WALLET: (payload: {
            key: string;
            wallets: import("./types").Wallet[];
            unlockedAt: number;
        }) => void;
        NEW_SWAP: (payload: {
            network: import("./types").Network;
            walletId: string;
            swap: import("./types").SwapHistoryItem;
        }) => void;
        NEW_TRASACTION: (payload: {
            network: import("./types").Network;
            walletId: string;
            transaction: import("./types").SendHistoryItem;
        }) => void;
        NEW_NFT_TRASACTION: (payload: {
            network: import("./types").Network;
            walletId: string;
            transaction: import("./types").NFTSendHistoryItem;
        }) => void;
        UPDATE_HISTORY: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
            updates: Partial<import("./types").HistoryItem>;
        }) => void;
        REMOVE_ORDER: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
        }) => void;
        UPDATE_BALANCE: (payload: {
            network: import("./types").Network;
            accountId: string;
            walletId: string;
            asset: string;
            balance: string;
        }) => void;
        UPDATE_MULTIPLE_BALANCES: (payload: {
            network: import("./types").Network;
            accountId: string;
            walletId: string;
            assets: string[];
            balances: import("@chainify/types").Nullable<string>[];
        }) => void;
        UPDATE_FEES: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            fees: import("@chainify/types").FeeDetails;
        }) => void;
        UPDATE_FIAT_RATES: (payload: {
            fiatRates: import("./types").FiatRates;
        }) => void;
        UPDATE_CURRENCIES_INFO: (payload: {
            currenciesInfo: import("./types").CurrenciesInfo;
        }) => void;
        UPDATE_MARKET_DATA: (payload: {
            network: import("./types").Network;
            marketData: import("./types").MarketData[];
        }) => void;
        SET_ETHEREUM_INJECTION_CHAIN: (payload: {
            chain: import("@liquality/cryptoassets").ChainId;
        }) => void;
        ENABLE_ETHEREUM_INJECTION: () => void;
        DISABLE_ETHEREUM_INJECTION: () => void;
        ENABLE_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => void;
        DISABLE_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => void;
        DISABLE_ACCOUNT_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            assets: string[];
        }) => void;
        ENABLE_ACCOUNT_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            assets: string[];
        }) => void;
        ADD_CUSTOM_TOKEN: (payload: {
            network: import("./types").Network;
            walletId: string;
            customToken: import("./types").CustomToken;
        }) => void;
        REMOVE_CUSTOM_TOKEN: (payload: {
            network: import("./types").Network;
            walletId: string;
            symbol: string;
        }) => void;
        CREATE_ACCOUNT: (payload: {
            network: import("./types").Network;
            walletId: string;
            account: import("./types").Account;
        }) => void;
        UPDATE_ACCOUNT: (payload: {
            network: import("./types").Network;
            walletId: string;
            account: import("./types").Account;
        }) => void;
        REMOVE_ACCOUNT: (payload: {
            walletId: string;
            id: string;
            network: import("./types").Network;
        }) => void;
        UPDATE_ACCOUNT_ADDRESSES: (payload: {
            network: import("./types").Network;
            accountId: string;
            walletId: string;
            addresses: string[];
        }) => void;
        SET_USB_BRIDGE_WINDOWS_ID: (payload: {
            id: number;
        }) => void;
        SET_EXTERNAL_CONNECTION_DEFAULT: (payload: {
            origin: string;
            activeWalletId: string;
            accountId: string;
        }) => void;
        ADD_EXTERNAL_CONNECTION: (payload: {
            origin: string;
            activeWalletId: string;
            accountId: string;
            chain: import("@liquality/cryptoassets").ChainId;
        }) => void;
        REMOVE_EXTERNAL_CONNECTIONS: (payload: {
            activeWalletId: string;
        }) => void;
        SET_ANALYTICS_PREFERENCES: (payload: Partial<import("./types").AnalyticsState>) => void;
        UPDATE_NFTS: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            nfts: import("./types").NFT[];
        }) => void;
        NFT_TOGGLE_STARRED: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            nft: import("./types").NFT;
        }) => void;
        TOGGLE_EXPERIMENT: (payload: {
            name: import("./types").ExperimentType;
        }) => void;
        SET_WHATS_NEW_MODAL_VERSION: (payload: {
            version: string;
        }) => void;
        TOGGLE_BLOCKCHAIN: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            enable: boolean;
        }) => void;
        TOGGLE_ACCOUNT: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            enable: boolean;
        }) => void;
        LOG_ERROR: (payload: import("@liquality/error-parser").LiqualityErrorJSON) => void;
        CLEAR_ERROR_LOG: () => void;
        SET_CUSTOM_CHAIN_SETTINGS: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            chanifyNetwork: import("@chainify/types").Network;
        }) => void;
        REMOVE_CUSTOM_CHAIN_SETTINGS: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
        }) => void;
    };
    dispatch: {
        readonly acceptTermsAndConditions: (payload: {
            analyticsAccepted: boolean;
        }) => Promise<void>;
        readonly createAccount: (payload: {
            walletId: string;
            network: import("./types").Network;
            account: import("./types").Account;
        }) => Promise<import("./types").Account>;
        readonly removeAccount: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
        }) => Promise<string>;
        readonly toggleAccount: (payload: {
            network: import("./types").Network;
            walletId: string;
            accounts: string[];
            enable: boolean;
        }) => Promise<void>;
        readonly toggleBlockchain: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            enable: boolean;
        }) => Promise<void>;
        readonly updateAccount: (payload: {
            network: import("./types").Network;
            walletId: string;
            account: import("./types").Account;
        }) => Promise<{
            updatedAt: number;
            id: string;
            walletId: string;
            createdAt: number;
            enabled: boolean;
            derivationPath: string;
            chainCode?: string | undefined;
            publicKey?: string | undefined;
            nfts?: import("./types").NFT[] | undefined;
            type: import("./types").AccountType;
            name: string;
            alias?: string | undefined;
            chain: import("@liquality/cryptoassets").ChainId;
            index: number;
            addresses: string[];
            assets: string[];
            balances: Record<string, string>;
            color: string;
        }>;
        readonly addCustomToken: (payload: {
            network: import("./types").Network;
            walletId: string;
            chain: import("@liquality/cryptoassets").ChainId;
            symbol: string;
            name: string;
            contractAddress: string;
            decimals: number;
        }) => Promise<void>;
        readonly addExternalConnection: (payload: {
            origin: string;
            chain: import("@liquality/cryptoassets").ChainId;
            accountId: string;
            setDefaultEthereum: boolean;
        }) => Promise<void>;
        readonly initializeAnalyticsPreferences: (payload: {
            accepted: boolean;
        }) => Promise<void>;
        readonly updateAnalyticsPreferences: (payload: import("./types").AnalyticsState) => Promise<void>;
        readonly setAnalyticsResponse: (payload: {
            accepted: boolean;
        }) => Promise<void>;
        readonly initializeAnalytics: () => Promise<boolean>;
        readonly trackAnalytics: (payload: {
            event: string;
            properties: actions.AmplitudeProperties;
        }) => Promise<number> | Promise<undefined>;
        readonly changeActiveNetwork: (payload: {
            network: import("./types").Network;
        }) => Promise<void>;
        readonly changeActiveWalletId: (payload: {
            walletId: string;
        }) => Promise<void>;
        readonly changePassword: (payload: {
            key: string;
        }) => Promise<void>;
        readonly checkPendingActions: (payload: {
            walletId: string;
        }) => Promise<void>;
        readonly createWallet: (payload: {
            key: string;
            mnemonic: string;
            imported?: boolean | undefined;
        }) => Promise<import("./types").Wallet>;
        readonly disableAssets: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => Promise<void>;
        readonly disableEthereumInjection: () => Promise<void>;
        readonly enableAssets: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => Promise<void>;
        readonly enableEthereumInjection: () => Promise<void>;
        readonly exportPrivateKey: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
        }) => Promise<string>;
        readonly fetchTokenDetails: (payload: actions.FetchTokenDetailsRequest) => Promise<import("@chainify/types").Nullable<import("@chainify/types").TokenDetails>>;
        readonly forgetDappConnections: () => Promise<void>;
        readonly getLockForAsset: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            item: import("./types").BaseHistoryItem;
        }) => Promise<string>;
        readonly getQuotes: (payload: import("../swaps/types").GetQuotesRequest) => Promise<actions.GetQuotesResult>;
        readonly getSlowQuotes: (payload: {
            requestId: string;
        }) => Promise<import("../swaps/types").SwapQuote[]>;
        readonly getUnusedAddresses: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
            accountId: string;
        }) => Promise<string[]>;
        readonly getLedgerAccounts: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            accountType: import("./types").AccountType;
            startingIndex: number;
            numAccounts: number;
        }) => Promise<{
            account: string;
            index: number;
            exists: boolean;
        }[]>;
        readonly initializeAddresses: (payload: {
            network: import("./types").Network;
            walletId: string;
        }) => Promise<void>;
        readonly lockWallet: () => Promise<void>;
        readonly newSwap: (payload: {
            network: import("./types").Network;
            walletId: string;
            quote: import("../swaps/types").SwapQuote;
            fee: number;
            claimFee: number;
            feeLabel: import("./types").FeeLabel;
            claimFeeLabel: import("./types").FeeLabel;
        }) => Promise<import("./types").SwapHistoryItem>;
        readonly performNextAction: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
        }) => Promise<Partial<import("./types").HistoryItem> | undefined>;
        readonly proxyMutation: (payload: {
            type: string;
            payload: any;
        }) => Promise<void>;
        readonly removeCustomToken: (payload: {
            network: import("./types").Network;
            walletId: string;
            symbol: string;
        }) => Promise<void>;
        readonly retrySwap: (payload: {
            swap: import("./types").SwapHistoryItem;
        }) => Promise<Partial<import("./types").SwapHistoryItem> | undefined>;
        readonly sendNFTTransaction: (payload: import("./types").NFTSendTransactionParams) => Promise<import("@chainify/types").Transaction<any>>;
        readonly sendTransaction: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            asset: string;
            to: string;
            amount: import("bignumber.js").BigNumber;
            data: string;
            fee: number;
            feeAsset: string;
            gas: number;
            feeLabel: import("./types").FeeLabel;
            fiatRate: number;
        }) => Promise<import("./types").SendHistoryItem>;
        readonly setEthereumInjectionChain: (payload: {
            chain: import("@liquality/cryptoassets").ChainId;
        }) => Promise<void>;
        readonly setWhatsNewModalVersion: (payload: {
            version: string;
        }) => Promise<void>;
        readonly showNotification: (payload: import("../types").Notification) => Promise<void>;
        readonly toggleExperiment: (payload: {
            name: import("./types").ExperimentType;
        }) => Promise<void>;
        readonly toggleNFTStarred: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            nft: import("./types").NFT;
        }) => Promise<void>;
        readonly unlockWallet: (payload: {
            key: string;
        }) => Promise<void>;
        readonly updateAccountBalance: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
        }) => Promise<void>;
        readonly updateBalances: (payload: {
            walletId: string;
            network: import("./types").Network;
            accountIds?: string[] | undefined;
        }) => Promise<void>;
        readonly updateCurrenciesInfo: (payload: {
            assets: string[];
        }) => Promise<import("./types").CurrenciesInfo>;
        readonly updateFees: (payload: {
            asset: string;
        }) => Promise<import("@chainify/types").FeeDetails>;
        readonly updateFiatRates: (payload: {
            assets: string[];
        }) => Promise<import("./types").FiatRates>;
        readonly updateMarketData: (payload: {
            network: import("./types").Network;
        }) => Promise<{
            network: import("./types").Network;
            marketData: import("./types").MarketData[];
        }>;
        readonly updateNFTs: (payload: {
            walletId: string;
            network: import("./types").Network;
            accountIds: string[];
        }) => Promise<import("./types").NFT[][]>;
        readonly updateTransactionFee: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            id: string;
            hash: string;
            newFee: number;
        }) => Promise<import("@chainify/types").Transaction<any>>;
        readonly logError: (payload: import("@liquality/error-parser").LiqualityErrorJSON) => Promise<void>;
        readonly clearErrorLog: () => Promise<void>;
        readonly saveCustomChainSettings: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            chanifyNetwork: import("@chainify/types").Network;
        }) => Promise<void>;
        readonly removeCustomChainSettings: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
        }) => Promise<void>;
    };
    original: {
        readonly state: {
            readonly version: number;
            readonly key: string;
            readonly wallets: import("./types").Wallet[];
            readonly unlockedAt: number;
            readonly brokerReady: boolean;
            readonly encryptedWallets: string;
            readonly enabledAssets: {
                mainnet?: Record<string, string[]> | undefined;
                testnet?: Record<string, string[]> | undefined;
            };
            readonly customTokens: {
                mainnet?: Record<string, import("./types").CustomToken[]> | undefined;
                testnet?: Record<string, import("./types").CustomToken[]> | undefined;
            };
            readonly accounts: {
                [x: string]: Record<import("./types").Network, import("./types").Account[]> | undefined;
            };
            readonly fiatRates: {
                [x: string]: number;
            };
            readonly currenciesInfo: {
                [x: string]: import("bignumber.js").BigNumber;
            };
            readonly fees: {
                mainnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                testnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
            };
            readonly history: {
                mainnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                testnet?: Record<string, import("./types").HistoryItem[]> | undefined;
            };
            readonly marketData: {
                mainnet?: import("./types").MarketData[] | undefined;
                testnet?: import("./types").MarketData[] | undefined;
            };
            readonly activeNetwork: import("./types").Network;
            readonly activeWalletId: string;
            readonly keyUpdatedAt: number;
            readonly keySalt: string;
            readonly termsAcceptedAt: number;
            readonly setupAt: number;
            readonly injectEthereum: boolean;
            readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
            readonly usbBridgeWindowsId: number;
            readonly externalConnections: {
                [x: string]: Record<string, import("./types").Connections>;
            };
            readonly rskLegacyDerivation: boolean;
            readonly analytics: {
                userId: string;
                acceptedDate: number;
                askedDate: number;
                askedTimes: number;
                notAskAgain: boolean;
            };
            readonly experiments: {
                manageAccounts?: boolean | undefined;
                reportErrors?: boolean | undefined;
            };
            readonly whatsNewModalVersion: string;
            readonly enabledChains: {
                [x: string]: Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]> | undefined;
            };
            readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
            readonly customChainSeetings: {
                mainnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                testnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
            };
        };
        readonly getters: any;
        replaceState: (state: {
            readonly version: number;
            readonly key: string;
            readonly wallets: import("./types").Wallet[];
            readonly unlockedAt: number;
            readonly brokerReady: boolean;
            readonly encryptedWallets: string;
            readonly enabledAssets: {
                mainnet?: Record<string, string[]> | undefined;
                testnet?: Record<string, string[]> | undefined;
            };
            readonly customTokens: {
                mainnet?: Record<string, import("./types").CustomToken[]> | undefined;
                testnet?: Record<string, import("./types").CustomToken[]> | undefined;
            };
            readonly accounts: {
                [x: string]: Record<import("./types").Network, import("./types").Account[]> | undefined;
            };
            readonly fiatRates: {
                [x: string]: number;
            };
            readonly currenciesInfo: {
                [x: string]: import("bignumber.js").BigNumber;
            };
            readonly fees: {
                mainnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                testnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
            };
            readonly history: {
                mainnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                testnet?: Record<string, import("./types").HistoryItem[]> | undefined;
            };
            readonly marketData: {
                mainnet?: import("./types").MarketData[] | undefined;
                testnet?: import("./types").MarketData[] | undefined;
            };
            readonly activeNetwork: import("./types").Network;
            readonly activeWalletId: string;
            readonly keyUpdatedAt: number;
            readonly keySalt: string;
            readonly termsAcceptedAt: number;
            readonly setupAt: number;
            readonly injectEthereum: boolean;
            readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
            readonly usbBridgeWindowsId: number;
            readonly externalConnections: {
                [x: string]: Record<string, import("./types").Connections>;
            };
            readonly rskLegacyDerivation: boolean;
            readonly analytics: {
                userId: string;
                acceptedDate: number;
                askedDate: number;
                askedTimes: number;
                notAskAgain: boolean;
            };
            readonly experiments: {
                manageAccounts?: boolean | undefined;
                reportErrors?: boolean | undefined;
            };
            readonly whatsNewModalVersion: string;
            readonly enabledChains: {
                [x: string]: Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]> | undefined;
            };
            readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
            readonly customChainSeetings: {
                mainnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                testnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
            };
        }) => void;
        dispatch: import("vuex").Dispatch;
        commit: import("vuex").Commit;
        subscribe: <P extends import("vuex").MutationPayload>(fn: (mutation: P, state: {
            readonly version: number;
            readonly key: string;
            readonly wallets: import("./types").Wallet[];
            readonly unlockedAt: number;
            readonly brokerReady: boolean;
            readonly encryptedWallets: string;
            readonly enabledAssets: {
                mainnet?: Record<string, string[]> | undefined;
                testnet?: Record<string, string[]> | undefined;
            };
            readonly customTokens: {
                mainnet?: Record<string, import("./types").CustomToken[]> | undefined;
                testnet?: Record<string, import("./types").CustomToken[]> | undefined;
            };
            readonly accounts: {
                [x: string]: Record<import("./types").Network, import("./types").Account[]> | undefined;
            };
            readonly fiatRates: {
                [x: string]: number;
            };
            readonly currenciesInfo: {
                [x: string]: import("bignumber.js").BigNumber;
            };
            readonly fees: {
                mainnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                testnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
            };
            readonly history: {
                mainnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                testnet?: Record<string, import("./types").HistoryItem[]> | undefined;
            };
            readonly marketData: {
                mainnet?: import("./types").MarketData[] | undefined;
                testnet?: import("./types").MarketData[] | undefined;
            };
            readonly activeNetwork: import("./types").Network;
            readonly activeWalletId: string;
            readonly keyUpdatedAt: number;
            readonly keySalt: string;
            readonly termsAcceptedAt: number;
            readonly setupAt: number;
            readonly injectEthereum: boolean;
            readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
            readonly usbBridgeWindowsId: number;
            readonly externalConnections: {
                [x: string]: Record<string, import("./types").Connections>;
            };
            readonly rskLegacyDerivation: boolean;
            readonly analytics: {
                userId: string;
                acceptedDate: number;
                askedDate: number;
                askedTimes: number;
                notAskAgain: boolean;
            };
            readonly experiments: {
                manageAccounts?: boolean | undefined;
                reportErrors?: boolean | undefined;
            };
            readonly whatsNewModalVersion: string;
            readonly enabledChains: {
                [x: string]: Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]> | undefined;
            };
            readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
            readonly customChainSeetings: {
                mainnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                testnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
            };
        }) => any, options?: import("vuex").SubscribeOptions | undefined) => () => void;
        subscribeAction: <P_1 extends import("vuex").ActionPayload>(fn: import("vuex").SubscribeActionOptions<P_1, {
            readonly version: number;
            readonly key: string;
            readonly wallets: import("./types").Wallet[];
            readonly unlockedAt: number;
            readonly brokerReady: boolean;
            readonly encryptedWallets: string;
            readonly enabledAssets: {
                mainnet?: Record<string, string[]> | undefined;
                testnet?: Record<string, string[]> | undefined;
            };
            readonly customTokens: {
                mainnet?: Record<string, import("./types").CustomToken[]> | undefined;
                testnet?: Record<string, import("./types").CustomToken[]> | undefined;
            };
            readonly accounts: {
                [x: string]: Record<import("./types").Network, import("./types").Account[]> | undefined;
            };
            readonly fiatRates: {
                [x: string]: number;
            };
            readonly currenciesInfo: {
                [x: string]: import("bignumber.js").BigNumber;
            };
            readonly fees: {
                mainnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                testnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
            };
            readonly history: {
                mainnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                testnet?: Record<string, import("./types").HistoryItem[]> | undefined;
            };
            readonly marketData: {
                mainnet?: import("./types").MarketData[] | undefined;
                testnet?: import("./types").MarketData[] | undefined;
            };
            readonly activeNetwork: import("./types").Network;
            readonly activeWalletId: string;
            readonly keyUpdatedAt: number;
            readonly keySalt: string;
            readonly termsAcceptedAt: number;
            readonly setupAt: number;
            readonly injectEthereum: boolean;
            readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
            readonly usbBridgeWindowsId: number;
            readonly externalConnections: {
                [x: string]: Record<string, import("./types").Connections>;
            };
            readonly rskLegacyDerivation: boolean;
            readonly analytics: {
                userId: string;
                acceptedDate: number;
                askedDate: number;
                askedTimes: number;
                notAskAgain: boolean;
            };
            readonly experiments: {
                manageAccounts?: boolean | undefined;
                reportErrors?: boolean | undefined;
            };
            readonly whatsNewModalVersion: string;
            readonly enabledChains: {
                [x: string]: Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]> | undefined;
            };
            readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
            readonly customChainSeetings: {
                mainnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                testnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
            };
        }>, options?: import("vuex").SubscribeOptions | undefined) => () => void;
        watch: <T>(getter: (state: {
            readonly version: number;
            readonly key: string;
            readonly wallets: import("./types").Wallet[];
            readonly unlockedAt: number;
            readonly brokerReady: boolean;
            readonly encryptedWallets: string;
            readonly enabledAssets: {
                mainnet?: Record<string, string[]> | undefined;
                testnet?: Record<string, string[]> | undefined;
            };
            readonly customTokens: {
                mainnet?: Record<string, import("./types").CustomToken[]> | undefined;
                testnet?: Record<string, import("./types").CustomToken[]> | undefined;
            };
            readonly accounts: {
                [x: string]: Record<import("./types").Network, import("./types").Account[]> | undefined;
            };
            readonly fiatRates: {
                [x: string]: number;
            };
            readonly currenciesInfo: {
                [x: string]: import("bignumber.js").BigNumber;
            };
            readonly fees: {
                mainnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                testnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
            };
            readonly history: {
                mainnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                testnet?: Record<string, import("./types").HistoryItem[]> | undefined;
            };
            readonly marketData: {
                mainnet?: import("./types").MarketData[] | undefined;
                testnet?: import("./types").MarketData[] | undefined;
            };
            readonly activeNetwork: import("./types").Network;
            readonly activeWalletId: string;
            readonly keyUpdatedAt: number;
            readonly keySalt: string;
            readonly termsAcceptedAt: number;
            readonly setupAt: number;
            readonly injectEthereum: boolean;
            readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
            readonly usbBridgeWindowsId: number;
            readonly externalConnections: {
                [x: string]: Record<string, import("./types").Connections>;
            };
            readonly rskLegacyDerivation: boolean;
            readonly analytics: {
                userId: string;
                acceptedDate: number;
                askedDate: number;
                askedTimes: number;
                notAskAgain: boolean;
            };
            readonly experiments: {
                manageAccounts?: boolean | undefined;
                reportErrors?: boolean | undefined;
            };
            readonly whatsNewModalVersion: string;
            readonly enabledChains: {
                [x: string]: Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]> | undefined;
            };
            readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
            readonly customChainSeetings: {
                mainnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                testnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
            };
        }, getters: any) => T, cb: (value: T, oldValue: T) => void, options?: import("vue").WatchOptions | undefined) => () => void;
        registerModule: {
            <T_1>(path: string, module: import("vuex").Module<T_1, {
                readonly version: number;
                readonly key: string;
                readonly wallets: import("./types").Wallet[];
                readonly unlockedAt: number;
                readonly brokerReady: boolean;
                readonly encryptedWallets: string;
                readonly enabledAssets: {
                    mainnet?: Record<string, string[]> | undefined;
                    testnet?: Record<string, string[]> | undefined;
                };
                readonly customTokens: {
                    mainnet?: Record<string, import("./types").CustomToken[]> | undefined;
                    testnet?: Record<string, import("./types").CustomToken[]> | undefined;
                };
                readonly accounts: {
                    [x: string]: Record<import("./types").Network, import("./types").Account[]> | undefined;
                };
                readonly fiatRates: {
                    [x: string]: number;
                };
                readonly currenciesInfo: {
                    [x: string]: import("bignumber.js").BigNumber;
                };
                readonly fees: {
                    mainnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                    testnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                };
                readonly history: {
                    mainnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                    testnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                };
                readonly marketData: {
                    mainnet?: import("./types").MarketData[] | undefined;
                    testnet?: import("./types").MarketData[] | undefined;
                };
                readonly activeNetwork: import("./types").Network;
                readonly activeWalletId: string;
                readonly keyUpdatedAt: number;
                readonly keySalt: string;
                readonly termsAcceptedAt: number;
                readonly setupAt: number;
                readonly injectEthereum: boolean;
                readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
                readonly usbBridgeWindowsId: number;
                readonly externalConnections: {
                    [x: string]: Record<string, import("./types").Connections>;
                };
                readonly rskLegacyDerivation: boolean;
                readonly analytics: {
                    userId: string;
                    acceptedDate: number;
                    askedDate: number;
                    askedTimes: number;
                    notAskAgain: boolean;
                };
                readonly experiments: {
                    manageAccounts?: boolean | undefined;
                    reportErrors?: boolean | undefined;
                };
                readonly whatsNewModalVersion: string;
                readonly enabledChains: {
                    [x: string]: Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]> | undefined;
                };
                readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
                readonly customChainSeetings: {
                    mainnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                    testnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                };
            }>, options?: import("vuex").ModuleOptions | undefined): void;
            <T_2>(path: string[], module: import("vuex").Module<T_2, {
                readonly version: number;
                readonly key: string;
                readonly wallets: import("./types").Wallet[];
                readonly unlockedAt: number;
                readonly brokerReady: boolean;
                readonly encryptedWallets: string;
                readonly enabledAssets: {
                    mainnet?: Record<string, string[]> | undefined;
                    testnet?: Record<string, string[]> | undefined;
                };
                readonly customTokens: {
                    mainnet?: Record<string, import("./types").CustomToken[]> | undefined;
                    testnet?: Record<string, import("./types").CustomToken[]> | undefined;
                };
                readonly accounts: {
                    [x: string]: Record<import("./types").Network, import("./types").Account[]> | undefined;
                };
                readonly fiatRates: {
                    [x: string]: number;
                };
                readonly currenciesInfo: {
                    [x: string]: import("bignumber.js").BigNumber;
                };
                readonly fees: {
                    mainnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                    testnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                };
                readonly history: {
                    mainnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                    testnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                };
                readonly marketData: {
                    mainnet?: import("./types").MarketData[] | undefined;
                    testnet?: import("./types").MarketData[] | undefined;
                };
                readonly activeNetwork: import("./types").Network;
                readonly activeWalletId: string;
                readonly keyUpdatedAt: number;
                readonly keySalt: string;
                readonly termsAcceptedAt: number;
                readonly setupAt: number;
                readonly injectEthereum: boolean;
                readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
                readonly usbBridgeWindowsId: number;
                readonly externalConnections: {
                    [x: string]: Record<string, import("./types").Connections>;
                };
                readonly rskLegacyDerivation: boolean;
                readonly analytics: {
                    userId: string;
                    acceptedDate: number;
                    askedDate: number;
                    askedTimes: number;
                    notAskAgain: boolean;
                };
                readonly experiments: {
                    manageAccounts?: boolean | undefined;
                    reportErrors?: boolean | undefined;
                };
                readonly whatsNewModalVersion: string;
                readonly enabledChains: {
                    [x: string]: Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]> | undefined;
                };
                readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
                readonly customChainSeetings: {
                    mainnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                    testnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                };
            }>, options?: import("vuex").ModuleOptions | undefined): void;
        };
        unregisterModule: {
            (path: string): void;
            (path: string[]): void;
        };
        hasModule: {
            (path: string): boolean;
            (path: string[]): boolean;
        };
        hotUpdate: (options: {
            actions?: import("vuex").ActionTree<{
                readonly version: number;
                readonly key: string;
                readonly wallets: import("./types").Wallet[];
                readonly unlockedAt: number;
                readonly brokerReady: boolean;
                readonly encryptedWallets: string;
                readonly enabledAssets: {
                    mainnet?: Record<string, string[]> | undefined;
                    testnet?: Record<string, string[]> | undefined;
                };
                readonly customTokens: {
                    mainnet?: Record<string, import("./types").CustomToken[]> | undefined;
                    testnet?: Record<string, import("./types").CustomToken[]> | undefined;
                };
                readonly accounts: {
                    [x: string]: Record<import("./types").Network, import("./types").Account[]> | undefined;
                };
                readonly fiatRates: {
                    [x: string]: number;
                };
                readonly currenciesInfo: {
                    [x: string]: import("bignumber.js").BigNumber;
                };
                readonly fees: {
                    mainnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                    testnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                };
                readonly history: {
                    mainnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                    testnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                };
                readonly marketData: {
                    mainnet?: import("./types").MarketData[] | undefined;
                    testnet?: import("./types").MarketData[] | undefined;
                };
                readonly activeNetwork: import("./types").Network;
                readonly activeWalletId: string;
                readonly keyUpdatedAt: number;
                readonly keySalt: string;
                readonly termsAcceptedAt: number;
                readonly setupAt: number;
                readonly injectEthereum: boolean;
                readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
                readonly usbBridgeWindowsId: number;
                readonly externalConnections: {
                    [x: string]: Record<string, import("./types").Connections>;
                };
                readonly rskLegacyDerivation: boolean;
                readonly analytics: {
                    userId: string;
                    acceptedDate: number;
                    askedDate: number;
                    askedTimes: number;
                    notAskAgain: boolean;
                };
                readonly experiments: {
                    manageAccounts?: boolean | undefined;
                    reportErrors?: boolean | undefined;
                };
                readonly whatsNewModalVersion: string;
                readonly enabledChains: {
                    [x: string]: Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]> | undefined;
                };
                readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
                readonly customChainSeetings: {
                    mainnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                    testnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                };
            }, {
                readonly version: number;
                readonly key: string;
                readonly wallets: import("./types").Wallet[];
                readonly unlockedAt: number;
                readonly brokerReady: boolean;
                readonly encryptedWallets: string;
                readonly enabledAssets: {
                    mainnet?: Record<string, string[]> | undefined;
                    testnet?: Record<string, string[]> | undefined;
                };
                readonly customTokens: {
                    mainnet?: Record<string, import("./types").CustomToken[]> | undefined;
                    testnet?: Record<string, import("./types").CustomToken[]> | undefined;
                };
                readonly accounts: {
                    [x: string]: Record<import("./types").Network, import("./types").Account[]> | undefined;
                };
                readonly fiatRates: {
                    [x: string]: number;
                };
                readonly currenciesInfo: {
                    [x: string]: import("bignumber.js").BigNumber;
                };
                readonly fees: {
                    mainnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                    testnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                };
                readonly history: {
                    mainnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                    testnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                };
                readonly marketData: {
                    mainnet?: import("./types").MarketData[] | undefined;
                    testnet?: import("./types").MarketData[] | undefined;
                };
                readonly activeNetwork: import("./types").Network;
                readonly activeWalletId: string;
                readonly keyUpdatedAt: number;
                readonly keySalt: string;
                readonly termsAcceptedAt: number;
                readonly setupAt: number;
                readonly injectEthereum: boolean;
                readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
                readonly usbBridgeWindowsId: number;
                readonly externalConnections: {
                    [x: string]: Record<string, import("./types").Connections>;
                };
                readonly rskLegacyDerivation: boolean;
                readonly analytics: {
                    userId: string;
                    acceptedDate: number;
                    askedDate: number;
                    askedTimes: number;
                    notAskAgain: boolean;
                };
                readonly experiments: {
                    manageAccounts?: boolean | undefined;
                    reportErrors?: boolean | undefined;
                };
                readonly whatsNewModalVersion: string;
                readonly enabledChains: {
                    [x: string]: Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]> | undefined;
                };
                readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
                readonly customChainSeetings: {
                    mainnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                    testnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                };
            }> | undefined;
            mutations?: import("vuex").MutationTree<{
                readonly version: number;
                readonly key: string;
                readonly wallets: import("./types").Wallet[];
                readonly unlockedAt: number;
                readonly brokerReady: boolean;
                readonly encryptedWallets: string;
                readonly enabledAssets: {
                    mainnet?: Record<string, string[]> | undefined;
                    testnet?: Record<string, string[]> | undefined;
                };
                readonly customTokens: {
                    mainnet?: Record<string, import("./types").CustomToken[]> | undefined;
                    testnet?: Record<string, import("./types").CustomToken[]> | undefined;
                };
                readonly accounts: {
                    [x: string]: Record<import("./types").Network, import("./types").Account[]> | undefined;
                };
                readonly fiatRates: {
                    [x: string]: number;
                };
                readonly currenciesInfo: {
                    [x: string]: import("bignumber.js").BigNumber;
                };
                readonly fees: {
                    mainnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                    testnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                };
                readonly history: {
                    mainnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                    testnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                };
                readonly marketData: {
                    mainnet?: import("./types").MarketData[] | undefined;
                    testnet?: import("./types").MarketData[] | undefined;
                };
                readonly activeNetwork: import("./types").Network;
                readonly activeWalletId: string;
                readonly keyUpdatedAt: number;
                readonly keySalt: string;
                readonly termsAcceptedAt: number;
                readonly setupAt: number;
                readonly injectEthereum: boolean;
                readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
                readonly usbBridgeWindowsId: number;
                readonly externalConnections: {
                    [x: string]: Record<string, import("./types").Connections>;
                };
                readonly rskLegacyDerivation: boolean;
                readonly analytics: {
                    userId: string;
                    acceptedDate: number;
                    askedDate: number;
                    askedTimes: number;
                    notAskAgain: boolean;
                };
                readonly experiments: {
                    manageAccounts?: boolean | undefined;
                    reportErrors?: boolean | undefined;
                };
                readonly whatsNewModalVersion: string;
                readonly enabledChains: {
                    [x: string]: Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]> | undefined;
                };
                readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
                readonly customChainSeetings: {
                    mainnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                    testnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                };
            }> | undefined;
            getters?: import("vuex").GetterTree<{
                readonly version: number;
                readonly key: string;
                readonly wallets: import("./types").Wallet[];
                readonly unlockedAt: number;
                readonly brokerReady: boolean;
                readonly encryptedWallets: string;
                readonly enabledAssets: {
                    mainnet?: Record<string, string[]> | undefined;
                    testnet?: Record<string, string[]> | undefined;
                };
                readonly customTokens: {
                    mainnet?: Record<string, import("./types").CustomToken[]> | undefined;
                    testnet?: Record<string, import("./types").CustomToken[]> | undefined;
                };
                readonly accounts: {
                    [x: string]: Record<import("./types").Network, import("./types").Account[]> | undefined;
                };
                readonly fiatRates: {
                    [x: string]: number;
                };
                readonly currenciesInfo: {
                    [x: string]: import("bignumber.js").BigNumber;
                };
                readonly fees: {
                    mainnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                    testnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                };
                readonly history: {
                    mainnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                    testnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                };
                readonly marketData: {
                    mainnet?: import("./types").MarketData[] | undefined;
                    testnet?: import("./types").MarketData[] | undefined;
                };
                readonly activeNetwork: import("./types").Network;
                readonly activeWalletId: string;
                readonly keyUpdatedAt: number;
                readonly keySalt: string;
                readonly termsAcceptedAt: number;
                readonly setupAt: number;
                readonly injectEthereum: boolean;
                readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
                readonly usbBridgeWindowsId: number;
                readonly externalConnections: {
                    [x: string]: Record<string, import("./types").Connections>;
                };
                readonly rskLegacyDerivation: boolean;
                readonly analytics: {
                    userId: string;
                    acceptedDate: number;
                    askedDate: number;
                    askedTimes: number;
                    notAskAgain: boolean;
                };
                readonly experiments: {
                    manageAccounts?: boolean | undefined;
                    reportErrors?: boolean | undefined;
                };
                readonly whatsNewModalVersion: string;
                readonly enabledChains: {
                    [x: string]: Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]> | undefined;
                };
                readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
                readonly customChainSeetings: {
                    mainnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                    testnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                };
            }, {
                readonly version: number;
                readonly key: string;
                readonly wallets: import("./types").Wallet[];
                readonly unlockedAt: number;
                readonly brokerReady: boolean;
                readonly encryptedWallets: string;
                readonly enabledAssets: {
                    mainnet?: Record<string, string[]> | undefined;
                    testnet?: Record<string, string[]> | undefined;
                };
                readonly customTokens: {
                    mainnet?: Record<string, import("./types").CustomToken[]> | undefined;
                    testnet?: Record<string, import("./types").CustomToken[]> | undefined;
                };
                readonly accounts: {
                    [x: string]: Record<import("./types").Network, import("./types").Account[]> | undefined;
                };
                readonly fiatRates: {
                    [x: string]: number;
                };
                readonly currenciesInfo: {
                    [x: string]: import("bignumber.js").BigNumber;
                };
                readonly fees: {
                    mainnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                    testnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                };
                readonly history: {
                    mainnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                    testnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                };
                readonly marketData: {
                    mainnet?: import("./types").MarketData[] | undefined;
                    testnet?: import("./types").MarketData[] | undefined;
                };
                readonly activeNetwork: import("./types").Network;
                readonly activeWalletId: string;
                readonly keyUpdatedAt: number;
                readonly keySalt: string;
                readonly termsAcceptedAt: number;
                readonly setupAt: number;
                readonly injectEthereum: boolean;
                readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
                readonly usbBridgeWindowsId: number;
                readonly externalConnections: {
                    [x: string]: Record<string, import("./types").Connections>;
                };
                readonly rskLegacyDerivation: boolean;
                readonly analytics: {
                    userId: string;
                    acceptedDate: number;
                    askedDate: number;
                    askedTimes: number;
                    notAskAgain: boolean;
                };
                readonly experiments: {
                    manageAccounts?: boolean | undefined;
                    reportErrors?: boolean | undefined;
                };
                readonly whatsNewModalVersion: string;
                readonly enabledChains: {
                    [x: string]: Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]> | undefined;
                };
                readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
                readonly customChainSeetings: {
                    mainnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                    testnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                };
            }> | undefined;
            modules?: import("vuex").ModuleTree<{
                readonly version: number;
                readonly key: string;
                readonly wallets: import("./types").Wallet[];
                readonly unlockedAt: number;
                readonly brokerReady: boolean;
                readonly encryptedWallets: string;
                readonly enabledAssets: {
                    mainnet?: Record<string, string[]> | undefined;
                    testnet?: Record<string, string[]> | undefined;
                };
                readonly customTokens: {
                    mainnet?: Record<string, import("./types").CustomToken[]> | undefined;
                    testnet?: Record<string, import("./types").CustomToken[]> | undefined;
                };
                readonly accounts: {
                    [x: string]: Record<import("./types").Network, import("./types").Account[]> | undefined;
                };
                readonly fiatRates: {
                    [x: string]: number;
                };
                readonly currenciesInfo: {
                    [x: string]: import("bignumber.js").BigNumber;
                };
                readonly fees: {
                    mainnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                    testnet?: Record<string, Record<string, import("@chainify/types").FeeDetails>> | undefined;
                };
                readonly history: {
                    mainnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                    testnet?: Record<string, import("./types").HistoryItem[]> | undefined;
                };
                readonly marketData: {
                    mainnet?: import("./types").MarketData[] | undefined;
                    testnet?: import("./types").MarketData[] | undefined;
                };
                readonly activeNetwork: import("./types").Network;
                readonly activeWalletId: string;
                readonly keyUpdatedAt: number;
                readonly keySalt: string;
                readonly termsAcceptedAt: number;
                readonly setupAt: number;
                readonly injectEthereum: boolean;
                readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
                readonly usbBridgeWindowsId: number;
                readonly externalConnections: {
                    [x: string]: Record<string, import("./types").Connections>;
                };
                readonly rskLegacyDerivation: boolean;
                readonly analytics: {
                    userId: string;
                    acceptedDate: number;
                    askedDate: number;
                    askedTimes: number;
                    notAskAgain: boolean;
                };
                readonly experiments: {
                    manageAccounts?: boolean | undefined;
                    reportErrors?: boolean | undefined;
                };
                readonly whatsNewModalVersion: string;
                readonly enabledChains: {
                    [x: string]: Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]> | undefined;
                };
                readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
                readonly customChainSeetings: {
                    mainnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                    testnet?: Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>> | undefined;
                };
            }> | undefined;
        }) => void;
        direct: any;
    };
}, rootActionContext: (originalContext: _ActionContext<any, any>) => {
    rootState: {
        readonly version: number;
        readonly key: string;
        readonly wallets: import("./types").Wallet[];
        readonly unlockedAt: number;
        readonly brokerReady: boolean;
        readonly encryptedWallets: string;
        readonly enabledAssets: Partial<Record<import("./types").Network, Record<string, string[]>>>;
        readonly customTokens: Partial<Record<import("./types").Network, Record<string, import("./types").CustomToken[]>>>;
        readonly accounts: Partial<Record<string, Record<import("./types").Network, import("./types").Account[]>>>;
        readonly fiatRates: import("./types").FiatRates;
        readonly currenciesInfo: import("./types").CurrenciesInfo;
        readonly fees: Partial<Record<import("./types").Network, Record<string, Record<string, import("@chainify/types").FeeDetails>>>>;
        readonly history: Partial<Record<import("./types").Network, Record<string, import("./types").HistoryItem[]>>>;
        readonly marketData: Partial<Record<import("./types").Network, import("./types").MarketData[]>>;
        readonly activeNetwork: import("./types").Network;
        readonly activeWalletId: string;
        readonly keyUpdatedAt: number;
        readonly keySalt: string;
        readonly termsAcceptedAt: number;
        readonly setupAt: number;
        readonly injectEthereum: boolean;
        readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
        readonly usbBridgeWindowsId: number;
        readonly externalConnections: import("./types").ExternalConnections;
        readonly rskLegacyDerivation: boolean;
        readonly analytics: import("./types").AnalyticsState;
        readonly experiments: Partial<Record<import("./types").ExperimentType, boolean>>;
        readonly whatsNewModalVersion: string;
        readonly enabledChains: Partial<Record<string, Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]>>>;
        readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
        readonly customChainSeetings: Partial<Record<import("./types").Network, Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>>>>;
    };
    rootGetters: {
        readonly client: ({ network, walletId, chainId, accountId, useCache, accountType, accountIndex, }: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            accountId?: string | undefined;
            useCache?: boolean | undefined;
            accountType?: import("./types").AccountType | undefined;
            accountIndex?: number | undefined;
        }) => import("@chainify/client").Client<import("@chainify/client").Chain<any, import("@chainify/types").Network>, import("@chainify/client").Wallet<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
        readonly historyItemById: (network: import("./types").Network, walletId: string, id: string) => import("./types").HistoryItem | undefined;
        readonly cryptoassets: Readonly<{
            [asset: string]: import("@liquality/cryptoassets").IAsset;
        }>;
        readonly networkAccounts: readonly import("./types").Account[];
        readonly networkAssets: readonly string[];
        readonly allNetworkAssets: readonly string[];
        readonly activity: readonly import("./types").HistoryItem[];
        readonly totalFiatBalance: Readonly<import("bignumber.js").BigNumber>;
        readonly accountItem: (accountId: string) => import("./types").Account | undefined;
        readonly suggestedFeePrices: (asset: string) => import("@chainify/types").FeeDetails | undefined;
        readonly accountsWithBalance: readonly import("./types").Account[];
        readonly accountsData: readonly import("./types").Account[];
        readonly accountFiatBalance: (walletId: string, network: import("./types").Network, accountId: string) => import("bignumber.js").BigNumber;
        readonly assetFiatBalance: (asset: string, balance: import("bignumber.js").BigNumber) => import("bignumber.js").BigNumber | null;
        readonly assetMarketCap: (asset: string) => import("@chainify/types").Nullable<import("bignumber.js").BigNumber>;
        readonly chainAssets: Readonly<{
            bitcoin?: string[] | undefined;
            ethereum?: string[] | undefined;
            rsk?: string[] | undefined;
            bsc?: string[] | undefined;
            near?: string[] | undefined;
            polygon?: string[] | undefined;
            arbitrum?: string[] | undefined;
            solana?: string[] | undefined;
            fuse?: string[] | undefined;
            terra?: string[] | undefined;
            avalanche?: string[] | undefined;
            optimism?: string[] | undefined;
        }>;
        readonly analyticsEnabled: Readonly<boolean>;
        readonly allNftCollections: Readonly<import("./types").NFTCollections<import("./types").NFTWithAccount>>;
        readonly accountNftCollections: (accountId: string) => import("./types").NFTCollections<import("./types").NFT>;
        readonly mergedChainSettings: Readonly<Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>>;
        readonly chainSettings: readonly {
            chain: string;
            asset: string;
            network: import("../types").ChainifyNetwork;
        }[];
    };
    rootCommit: {
        SET_STATE: (payload: {
            newState: RootState;
        }) => void;
        CREATE_WALLET: (payload: {
            key: string;
            keySalt: string;
            encryptedWallets: string;
            wallet: import("./types").Wallet;
        }) => void;
        ACCEPT_TNC: () => void;
        CHANGE_ACTIVE_WALLETID: (payload: {
            walletId: string;
        }) => void;
        CHANGE_ACTIVE_NETWORK: (payload: {
            network: import("./types").Network;
        }) => void;
        CHANGE_PASSWORD: (payload: {
            key: string;
            keySalt: string;
            encryptedWallets: string;
        }) => void;
        LOCK_WALLET: () => void;
        UNLOCK_WALLET: (payload: {
            key: string;
            wallets: import("./types").Wallet[];
            unlockedAt: number;
        }) => void;
        NEW_SWAP: (payload: {
            network: import("./types").Network;
            walletId: string;
            swap: import("./types").SwapHistoryItem;
        }) => void;
        NEW_TRASACTION: (payload: {
            network: import("./types").Network;
            walletId: string;
            transaction: import("./types").SendHistoryItem;
        }) => void;
        NEW_NFT_TRASACTION: (payload: {
            network: import("./types").Network;
            walletId: string;
            transaction: import("./types").NFTSendHistoryItem;
        }) => void;
        UPDATE_HISTORY: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
            updates: Partial<import("./types").HistoryItem>;
        }) => void;
        REMOVE_ORDER: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
        }) => void;
        UPDATE_BALANCE: (payload: {
            network: import("./types").Network;
            accountId: string;
            walletId: string;
            asset: string;
            balance: string;
        }) => void;
        UPDATE_MULTIPLE_BALANCES: (payload: {
            network: import("./types").Network;
            accountId: string;
            walletId: string;
            assets: string[];
            balances: import("@chainify/types").Nullable<string>[];
        }) => void;
        UPDATE_FEES: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            fees: import("@chainify/types").FeeDetails;
        }) => void;
        UPDATE_FIAT_RATES: (payload: {
            fiatRates: import("./types").FiatRates;
        }) => void;
        UPDATE_CURRENCIES_INFO: (payload: {
            currenciesInfo: import("./types").CurrenciesInfo;
        }) => void;
        UPDATE_MARKET_DATA: (payload: {
            network: import("./types").Network;
            marketData: import("./types").MarketData[];
        }) => void;
        SET_ETHEREUM_INJECTION_CHAIN: (payload: {
            chain: import("@liquality/cryptoassets").ChainId;
        }) => void;
        ENABLE_ETHEREUM_INJECTION: () => void;
        DISABLE_ETHEREUM_INJECTION: () => void;
        ENABLE_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => void;
        DISABLE_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => void;
        DISABLE_ACCOUNT_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            assets: string[];
        }) => void;
        ENABLE_ACCOUNT_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            assets: string[];
        }) => void;
        ADD_CUSTOM_TOKEN: (payload: {
            network: import("./types").Network;
            walletId: string;
            customToken: import("./types").CustomToken;
        }) => void;
        REMOVE_CUSTOM_TOKEN: (payload: {
            network: import("./types").Network;
            walletId: string;
            symbol: string;
        }) => void;
        CREATE_ACCOUNT: (payload: {
            network: import("./types").Network;
            walletId: string;
            account: import("./types").Account;
        }) => void;
        UPDATE_ACCOUNT: (payload: {
            network: import("./types").Network;
            walletId: string;
            account: import("./types").Account;
        }) => void;
        REMOVE_ACCOUNT: (payload: {
            walletId: string;
            id: string;
            network: import("./types").Network;
        }) => void;
        UPDATE_ACCOUNT_ADDRESSES: (payload: {
            network: import("./types").Network;
            accountId: string;
            walletId: string;
            addresses: string[];
        }) => void;
        SET_USB_BRIDGE_WINDOWS_ID: (payload: {
            id: number;
        }) => void;
        SET_EXTERNAL_CONNECTION_DEFAULT: (payload: {
            origin: string;
            activeWalletId: string;
            accountId: string;
        }) => void;
        ADD_EXTERNAL_CONNECTION: (payload: {
            origin: string;
            activeWalletId: string;
            accountId: string;
            chain: import("@liquality/cryptoassets").ChainId;
        }) => void;
        REMOVE_EXTERNAL_CONNECTIONS: (payload: {
            activeWalletId: string;
        }) => void;
        SET_ANALYTICS_PREFERENCES: (payload: Partial<import("./types").AnalyticsState>) => void;
        UPDATE_NFTS: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            nfts: import("./types").NFT[];
        }) => void;
        NFT_TOGGLE_STARRED: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            nft: import("./types").NFT;
        }) => void;
        TOGGLE_EXPERIMENT: (payload: {
            name: import("./types").ExperimentType;
        }) => void;
        SET_WHATS_NEW_MODAL_VERSION: (payload: {
            version: string;
        }) => void;
        TOGGLE_BLOCKCHAIN: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            enable: boolean;
        }) => void;
        TOGGLE_ACCOUNT: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            enable: boolean;
        }) => void;
        LOG_ERROR: (payload: import("@liquality/error-parser").LiqualityErrorJSON) => void;
        CLEAR_ERROR_LOG: () => void;
        SET_CUSTOM_CHAIN_SETTINGS: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            chanifyNetwork: import("@chainify/types").Network;
        }) => void;
        REMOVE_CUSTOM_CHAIN_SETTINGS: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
        }) => void;
    };
    rootDispatch: {
        readonly acceptTermsAndConditions: (payload: {
            analyticsAccepted: boolean;
        }) => Promise<void>;
        readonly createAccount: (payload: {
            walletId: string;
            network: import("./types").Network;
            account: import("./types").Account;
        }) => Promise<import("./types").Account>;
        readonly removeAccount: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
        }) => Promise<string>;
        readonly toggleAccount: (payload: {
            network: import("./types").Network;
            walletId: string;
            accounts: string[];
            enable: boolean;
        }) => Promise<void>;
        readonly toggleBlockchain: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            enable: boolean;
        }) => Promise<void>;
        readonly updateAccount: (payload: {
            network: import("./types").Network;
            walletId: string;
            account: import("./types").Account;
        }) => Promise<{
            updatedAt: number;
            id: string;
            walletId: string;
            createdAt: number;
            enabled: boolean;
            derivationPath: string;
            chainCode?: string | undefined;
            publicKey?: string | undefined;
            nfts?: import("./types").NFT[] | undefined;
            type: import("./types").AccountType;
            name: string;
            alias?: string | undefined;
            chain: import("@liquality/cryptoassets").ChainId;
            index: number;
            addresses: string[];
            assets: string[];
            balances: Record<string, string>;
            color: string;
        }>;
        readonly addCustomToken: (payload: {
            network: import("./types").Network;
            walletId: string;
            chain: import("@liquality/cryptoassets").ChainId;
            symbol: string;
            name: string;
            contractAddress: string;
            decimals: number;
        }) => Promise<void>;
        readonly addExternalConnection: (payload: {
            origin: string;
            chain: import("@liquality/cryptoassets").ChainId;
            accountId: string;
            setDefaultEthereum: boolean;
        }) => Promise<void>;
        readonly initializeAnalyticsPreferences: (payload: {
            accepted: boolean;
        }) => Promise<void>;
        readonly updateAnalyticsPreferences: (payload: import("./types").AnalyticsState) => Promise<void>;
        readonly setAnalyticsResponse: (payload: {
            accepted: boolean;
        }) => Promise<void>;
        readonly initializeAnalytics: () => Promise<boolean>;
        readonly trackAnalytics: (payload: {
            event: string;
            properties: actions.AmplitudeProperties;
        }) => Promise<number> | Promise<undefined>;
        readonly changeActiveNetwork: (payload: {
            network: import("./types").Network;
        }) => Promise<void>;
        readonly changeActiveWalletId: (payload: {
            walletId: string;
        }) => Promise<void>;
        readonly changePassword: (payload: {
            key: string;
        }) => Promise<void>;
        readonly checkPendingActions: (payload: {
            walletId: string;
        }) => Promise<void>;
        readonly createWallet: (payload: {
            key: string;
            mnemonic: string;
            imported?: boolean | undefined;
        }) => Promise<import("./types").Wallet>;
        readonly disableAssets: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => Promise<void>;
        readonly disableEthereumInjection: () => Promise<void>;
        readonly enableAssets: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => Promise<void>;
        readonly enableEthereumInjection: () => Promise<void>;
        readonly exportPrivateKey: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
        }) => Promise<string>;
        readonly fetchTokenDetails: (payload: actions.FetchTokenDetailsRequest) => Promise<import("@chainify/types").Nullable<import("@chainify/types").TokenDetails>>;
        readonly forgetDappConnections: () => Promise<void>;
        readonly getLockForAsset: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            item: import("./types").BaseHistoryItem;
        }) => Promise<string>;
        readonly getQuotes: (payload: import("../swaps/types").GetQuotesRequest) => Promise<actions.GetQuotesResult>;
        readonly getSlowQuotes: (payload: {
            requestId: string;
        }) => Promise<import("../swaps/types").SwapQuote[]>;
        readonly getUnusedAddresses: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
            accountId: string;
        }) => Promise<string[]>;
        readonly getLedgerAccounts: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            accountType: import("./types").AccountType;
            startingIndex: number;
            numAccounts: number;
        }) => Promise<{
            account: string;
            index: number;
            exists: boolean;
        }[]>;
        readonly initializeAddresses: (payload: {
            network: import("./types").Network;
            walletId: string;
        }) => Promise<void>;
        readonly lockWallet: () => Promise<void>;
        readonly newSwap: (payload: {
            network: import("./types").Network;
            walletId: string;
            quote: import("../swaps/types").SwapQuote;
            fee: number;
            claimFee: number;
            feeLabel: import("./types").FeeLabel;
            claimFeeLabel: import("./types").FeeLabel;
        }) => Promise<import("./types").SwapHistoryItem>;
        readonly performNextAction: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
        }) => Promise<Partial<import("./types").HistoryItem> | undefined>;
        readonly proxyMutation: (payload: {
            type: string;
            payload: any;
        }) => Promise<void>;
        readonly removeCustomToken: (payload: {
            network: import("./types").Network;
            walletId: string;
            symbol: string;
        }) => Promise<void>;
        readonly retrySwap: (payload: {
            swap: import("./types").SwapHistoryItem;
        }) => Promise<Partial<import("./types").SwapHistoryItem> | undefined>;
        readonly sendNFTTransaction: (payload: import("./types").NFTSendTransactionParams) => Promise<import("@chainify/types").Transaction<any>>;
        readonly sendTransaction: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            asset: string;
            to: string;
            amount: import("bignumber.js").BigNumber;
            data: string;
            fee: number;
            feeAsset: string;
            gas: number;
            feeLabel: import("./types").FeeLabel;
            fiatRate: number;
        }) => Promise<import("./types").SendHistoryItem>;
        readonly setEthereumInjectionChain: (payload: {
            chain: import("@liquality/cryptoassets").ChainId;
        }) => Promise<void>;
        readonly setWhatsNewModalVersion: (payload: {
            version: string;
        }) => Promise<void>;
        readonly showNotification: (payload: import("../types").Notification) => Promise<void>;
        readonly toggleExperiment: (payload: {
            name: import("./types").ExperimentType;
        }) => Promise<void>;
        readonly toggleNFTStarred: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            nft: import("./types").NFT;
        }) => Promise<void>;
        readonly unlockWallet: (payload: {
            key: string;
        }) => Promise<void>;
        readonly updateAccountBalance: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
        }) => Promise<void>;
        readonly updateBalances: (payload: {
            walletId: string;
            network: import("./types").Network;
            accountIds?: string[] | undefined;
        }) => Promise<void>;
        readonly updateCurrenciesInfo: (payload: {
            assets: string[];
        }) => Promise<import("./types").CurrenciesInfo>;
        readonly updateFees: (payload: {
            asset: string;
        }) => Promise<import("@chainify/types").FeeDetails>;
        readonly updateFiatRates: (payload: {
            assets: string[];
        }) => Promise<import("./types").FiatRates>;
        readonly updateMarketData: (payload: {
            network: import("./types").Network;
        }) => Promise<{
            network: import("./types").Network;
            marketData: import("./types").MarketData[];
        }>;
        readonly updateNFTs: (payload: {
            walletId: string;
            network: import("./types").Network;
            accountIds: string[];
        }) => Promise<import("./types").NFT[][]>;
        readonly updateTransactionFee: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            id: string;
            hash: string;
            newFee: number;
        }) => Promise<import("@chainify/types").Transaction<any>>;
        readonly logError: (payload: import("@liquality/error-parser").LiqualityErrorJSON) => Promise<void>;
        readonly clearErrorLog: () => Promise<void>;
        readonly saveCustomChainSettings: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            chanifyNetwork: import("@chainify/types").Network;
        }) => Promise<void>;
        readonly removeCustomChainSettings: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
        }) => Promise<void>;
    };
    state: {
        readonly version: number;
        readonly key: string;
        readonly wallets: import("./types").Wallet[];
        readonly unlockedAt: number;
        readonly brokerReady: boolean;
        readonly encryptedWallets: string;
        readonly enabledAssets: Partial<Record<import("./types").Network, Record<string, string[]>>>;
        readonly customTokens: Partial<Record<import("./types").Network, Record<string, import("./types").CustomToken[]>>>;
        readonly accounts: Partial<Record<string, Record<import("./types").Network, import("./types").Account[]>>>;
        readonly fiatRates: import("./types").FiatRates;
        readonly currenciesInfo: import("./types").CurrenciesInfo;
        readonly fees: Partial<Record<import("./types").Network, Record<string, Record<string, import("@chainify/types").FeeDetails>>>>;
        readonly history: Partial<Record<import("./types").Network, Record<string, import("./types").HistoryItem[]>>>;
        readonly marketData: Partial<Record<import("./types").Network, import("./types").MarketData[]>>;
        readonly activeNetwork: import("./types").Network;
        readonly activeWalletId: string;
        readonly keyUpdatedAt: number;
        readonly keySalt: string;
        readonly termsAcceptedAt: number;
        readonly setupAt: number;
        readonly injectEthereum: boolean;
        readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
        readonly usbBridgeWindowsId: number;
        readonly externalConnections: import("./types").ExternalConnections;
        readonly rskLegacyDerivation: boolean;
        readonly analytics: import("./types").AnalyticsState;
        readonly experiments: Partial<Record<import("./types").ExperimentType, boolean>>;
        readonly whatsNewModalVersion: string;
        readonly enabledChains: Partial<Record<string, Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]>>>;
        readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
        readonly customChainSeetings: Partial<Record<import("./types").Network, Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>>>>;
    };
    getters: {
        readonly client: ({ network, walletId, chainId, accountId, useCache, accountType, accountIndex, }: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            accountId?: string | undefined;
            useCache?: boolean | undefined;
            accountType?: import("./types").AccountType | undefined;
            accountIndex?: number | undefined;
        }) => import("@chainify/client").Client<import("@chainify/client").Chain<any, import("@chainify/types").Network>, import("@chainify/client").Wallet<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
        readonly historyItemById: (network: import("./types").Network, walletId: string, id: string) => import("./types").HistoryItem | undefined;
        readonly cryptoassets: Readonly<{
            [asset: string]: import("@liquality/cryptoassets").IAsset;
        }>;
        readonly networkAccounts: readonly import("./types").Account[];
        readonly networkAssets: readonly string[];
        readonly allNetworkAssets: readonly string[];
        readonly activity: readonly import("./types").HistoryItem[];
        readonly totalFiatBalance: Readonly<import("bignumber.js").BigNumber>;
        readonly accountItem: (accountId: string) => import("./types").Account | undefined;
        readonly suggestedFeePrices: (asset: string) => import("@chainify/types").FeeDetails | undefined;
        readonly accountsWithBalance: readonly import("./types").Account[];
        readonly accountsData: readonly import("./types").Account[];
        readonly accountFiatBalance: (walletId: string, network: import("./types").Network, accountId: string) => import("bignumber.js").BigNumber;
        readonly assetFiatBalance: (asset: string, balance: import("bignumber.js").BigNumber) => import("bignumber.js").BigNumber | null;
        readonly assetMarketCap: (asset: string) => import("@chainify/types").Nullable<import("bignumber.js").BigNumber>;
        readonly chainAssets: Readonly<{
            bitcoin?: string[] | undefined;
            ethereum?: string[] | undefined;
            rsk?: string[] | undefined;
            bsc?: string[] | undefined;
            near?: string[] | undefined;
            polygon?: string[] | undefined;
            arbitrum?: string[] | undefined;
            solana?: string[] | undefined;
            fuse?: string[] | undefined;
            terra?: string[] | undefined;
            avalanche?: string[] | undefined;
            optimism?: string[] | undefined;
        }>;
        readonly analyticsEnabled: Readonly<boolean>;
        readonly allNftCollections: Readonly<import("./types").NFTCollections<import("./types").NFTWithAccount>>;
        readonly accountNftCollections: (accountId: string) => import("./types").NFTCollections<import("./types").NFT>;
        readonly mergedChainSettings: Readonly<Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>>;
        readonly chainSettings: readonly {
            chain: string;
            asset: string;
            network: import("../types").ChainifyNetwork;
        }[];
    };
    commit: {
        SET_STATE: (payload: {
            newState: RootState;
        }) => void;
        CREATE_WALLET: (payload: {
            key: string;
            keySalt: string;
            encryptedWallets: string;
            wallet: import("./types").Wallet;
        }) => void;
        ACCEPT_TNC: () => void;
        CHANGE_ACTIVE_WALLETID: (payload: {
            walletId: string;
        }) => void;
        CHANGE_ACTIVE_NETWORK: (payload: {
            network: import("./types").Network;
        }) => void;
        CHANGE_PASSWORD: (payload: {
            key: string;
            keySalt: string;
            encryptedWallets: string;
        }) => void;
        LOCK_WALLET: () => void;
        UNLOCK_WALLET: (payload: {
            key: string;
            wallets: import("./types").Wallet[];
            unlockedAt: number;
        }) => void;
        NEW_SWAP: (payload: {
            network: import("./types").Network;
            walletId: string;
            swap: import("./types").SwapHistoryItem;
        }) => void;
        NEW_TRASACTION: (payload: {
            network: import("./types").Network;
            walletId: string;
            transaction: import("./types").SendHistoryItem;
        }) => void;
        NEW_NFT_TRASACTION: (payload: {
            network: import("./types").Network;
            walletId: string;
            transaction: import("./types").NFTSendHistoryItem;
        }) => void;
        UPDATE_HISTORY: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
            updates: Partial<import("./types").HistoryItem>;
        }) => void;
        REMOVE_ORDER: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
        }) => void;
        UPDATE_BALANCE: (payload: {
            network: import("./types").Network;
            accountId: string;
            walletId: string;
            asset: string;
            balance: string;
        }) => void;
        UPDATE_MULTIPLE_BALANCES: (payload: {
            network: import("./types").Network;
            accountId: string;
            walletId: string;
            assets: string[];
            balances: import("@chainify/types").Nullable<string>[];
        }) => void;
        UPDATE_FEES: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            fees: import("@chainify/types").FeeDetails;
        }) => void;
        UPDATE_FIAT_RATES: (payload: {
            fiatRates: import("./types").FiatRates;
        }) => void;
        UPDATE_CURRENCIES_INFO: (payload: {
            currenciesInfo: import("./types").CurrenciesInfo;
        }) => void;
        UPDATE_MARKET_DATA: (payload: {
            network: import("./types").Network;
            marketData: import("./types").MarketData[];
        }) => void;
        SET_ETHEREUM_INJECTION_CHAIN: (payload: {
            chain: import("@liquality/cryptoassets").ChainId;
        }) => void;
        ENABLE_ETHEREUM_INJECTION: () => void;
        DISABLE_ETHEREUM_INJECTION: () => void;
        ENABLE_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => void;
        DISABLE_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => void;
        DISABLE_ACCOUNT_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            assets: string[];
        }) => void;
        ENABLE_ACCOUNT_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            assets: string[];
        }) => void;
        ADD_CUSTOM_TOKEN: (payload: {
            network: import("./types").Network;
            walletId: string;
            customToken: import("./types").CustomToken;
        }) => void;
        REMOVE_CUSTOM_TOKEN: (payload: {
            network: import("./types").Network;
            walletId: string;
            symbol: string;
        }) => void;
        CREATE_ACCOUNT: (payload: {
            network: import("./types").Network;
            walletId: string;
            account: import("./types").Account;
        }) => void;
        UPDATE_ACCOUNT: (payload: {
            network: import("./types").Network;
            walletId: string;
            account: import("./types").Account;
        }) => void;
        REMOVE_ACCOUNT: (payload: {
            walletId: string;
            id: string;
            network: import("./types").Network;
        }) => void;
        UPDATE_ACCOUNT_ADDRESSES: (payload: {
            network: import("./types").Network;
            accountId: string;
            walletId: string;
            addresses: string[];
        }) => void;
        SET_USB_BRIDGE_WINDOWS_ID: (payload: {
            id: number;
        }) => void;
        SET_EXTERNAL_CONNECTION_DEFAULT: (payload: {
            origin: string;
            activeWalletId: string;
            accountId: string;
        }) => void;
        ADD_EXTERNAL_CONNECTION: (payload: {
            origin: string;
            activeWalletId: string;
            accountId: string;
            chain: import("@liquality/cryptoassets").ChainId;
        }) => void;
        REMOVE_EXTERNAL_CONNECTIONS: (payload: {
            activeWalletId: string;
        }) => void;
        SET_ANALYTICS_PREFERENCES: (payload: Partial<import("./types").AnalyticsState>) => void;
        UPDATE_NFTS: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            nfts: import("./types").NFT[];
        }) => void;
        NFT_TOGGLE_STARRED: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            nft: import("./types").NFT;
        }) => void;
        TOGGLE_EXPERIMENT: (payload: {
            name: import("./types").ExperimentType;
        }) => void;
        SET_WHATS_NEW_MODAL_VERSION: (payload: {
            version: string;
        }) => void;
        TOGGLE_BLOCKCHAIN: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            enable: boolean;
        }) => void;
        TOGGLE_ACCOUNT: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            enable: boolean;
        }) => void;
        LOG_ERROR: (payload: import("@liquality/error-parser").LiqualityErrorJSON) => void;
        CLEAR_ERROR_LOG: () => void;
        SET_CUSTOM_CHAIN_SETTINGS: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            chanifyNetwork: import("@chainify/types").Network;
        }) => void;
        REMOVE_CUSTOM_CHAIN_SETTINGS: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
        }) => void;
    };
    dispatch: {
        readonly acceptTermsAndConditions: (payload: {
            analyticsAccepted: boolean;
        }) => Promise<void>;
        readonly createAccount: (payload: {
            walletId: string;
            network: import("./types").Network;
            account: import("./types").Account;
        }) => Promise<import("./types").Account>;
        readonly removeAccount: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
        }) => Promise<string>;
        readonly toggleAccount: (payload: {
            network: import("./types").Network;
            walletId: string;
            accounts: string[];
            enable: boolean;
        }) => Promise<void>;
        readonly toggleBlockchain: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            enable: boolean;
        }) => Promise<void>;
        readonly updateAccount: (payload: {
            network: import("./types").Network;
            walletId: string;
            account: import("./types").Account;
        }) => Promise<{
            updatedAt: number;
            id: string;
            walletId: string;
            createdAt: number;
            enabled: boolean;
            derivationPath: string;
            chainCode?: string | undefined;
            publicKey?: string | undefined;
            nfts?: import("./types").NFT[] | undefined;
            type: import("./types").AccountType;
            name: string;
            alias?: string | undefined;
            chain: import("@liquality/cryptoassets").ChainId;
            index: number;
            addresses: string[];
            assets: string[];
            balances: Record<string, string>;
            color: string;
        }>;
        readonly addCustomToken: (payload: {
            network: import("./types").Network;
            walletId: string;
            chain: import("@liquality/cryptoassets").ChainId;
            symbol: string;
            name: string;
            contractAddress: string;
            decimals: number;
        }) => Promise<void>;
        readonly addExternalConnection: (payload: {
            origin: string;
            chain: import("@liquality/cryptoassets").ChainId;
            accountId: string;
            setDefaultEthereum: boolean;
        }) => Promise<void>;
        readonly initializeAnalyticsPreferences: (payload: {
            accepted: boolean;
        }) => Promise<void>;
        readonly updateAnalyticsPreferences: (payload: import("./types").AnalyticsState) => Promise<void>;
        readonly setAnalyticsResponse: (payload: {
            accepted: boolean;
        }) => Promise<void>;
        readonly initializeAnalytics: () => Promise<boolean>;
        readonly trackAnalytics: (payload: {
            event: string;
            properties: actions.AmplitudeProperties;
        }) => Promise<number> | Promise<undefined>;
        readonly changeActiveNetwork: (payload: {
            network: import("./types").Network;
        }) => Promise<void>;
        readonly changeActiveWalletId: (payload: {
            walletId: string;
        }) => Promise<void>;
        readonly changePassword: (payload: {
            key: string;
        }) => Promise<void>;
        readonly checkPendingActions: (payload: {
            walletId: string;
        }) => Promise<void>;
        readonly createWallet: (payload: {
            key: string;
            mnemonic: string;
            imported?: boolean | undefined;
        }) => Promise<import("./types").Wallet>;
        readonly disableAssets: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => Promise<void>;
        readonly disableEthereumInjection: () => Promise<void>;
        readonly enableAssets: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => Promise<void>;
        readonly enableEthereumInjection: () => Promise<void>;
        readonly exportPrivateKey: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
        }) => Promise<string>;
        readonly fetchTokenDetails: (payload: actions.FetchTokenDetailsRequest) => Promise<import("@chainify/types").Nullable<import("@chainify/types").TokenDetails>>;
        readonly forgetDappConnections: () => Promise<void>;
        readonly getLockForAsset: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            item: import("./types").BaseHistoryItem;
        }) => Promise<string>;
        readonly getQuotes: (payload: import("../swaps/types").GetQuotesRequest) => Promise<actions.GetQuotesResult>;
        readonly getSlowQuotes: (payload: {
            requestId: string;
        }) => Promise<import("../swaps/types").SwapQuote[]>;
        readonly getUnusedAddresses: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
            accountId: string;
        }) => Promise<string[]>;
        readonly getLedgerAccounts: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            accountType: import("./types").AccountType;
            startingIndex: number;
            numAccounts: number;
        }) => Promise<{
            account: string;
            index: number;
            exists: boolean;
        }[]>;
        readonly initializeAddresses: (payload: {
            network: import("./types").Network;
            walletId: string;
        }) => Promise<void>;
        readonly lockWallet: () => Promise<void>;
        readonly newSwap: (payload: {
            network: import("./types").Network;
            walletId: string;
            quote: import("../swaps/types").SwapQuote;
            fee: number;
            claimFee: number;
            feeLabel: import("./types").FeeLabel;
            claimFeeLabel: import("./types").FeeLabel;
        }) => Promise<import("./types").SwapHistoryItem>;
        readonly performNextAction: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
        }) => Promise<Partial<import("./types").HistoryItem> | undefined>;
        readonly proxyMutation: (payload: {
            type: string;
            payload: any;
        }) => Promise<void>;
        readonly removeCustomToken: (payload: {
            network: import("./types").Network;
            walletId: string;
            symbol: string;
        }) => Promise<void>;
        readonly retrySwap: (payload: {
            swap: import("./types").SwapHistoryItem;
        }) => Promise<Partial<import("./types").SwapHistoryItem> | undefined>;
        readonly sendNFTTransaction: (payload: import("./types").NFTSendTransactionParams) => Promise<import("@chainify/types").Transaction<any>>;
        readonly sendTransaction: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            asset: string;
            to: string;
            amount: import("bignumber.js").BigNumber;
            data: string;
            fee: number;
            feeAsset: string;
            gas: number;
            feeLabel: import("./types").FeeLabel;
            fiatRate: number;
        }) => Promise<import("./types").SendHistoryItem>;
        readonly setEthereumInjectionChain: (payload: {
            chain: import("@liquality/cryptoassets").ChainId;
        }) => Promise<void>;
        readonly setWhatsNewModalVersion: (payload: {
            version: string;
        }) => Promise<void>;
        readonly showNotification: (payload: import("../types").Notification) => Promise<void>;
        readonly toggleExperiment: (payload: {
            name: import("./types").ExperimentType;
        }) => Promise<void>;
        readonly toggleNFTStarred: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            nft: import("./types").NFT;
        }) => Promise<void>;
        readonly unlockWallet: (payload: {
            key: string;
        }) => Promise<void>;
        readonly updateAccountBalance: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
        }) => Promise<void>;
        readonly updateBalances: (payload: {
            walletId: string;
            network: import("./types").Network;
            accountIds?: string[] | undefined;
        }) => Promise<void>;
        readonly updateCurrenciesInfo: (payload: {
            assets: string[];
        }) => Promise<import("./types").CurrenciesInfo>;
        readonly updateFees: (payload: {
            asset: string;
        }) => Promise<import("@chainify/types").FeeDetails>;
        readonly updateFiatRates: (payload: {
            assets: string[];
        }) => Promise<import("./types").FiatRates>;
        readonly updateMarketData: (payload: {
            network: import("./types").Network;
        }) => Promise<{
            network: import("./types").Network;
            marketData: import("./types").MarketData[];
        }>;
        readonly updateNFTs: (payload: {
            walletId: string;
            network: import("./types").Network;
            accountIds: string[];
        }) => Promise<import("./types").NFT[][]>;
        readonly updateTransactionFee: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            id: string;
            hash: string;
            newFee: number;
        }) => Promise<import("@chainify/types").Transaction<any>>;
        readonly logError: (payload: import("@liquality/error-parser").LiqualityErrorJSON) => Promise<void>;
        readonly clearErrorLog: () => Promise<void>;
        readonly saveCustomChainSettings: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            chanifyNetwork: import("@chainify/types").Network;
        }) => Promise<void>;
        readonly removeCustomChainSettings: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
        }) => Promise<void>;
    };
}, rootGetterContext: (args: [any, any]) => {
    rootState: {
        readonly version: number;
        readonly key: string;
        readonly wallets: import("./types").Wallet[];
        readonly unlockedAt: number;
        readonly brokerReady: boolean;
        readonly encryptedWallets: string;
        readonly enabledAssets: Partial<Record<import("./types").Network, Record<string, string[]>>>;
        readonly customTokens: Partial<Record<import("./types").Network, Record<string, import("./types").CustomToken[]>>>;
        readonly accounts: Partial<Record<string, Record<import("./types").Network, import("./types").Account[]>>>;
        readonly fiatRates: import("./types").FiatRates;
        readonly currenciesInfo: import("./types").CurrenciesInfo;
        readonly fees: Partial<Record<import("./types").Network, Record<string, Record<string, import("@chainify/types").FeeDetails>>>>;
        readonly history: Partial<Record<import("./types").Network, Record<string, import("./types").HistoryItem[]>>>;
        readonly marketData: Partial<Record<import("./types").Network, import("./types").MarketData[]>>;
        readonly activeNetwork: import("./types").Network;
        readonly activeWalletId: string;
        readonly keyUpdatedAt: number;
        readonly keySalt: string;
        readonly termsAcceptedAt: number;
        readonly setupAt: number;
        readonly injectEthereum: boolean;
        readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
        readonly usbBridgeWindowsId: number;
        readonly externalConnections: import("./types").ExternalConnections;
        readonly rskLegacyDerivation: boolean;
        readonly analytics: import("./types").AnalyticsState;
        readonly experiments: Partial<Record<import("./types").ExperimentType, boolean>>;
        readonly whatsNewModalVersion: string;
        readonly enabledChains: Partial<Record<string, Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]>>>;
        readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
        readonly customChainSeetings: Partial<Record<import("./types").Network, Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>>>>;
    };
    rootGetters: {
        readonly client: ({ network, walletId, chainId, accountId, useCache, accountType, accountIndex, }: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            accountId?: string | undefined;
            useCache?: boolean | undefined;
            accountType?: import("./types").AccountType | undefined;
            accountIndex?: number | undefined;
        }) => import("@chainify/client").Client<import("@chainify/client").Chain<any, import("@chainify/types").Network>, import("@chainify/client").Wallet<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
        readonly historyItemById: (network: import("./types").Network, walletId: string, id: string) => import("./types").HistoryItem | undefined;
        readonly cryptoassets: Readonly<{
            [asset: string]: import("@liquality/cryptoassets").IAsset;
        }>;
        readonly networkAccounts: readonly import("./types").Account[];
        readonly networkAssets: readonly string[];
        readonly allNetworkAssets: readonly string[];
        readonly activity: readonly import("./types").HistoryItem[];
        readonly totalFiatBalance: Readonly<import("bignumber.js").BigNumber>;
        readonly accountItem: (accountId: string) => import("./types").Account | undefined;
        readonly suggestedFeePrices: (asset: string) => import("@chainify/types").FeeDetails | undefined;
        readonly accountsWithBalance: readonly import("./types").Account[];
        readonly accountsData: readonly import("./types").Account[];
        readonly accountFiatBalance: (walletId: string, network: import("./types").Network, accountId: string) => import("bignumber.js").BigNumber;
        readonly assetFiatBalance: (asset: string, balance: import("bignumber.js").BigNumber) => import("bignumber.js").BigNumber | null;
        readonly assetMarketCap: (asset: string) => import("@chainify/types").Nullable<import("bignumber.js").BigNumber>;
        readonly chainAssets: Readonly<{
            bitcoin?: string[] | undefined;
            ethereum?: string[] | undefined;
            rsk?: string[] | undefined;
            bsc?: string[] | undefined;
            near?: string[] | undefined;
            polygon?: string[] | undefined;
            arbitrum?: string[] | undefined;
            solana?: string[] | undefined;
            fuse?: string[] | undefined;
            terra?: string[] | undefined;
            avalanche?: string[] | undefined;
            optimism?: string[] | undefined;
        }>;
        readonly analyticsEnabled: Readonly<boolean>;
        readonly allNftCollections: Readonly<import("./types").NFTCollections<import("./types").NFTWithAccount>>;
        readonly accountNftCollections: (accountId: string) => import("./types").NFTCollections<import("./types").NFT>;
        readonly mergedChainSettings: Readonly<Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>>;
        readonly chainSettings: readonly {
            chain: string;
            asset: string;
            network: import("../types").ChainifyNetwork;
        }[];
    };
    state: {
        readonly version: number;
        readonly key: string;
        readonly wallets: import("./types").Wallet[];
        readonly unlockedAt: number;
        readonly brokerReady: boolean;
        readonly encryptedWallets: string;
        readonly enabledAssets: Partial<Record<import("./types").Network, Record<string, string[]>>>;
        readonly customTokens: Partial<Record<import("./types").Network, Record<string, import("./types").CustomToken[]>>>;
        readonly accounts: Partial<Record<string, Record<import("./types").Network, import("./types").Account[]>>>;
        readonly fiatRates: import("./types").FiatRates;
        readonly currenciesInfo: import("./types").CurrenciesInfo;
        readonly fees: Partial<Record<import("./types").Network, Record<string, Record<string, import("@chainify/types").FeeDetails>>>>;
        readonly history: Partial<Record<import("./types").Network, Record<string, import("./types").HistoryItem[]>>>;
        readonly marketData: Partial<Record<import("./types").Network, import("./types").MarketData[]>>;
        readonly activeNetwork: import("./types").Network;
        readonly activeWalletId: string;
        readonly keyUpdatedAt: number;
        readonly keySalt: string;
        readonly termsAcceptedAt: number;
        readonly setupAt: number;
        readonly injectEthereum: boolean;
        readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
        readonly usbBridgeWindowsId: number;
        readonly externalConnections: import("./types").ExternalConnections;
        readonly rskLegacyDerivation: boolean;
        readonly analytics: import("./types").AnalyticsState;
        readonly experiments: Partial<Record<import("./types").ExperimentType, boolean>>;
        readonly whatsNewModalVersion: string;
        readonly enabledChains: Partial<Record<string, Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]>>>;
        readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
        readonly customChainSeetings: Partial<Record<import("./types").Network, Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>>>>;
    };
    getters: {
        readonly client: ({ network, walletId, chainId, accountId, useCache, accountType, accountIndex, }: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            accountId?: string | undefined;
            useCache?: boolean | undefined;
            accountType?: import("./types").AccountType | undefined;
            accountIndex?: number | undefined;
        }) => import("@chainify/client").Client<import("@chainify/client").Chain<any, import("@chainify/types").Network>, import("@chainify/client").Wallet<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
        readonly historyItemById: (network: import("./types").Network, walletId: string, id: string) => import("./types").HistoryItem | undefined;
        readonly cryptoassets: Readonly<{
            [asset: string]: import("@liquality/cryptoassets").IAsset;
        }>;
        readonly networkAccounts: readonly import("./types").Account[];
        readonly networkAssets: readonly string[];
        readonly allNetworkAssets: readonly string[];
        readonly activity: readonly import("./types").HistoryItem[];
        readonly totalFiatBalance: Readonly<import("bignumber.js").BigNumber>;
        readonly accountItem: (accountId: string) => import("./types").Account | undefined;
        readonly suggestedFeePrices: (asset: string) => import("@chainify/types").FeeDetails | undefined;
        readonly accountsWithBalance: readonly import("./types").Account[];
        readonly accountsData: readonly import("./types").Account[];
        readonly accountFiatBalance: (walletId: string, network: import("./types").Network, accountId: string) => import("bignumber.js").BigNumber;
        readonly assetFiatBalance: (asset: string, balance: import("bignumber.js").BigNumber) => import("bignumber.js").BigNumber | null;
        readonly assetMarketCap: (asset: string) => import("@chainify/types").Nullable<import("bignumber.js").BigNumber>;
        readonly chainAssets: Readonly<{
            bitcoin?: string[] | undefined;
            ethereum?: string[] | undefined;
            rsk?: string[] | undefined;
            bsc?: string[] | undefined;
            near?: string[] | undefined;
            polygon?: string[] | undefined;
            arbitrum?: string[] | undefined;
            solana?: string[] | undefined;
            fuse?: string[] | undefined;
            terra?: string[] | undefined;
            avalanche?: string[] | undefined;
            optimism?: string[] | undefined;
        }>;
        readonly analyticsEnabled: Readonly<boolean>;
        readonly allNftCollections: Readonly<import("./types").NFTCollections<import("./types").NFTWithAccount>>;
        readonly accountNftCollections: (accountId: string) => import("./types").NFTCollections<import("./types").NFT>;
        readonly mergedChainSettings: Readonly<Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>>;
        readonly chainSettings: readonly {
            chain: string;
            asset: string;
            network: import("../types").ChainifyNetwork;
        }[];
    };
}, moduleActionContext: <O extends import("direct-vuex").ModuleOptions<any>>(originalContext: _ActionContext<any, any>, module: O) => {
    rootState: {
        readonly version: number;
        readonly key: string;
        readonly wallets: import("./types").Wallet[];
        readonly unlockedAt: number;
        readonly brokerReady: boolean;
        readonly encryptedWallets: string;
        readonly enabledAssets: Partial<Record<import("./types").Network, Record<string, string[]>>>;
        readonly customTokens: Partial<Record<import("./types").Network, Record<string, import("./types").CustomToken[]>>>;
        readonly accounts: Partial<Record<string, Record<import("./types").Network, import("./types").Account[]>>>;
        readonly fiatRates: import("./types").FiatRates;
        readonly currenciesInfo: import("./types").CurrenciesInfo;
        readonly fees: Partial<Record<import("./types").Network, Record<string, Record<string, import("@chainify/types").FeeDetails>>>>;
        readonly history: Partial<Record<import("./types").Network, Record<string, import("./types").HistoryItem[]>>>;
        readonly marketData: Partial<Record<import("./types").Network, import("./types").MarketData[]>>;
        readonly activeNetwork: import("./types").Network;
        readonly activeWalletId: string;
        readonly keyUpdatedAt: number;
        readonly keySalt: string;
        readonly termsAcceptedAt: number;
        readonly setupAt: number;
        readonly injectEthereum: boolean;
        readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
        readonly usbBridgeWindowsId: number;
        readonly externalConnections: import("./types").ExternalConnections;
        readonly rskLegacyDerivation: boolean;
        readonly analytics: import("./types").AnalyticsState;
        readonly experiments: Partial<Record<import("./types").ExperimentType, boolean>>;
        readonly whatsNewModalVersion: string;
        readonly enabledChains: Partial<Record<string, Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]>>>;
        readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
        readonly customChainSeetings: Partial<Record<import("./types").Network, Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>>>>;
    };
    rootGetters: {
        readonly client: ({ network, walletId, chainId, accountId, useCache, accountType, accountIndex, }: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            accountId?: string | undefined;
            useCache?: boolean | undefined;
            accountType?: import("./types").AccountType | undefined;
            accountIndex?: number | undefined;
        }) => import("@chainify/client").Client<import("@chainify/client").Chain<any, import("@chainify/types").Network>, import("@chainify/client").Wallet<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
        readonly historyItemById: (network: import("./types").Network, walletId: string, id: string) => import("./types").HistoryItem | undefined;
        readonly cryptoassets: Readonly<{
            [asset: string]: import("@liquality/cryptoassets").IAsset;
        }>;
        readonly networkAccounts: readonly import("./types").Account[];
        readonly networkAssets: readonly string[];
        readonly allNetworkAssets: readonly string[];
        readonly activity: readonly import("./types").HistoryItem[];
        readonly totalFiatBalance: Readonly<import("bignumber.js").BigNumber>;
        readonly accountItem: (accountId: string) => import("./types").Account | undefined;
        readonly suggestedFeePrices: (asset: string) => import("@chainify/types").FeeDetails | undefined;
        readonly accountsWithBalance: readonly import("./types").Account[];
        readonly accountsData: readonly import("./types").Account[];
        readonly accountFiatBalance: (walletId: string, network: import("./types").Network, accountId: string) => import("bignumber.js").BigNumber;
        readonly assetFiatBalance: (asset: string, balance: import("bignumber.js").BigNumber) => import("bignumber.js").BigNumber | null;
        readonly assetMarketCap: (asset: string) => import("@chainify/types").Nullable<import("bignumber.js").BigNumber>;
        readonly chainAssets: Readonly<{
            bitcoin?: string[] | undefined;
            ethereum?: string[] | undefined;
            rsk?: string[] | undefined;
            bsc?: string[] | undefined;
            near?: string[] | undefined;
            polygon?: string[] | undefined;
            arbitrum?: string[] | undefined;
            solana?: string[] | undefined;
            fuse?: string[] | undefined;
            terra?: string[] | undefined;
            avalanche?: string[] | undefined;
            optimism?: string[] | undefined;
        }>;
        readonly analyticsEnabled: Readonly<boolean>;
        readonly allNftCollections: Readonly<import("./types").NFTCollections<import("./types").NFTWithAccount>>;
        readonly accountNftCollections: (accountId: string) => import("./types").NFTCollections<import("./types").NFT>;
        readonly mergedChainSettings: Readonly<Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>>;
        readonly chainSettings: readonly {
            chain: string;
            asset: string;
            network: import("../types").ChainifyNetwork;
        }[];
    };
    rootCommit: {
        SET_STATE: (payload: {
            newState: RootState;
        }) => void;
        CREATE_WALLET: (payload: {
            key: string;
            keySalt: string;
            encryptedWallets: string;
            wallet: import("./types").Wallet;
        }) => void;
        ACCEPT_TNC: () => void;
        CHANGE_ACTIVE_WALLETID: (payload: {
            walletId: string;
        }) => void;
        CHANGE_ACTIVE_NETWORK: (payload: {
            network: import("./types").Network;
        }) => void;
        CHANGE_PASSWORD: (payload: {
            key: string;
            keySalt: string;
            encryptedWallets: string;
        }) => void;
        LOCK_WALLET: () => void;
        UNLOCK_WALLET: (payload: {
            key: string;
            wallets: import("./types").Wallet[];
            unlockedAt: number;
        }) => void;
        NEW_SWAP: (payload: {
            network: import("./types").Network;
            walletId: string;
            swap: import("./types").SwapHistoryItem;
        }) => void;
        NEW_TRASACTION: (payload: {
            network: import("./types").Network;
            walletId: string;
            transaction: import("./types").SendHistoryItem;
        }) => void;
        NEW_NFT_TRASACTION: (payload: {
            network: import("./types").Network;
            walletId: string;
            transaction: import("./types").NFTSendHistoryItem;
        }) => void;
        UPDATE_HISTORY: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
            updates: Partial<import("./types").HistoryItem>;
        }) => void;
        REMOVE_ORDER: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
        }) => void;
        UPDATE_BALANCE: (payload: {
            network: import("./types").Network;
            accountId: string;
            walletId: string;
            asset: string;
            balance: string;
        }) => void;
        UPDATE_MULTIPLE_BALANCES: (payload: {
            network: import("./types").Network;
            accountId: string;
            walletId: string;
            assets: string[];
            balances: import("@chainify/types").Nullable<string>[];
        }) => void;
        UPDATE_FEES: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            fees: import("@chainify/types").FeeDetails;
        }) => void;
        UPDATE_FIAT_RATES: (payload: {
            fiatRates: import("./types").FiatRates;
        }) => void;
        UPDATE_CURRENCIES_INFO: (payload: {
            currenciesInfo: import("./types").CurrenciesInfo;
        }) => void;
        UPDATE_MARKET_DATA: (payload: {
            network: import("./types").Network;
            marketData: import("./types").MarketData[];
        }) => void;
        SET_ETHEREUM_INJECTION_CHAIN: (payload: {
            chain: import("@liquality/cryptoassets").ChainId;
        }) => void;
        ENABLE_ETHEREUM_INJECTION: () => void;
        DISABLE_ETHEREUM_INJECTION: () => void;
        ENABLE_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => void;
        DISABLE_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => void;
        DISABLE_ACCOUNT_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            assets: string[];
        }) => void;
        ENABLE_ACCOUNT_ASSETS: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            assets: string[];
        }) => void;
        ADD_CUSTOM_TOKEN: (payload: {
            network: import("./types").Network;
            walletId: string;
            customToken: import("./types").CustomToken;
        }) => void;
        REMOVE_CUSTOM_TOKEN: (payload: {
            network: import("./types").Network;
            walletId: string;
            symbol: string;
        }) => void;
        CREATE_ACCOUNT: (payload: {
            network: import("./types").Network;
            walletId: string;
            account: import("./types").Account;
        }) => void;
        UPDATE_ACCOUNT: (payload: {
            network: import("./types").Network;
            walletId: string;
            account: import("./types").Account;
        }) => void;
        REMOVE_ACCOUNT: (payload: {
            walletId: string;
            id: string;
            network: import("./types").Network;
        }) => void;
        UPDATE_ACCOUNT_ADDRESSES: (payload: {
            network: import("./types").Network;
            accountId: string;
            walletId: string;
            addresses: string[];
        }) => void;
        SET_USB_BRIDGE_WINDOWS_ID: (payload: {
            id: number;
        }) => void;
        SET_EXTERNAL_CONNECTION_DEFAULT: (payload: {
            origin: string;
            activeWalletId: string;
            accountId: string;
        }) => void;
        ADD_EXTERNAL_CONNECTION: (payload: {
            origin: string;
            activeWalletId: string;
            accountId: string;
            chain: import("@liquality/cryptoassets").ChainId;
        }) => void;
        REMOVE_EXTERNAL_CONNECTIONS: (payload: {
            activeWalletId: string;
        }) => void;
        SET_ANALYTICS_PREFERENCES: (payload: Partial<import("./types").AnalyticsState>) => void;
        UPDATE_NFTS: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            nfts: import("./types").NFT[];
        }) => void;
        NFT_TOGGLE_STARRED: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            nft: import("./types").NFT;
        }) => void;
        TOGGLE_EXPERIMENT: (payload: {
            name: import("./types").ExperimentType;
        }) => void;
        SET_WHATS_NEW_MODAL_VERSION: (payload: {
            version: string;
        }) => void;
        TOGGLE_BLOCKCHAIN: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            enable: boolean;
        }) => void;
        TOGGLE_ACCOUNT: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            enable: boolean;
        }) => void;
        LOG_ERROR: (payload: import("@liquality/error-parser").LiqualityErrorJSON) => void;
        CLEAR_ERROR_LOG: () => void;
        SET_CUSTOM_CHAIN_SETTINGS: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            chanifyNetwork: import("@chainify/types").Network;
        }) => void;
        REMOVE_CUSTOM_CHAIN_SETTINGS: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
        }) => void;
    };
    rootDispatch: {
        readonly acceptTermsAndConditions: (payload: {
            analyticsAccepted: boolean;
        }) => Promise<void>;
        readonly createAccount: (payload: {
            walletId: string;
            network: import("./types").Network;
            account: import("./types").Account;
        }) => Promise<import("./types").Account>;
        readonly removeAccount: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
        }) => Promise<string>;
        readonly toggleAccount: (payload: {
            network: import("./types").Network;
            walletId: string;
            accounts: string[];
            enable: boolean;
        }) => Promise<void>;
        readonly toggleBlockchain: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            enable: boolean;
        }) => Promise<void>;
        readonly updateAccount: (payload: {
            network: import("./types").Network;
            walletId: string;
            account: import("./types").Account;
        }) => Promise<{
            updatedAt: number;
            id: string;
            walletId: string;
            createdAt: number;
            enabled: boolean;
            derivationPath: string;
            chainCode?: string | undefined;
            publicKey?: string | undefined;
            nfts?: import("./types").NFT[] | undefined;
            type: import("./types").AccountType;
            name: string;
            alias?: string | undefined;
            chain: import("@liquality/cryptoassets").ChainId;
            index: number;
            addresses: string[];
            assets: string[];
            balances: Record<string, string>;
            color: string;
        }>;
        readonly addCustomToken: (payload: {
            network: import("./types").Network;
            walletId: string;
            chain: import("@liquality/cryptoassets").ChainId;
            symbol: string;
            name: string;
            contractAddress: string;
            decimals: number;
        }) => Promise<void>;
        readonly addExternalConnection: (payload: {
            origin: string;
            chain: import("@liquality/cryptoassets").ChainId;
            accountId: string;
            setDefaultEthereum: boolean;
        }) => Promise<void>;
        readonly initializeAnalyticsPreferences: (payload: {
            accepted: boolean;
        }) => Promise<void>;
        readonly updateAnalyticsPreferences: (payload: import("./types").AnalyticsState) => Promise<void>;
        readonly setAnalyticsResponse: (payload: {
            accepted: boolean;
        }) => Promise<void>;
        readonly initializeAnalytics: () => Promise<boolean>;
        readonly trackAnalytics: (payload: {
            event: string;
            properties: actions.AmplitudeProperties;
        }) => Promise<number> | Promise<undefined>;
        readonly changeActiveNetwork: (payload: {
            network: import("./types").Network;
        }) => Promise<void>;
        readonly changeActiveWalletId: (payload: {
            walletId: string;
        }) => Promise<void>;
        readonly changePassword: (payload: {
            key: string;
        }) => Promise<void>;
        readonly checkPendingActions: (payload: {
            walletId: string;
        }) => Promise<void>;
        readonly createWallet: (payload: {
            key: string;
            mnemonic: string;
            imported?: boolean | undefined;
        }) => Promise<import("./types").Wallet>;
        readonly disableAssets: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => Promise<void>;
        readonly disableEthereumInjection: () => Promise<void>;
        readonly enableAssets: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
        }) => Promise<void>;
        readonly enableEthereumInjection: () => Promise<void>;
        readonly exportPrivateKey: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
        }) => Promise<string>;
        readonly fetchTokenDetails: (payload: actions.FetchTokenDetailsRequest) => Promise<import("@chainify/types").Nullable<import("@chainify/types").TokenDetails>>;
        readonly forgetDappConnections: () => Promise<void>;
        readonly getLockForAsset: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            item: import("./types").BaseHistoryItem;
        }) => Promise<string>;
        readonly getQuotes: (payload: import("../swaps/types").GetQuotesRequest) => Promise<actions.GetQuotesResult>;
        readonly getSlowQuotes: (payload: {
            requestId: string;
        }) => Promise<import("../swaps/types").SwapQuote[]>;
        readonly getUnusedAddresses: (payload: {
            network: import("./types").Network;
            walletId: string;
            assets: string[];
            accountId: string;
        }) => Promise<string[]>;
        readonly getLedgerAccounts: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            accountType: import("./types").AccountType;
            startingIndex: number;
            numAccounts: number;
        }) => Promise<{
            account: string;
            index: number;
            exists: boolean;
        }[]>;
        readonly initializeAddresses: (payload: {
            network: import("./types").Network;
            walletId: string;
        }) => Promise<void>;
        readonly lockWallet: () => Promise<void>;
        readonly newSwap: (payload: {
            network: import("./types").Network;
            walletId: string;
            quote: import("../swaps/types").SwapQuote;
            fee: number;
            claimFee: number;
            feeLabel: import("./types").FeeLabel;
            claimFeeLabel: import("./types").FeeLabel;
        }) => Promise<import("./types").SwapHistoryItem>;
        readonly performNextAction: (payload: {
            network: import("./types").Network;
            walletId: string;
            id: string;
        }) => Promise<Partial<import("./types").HistoryItem> | undefined>;
        readonly proxyMutation: (payload: {
            type: string;
            payload: any;
        }) => Promise<void>;
        readonly removeCustomToken: (payload: {
            network: import("./types").Network;
            walletId: string;
            symbol: string;
        }) => Promise<void>;
        readonly retrySwap: (payload: {
            swap: import("./types").SwapHistoryItem;
        }) => Promise<Partial<import("./types").SwapHistoryItem> | undefined>;
        readonly sendNFTTransaction: (payload: import("./types").NFTSendTransactionParams) => Promise<import("@chainify/types").Transaction<any>>;
        readonly sendTransaction: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            asset: string;
            to: string;
            amount: import("bignumber.js").BigNumber;
            data: string;
            fee: number;
            feeAsset: string;
            gas: number;
            feeLabel: import("./types").FeeLabel;
            fiatRate: number;
        }) => Promise<import("./types").SendHistoryItem>;
        readonly setEthereumInjectionChain: (payload: {
            chain: import("@liquality/cryptoassets").ChainId;
        }) => Promise<void>;
        readonly setWhatsNewModalVersion: (payload: {
            version: string;
        }) => Promise<void>;
        readonly showNotification: (payload: import("../types").Notification) => Promise<void>;
        readonly toggleExperiment: (payload: {
            name: import("./types").ExperimentType;
        }) => Promise<void>;
        readonly toggleNFTStarred: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
            nft: import("./types").NFT;
        }) => Promise<void>;
        readonly unlockWallet: (payload: {
            key: string;
        }) => Promise<void>;
        readonly updateAccountBalance: (payload: {
            network: import("./types").Network;
            walletId: string;
            accountId: string;
        }) => Promise<void>;
        readonly updateBalances: (payload: {
            walletId: string;
            network: import("./types").Network;
            accountIds?: string[] | undefined;
        }) => Promise<void>;
        readonly updateCurrenciesInfo: (payload: {
            assets: string[];
        }) => Promise<import("./types").CurrenciesInfo>;
        readonly updateFees: (payload: {
            asset: string;
        }) => Promise<import("@chainify/types").FeeDetails>;
        readonly updateFiatRates: (payload: {
            assets: string[];
        }) => Promise<import("./types").FiatRates>;
        readonly updateMarketData: (payload: {
            network: import("./types").Network;
        }) => Promise<{
            network: import("./types").Network;
            marketData: import("./types").MarketData[];
        }>;
        readonly updateNFTs: (payload: {
            walletId: string;
            network: import("./types").Network;
            accountIds: string[];
        }) => Promise<import("./types").NFT[][]>;
        readonly updateTransactionFee: (payload: {
            network: import("./types").Network;
            walletId: string;
            asset: string;
            id: string;
            hash: string;
            newFee: number;
        }) => Promise<import("@chainify/types").Transaction<any>>;
        readonly logError: (payload: import("@liquality/error-parser").LiqualityErrorJSON) => Promise<void>;
        readonly clearErrorLog: () => Promise<void>;
        readonly saveCustomChainSettings: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            chanifyNetwork: import("@chainify/types").Network;
        }) => Promise<void>;
        readonly removeCustomChainSettings: (payload: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
        }) => Promise<void>;
    };
    state: import("direct-vuex/types/direct-types").ShowContentDepth1<import("direct-vuex/types/direct-types").DirectState<O>>;
    getters: import("direct-vuex/types/direct-types").ShowContentDepth1<import("direct-vuex/types/direct-types").DirectGetters<O>>;
    commit: import("direct-vuex/types/direct-types").ShowContentDepth1<import("direct-vuex/types/direct-types").DirectMutations<O>>;
    dispatch: import("direct-vuex/types/direct-types").ShowContentDepth1<import("direct-vuex/types/direct-types").DirectActions<O>>;
}, moduleGetterContext: <O extends import("direct-vuex").ModuleOptions<any>>(args: [any, any, any, any], module: O) => {
    rootState: {
        readonly version: number;
        readonly key: string;
        readonly wallets: import("./types").Wallet[];
        readonly unlockedAt: number;
        readonly brokerReady: boolean;
        readonly encryptedWallets: string;
        readonly enabledAssets: Partial<Record<import("./types").Network, Record<string, string[]>>>;
        readonly customTokens: Partial<Record<import("./types").Network, Record<string, import("./types").CustomToken[]>>>;
        readonly accounts: Partial<Record<string, Record<import("./types").Network, import("./types").Account[]>>>;
        readonly fiatRates: import("./types").FiatRates;
        readonly currenciesInfo: import("./types").CurrenciesInfo;
        readonly fees: Partial<Record<import("./types").Network, Record<string, Record<string, import("@chainify/types").FeeDetails>>>>;
        readonly history: Partial<Record<import("./types").Network, Record<string, import("./types").HistoryItem[]>>>;
        readonly marketData: Partial<Record<import("./types").Network, import("./types").MarketData[]>>;
        readonly activeNetwork: import("./types").Network;
        readonly activeWalletId: string;
        readonly keyUpdatedAt: number;
        readonly keySalt: string;
        readonly termsAcceptedAt: number;
        readonly setupAt: number;
        readonly injectEthereum: boolean;
        readonly injectEthereumChain: import("@liquality/cryptoassets").ChainId;
        readonly usbBridgeWindowsId: number;
        readonly externalConnections: import("./types").ExternalConnections;
        readonly rskLegacyDerivation: boolean;
        readonly analytics: import("./types").AnalyticsState;
        readonly experiments: Partial<Record<import("./types").ExperimentType, boolean>>;
        readonly whatsNewModalVersion: string;
        readonly enabledChains: Partial<Record<string, Record<import("./types").Network, import("@liquality/cryptoassets").ChainId[]>>>;
        readonly errorLog: import("@liquality/error-parser").LiqualityErrorJSON[];
        readonly customChainSeetings: Partial<Record<import("./types").Network, Record<string, Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>>>>;
    };
    rootGetters: {
        readonly client: ({ network, walletId, chainId, accountId, useCache, accountType, accountIndex, }: {
            network: import("./types").Network;
            walletId: string;
            chainId: import("@liquality/cryptoassets").ChainId;
            accountId?: string | undefined;
            useCache?: boolean | undefined;
            accountType?: import("./types").AccountType | undefined;
            accountIndex?: number | undefined;
        }) => import("@chainify/client").Client<import("@chainify/client").Chain<any, import("@chainify/types").Network>, import("@chainify/client").Wallet<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
        readonly historyItemById: (network: import("./types").Network, walletId: string, id: string) => import("./types").HistoryItem | undefined;
        readonly cryptoassets: Readonly<{
            [asset: string]: import("@liquality/cryptoassets").IAsset;
        }>;
        readonly networkAccounts: readonly import("./types").Account[];
        readonly networkAssets: readonly string[];
        readonly allNetworkAssets: readonly string[];
        readonly activity: readonly import("./types").HistoryItem[];
        readonly totalFiatBalance: Readonly<import("bignumber.js").BigNumber>;
        readonly accountItem: (accountId: string) => import("./types").Account | undefined;
        readonly suggestedFeePrices: (asset: string) => import("@chainify/types").FeeDetails | undefined;
        readonly accountsWithBalance: readonly import("./types").Account[];
        readonly accountsData: readonly import("./types").Account[];
        readonly accountFiatBalance: (walletId: string, network: import("./types").Network, accountId: string) => import("bignumber.js").BigNumber;
        readonly assetFiatBalance: (asset: string, balance: import("bignumber.js").BigNumber) => import("bignumber.js").BigNumber | null;
        readonly assetMarketCap: (asset: string) => import("@chainify/types").Nullable<import("bignumber.js").BigNumber>;
        readonly chainAssets: Readonly<{
            bitcoin?: string[] | undefined;
            ethereum?: string[] | undefined;
            rsk?: string[] | undefined;
            bsc?: string[] | undefined;
            near?: string[] | undefined;
            polygon?: string[] | undefined;
            arbitrum?: string[] | undefined;
            solana?: string[] | undefined;
            fuse?: string[] | undefined;
            terra?: string[] | undefined;
            avalanche?: string[] | undefined;
            optimism?: string[] | undefined;
        }>;
        readonly analyticsEnabled: Readonly<boolean>;
        readonly allNftCollections: Readonly<import("./types").NFTCollections<import("./types").NFTWithAccount>>;
        readonly accountNftCollections: (accountId: string) => import("./types").NFTCollections<import("./types").NFT>;
        readonly mergedChainSettings: Readonly<Record<import("@liquality/cryptoassets").ChainId, import("../types").ChainifyNetwork>>;
        readonly chainSettings: readonly {
            chain: string;
            asset: string;
            network: import("../types").ChainifyNetwork;
        }[];
    };
    state: import("direct-vuex/types/direct-types").ShowContentDepth1<import("direct-vuex/types/direct-types").DirectState<O>>;
    getters: import("direct-vuex/types/direct-types").ShowContentDepth1<import("direct-vuex/types/direct-types").DirectGetters<O>>;
};
export default store;
export declare type OriginalStore = typeof store.original;
export declare type ActionContext = _ActionContext<RootState, RootState>;
export { rootActionContext, rootGetterContext, moduleActionContext, moduleGetterContext };
