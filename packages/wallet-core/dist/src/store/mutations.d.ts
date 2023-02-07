import { FeeDetails, Nullable, Network as ChainifyNetwork } from '@chainify/types';
import { ChainId } from '@liquality/cryptoassets';
import { LiqualityErrorJSON } from '@liquality/error-parser';
import { Account, AccountId, AnalyticsState, Asset, CurrenciesInfo, CustomToken, ExperimentType, FiatRates, HistoryItem, MarketData, Network, NFT, NFTSendHistoryItem, RootState, SendHistoryItem, SwapHistoryItem, Wallet, WalletId } from './types';
declare const _default: {
    SET_STATE(state: RootState, { newState }: {
        newState: RootState;
    }): void;
    CREATE_WALLET(state: RootState, { key, keySalt, encryptedWallets, wallet, }: {
        key: string;
        keySalt: string;
        encryptedWallets: string;
        wallet: Wallet;
    }): void;
    ACCEPT_TNC(state: RootState): void;
    CHANGE_ACTIVE_WALLETID(state: RootState, { walletId }: {
        walletId: WalletId;
    }): void;
    CHANGE_ACTIVE_NETWORK(state: RootState, { network }: {
        network: Network;
    }): void;
    CHANGE_PASSWORD(state: RootState, { key, keySalt, encryptedWallets }: {
        key: string;
        keySalt: string;
        encryptedWallets: string;
    }): void;
    LOCK_WALLET(state: RootState): void;
    UNLOCK_WALLET(state: RootState, { key, wallets, unlockedAt }: {
        key: string;
        wallets: Wallet[];
        unlockedAt: number;
    }): void;
    NEW_SWAP(state: RootState, { network, walletId, swap }: {
        network: Network;
        walletId: WalletId;
        swap: SwapHistoryItem;
    }): void;
    NEW_TRASACTION(state: RootState, { network, walletId, transaction }: {
        network: Network;
        walletId: WalletId;
        transaction: SendHistoryItem;
    }): void;
    NEW_NFT_TRASACTION(state: RootState, { network, walletId, transaction }: {
        network: Network;
        walletId: WalletId;
        transaction: NFTSendHistoryItem;
    }): void;
    UPDATE_HISTORY(state: RootState, { network, walletId, id, updates, }: {
        network: Network;
        walletId: WalletId;
        id: string;
        updates: Partial<HistoryItem>;
    }): void;
    REMOVE_ORDER(state: RootState, { network, walletId, id }: {
        network: Network;
        walletId: WalletId;
        id: string;
    }): void;
    UPDATE_BALANCE(state: RootState, { network, accountId, walletId, asset, balance, }: {
        network: Network;
        accountId: AccountId;
        walletId: WalletId;
        asset: Asset;
        balance: string;
    }): void;
    UPDATE_MULTIPLE_BALANCES(state: RootState, { network, accountId, walletId, assets, balances, }: {
        network: Network;
        accountId: AccountId;
        walletId: WalletId;
        assets: Asset[];
        balances: Nullable<string>[];
    }): void;
    UPDATE_FEES(state: RootState, { network, walletId, asset, fees }: {
        network: Network;
        walletId: WalletId;
        asset: Asset;
        fees: FeeDetails;
    }): void;
    UPDATE_FIAT_RATES(state: RootState, { fiatRates }: {
        fiatRates: FiatRates;
    }): void;
    UPDATE_CURRENCIES_INFO(state: RootState, { currenciesInfo }: {
        currenciesInfo: CurrenciesInfo;
    }): void;
    UPDATE_MARKET_DATA(state: RootState, { network, marketData }: {
        network: Network;
        marketData: MarketData[];
    }): void;
    SET_ETHEREUM_INJECTION_CHAIN(state: RootState, { chain }: {
        chain: ChainId;
    }): void;
    ENABLE_ETHEREUM_INJECTION(state: RootState): void;
    DISABLE_ETHEREUM_INJECTION(state: RootState): void;
    ENABLE_ASSETS(state: RootState, { network, walletId, assets }: {
        network: Network;
        walletId: WalletId;
        assets: Asset[];
    }): void;
    DISABLE_ASSETS(state: RootState, { network, walletId, assets }: {
        network: Network;
        walletId: WalletId;
        assets: Asset[];
    }): void;
    DISABLE_ACCOUNT_ASSETS(state: RootState, { network, walletId, accountId, assets, }: {
        network: Network;
        walletId: WalletId;
        accountId: AccountId;
        assets: Asset[];
    }): void;
    ENABLE_ACCOUNT_ASSETS(state: RootState, { network, walletId, accountId, assets, }: {
        network: Network;
        walletId: WalletId;
        accountId: AccountId;
        assets: Asset[];
    }): void;
    ADD_CUSTOM_TOKEN(state: RootState, { network, walletId, customToken }: {
        network: Network;
        walletId: WalletId;
        customToken: CustomToken;
    }): void;
    REMOVE_CUSTOM_TOKEN(state: RootState, { network, walletId, symbol }: {
        network: Network;
        walletId: WalletId;
        symbol: string;
    }): void;
    CREATE_ACCOUNT(state: RootState, { network, walletId, account }: {
        network: Network;
        walletId: WalletId;
        account: Account;
    }): void;
    UPDATE_ACCOUNT(state: RootState, { network, walletId, account }: {
        network: Network;
        walletId: WalletId;
        account: Account;
    }): void;
    REMOVE_ACCOUNT(state: RootState, { walletId, id, network }: {
        walletId: WalletId;
        id: AccountId;
        network: Network;
    }): void;
    UPDATE_ACCOUNT_ADDRESSES(state: RootState, { network, accountId, walletId, addresses, }: {
        network: Network;
        accountId: AccountId;
        walletId: WalletId;
        addresses: string[];
    }): void;
    SET_USB_BRIDGE_WINDOWS_ID(state: RootState, { id }: {
        id: number;
    }): void;
    SET_EXTERNAL_CONNECTION_DEFAULT(state: RootState, { origin, activeWalletId, accountId }: {
        origin: string;
        activeWalletId: WalletId;
        accountId: AccountId;
    }): void;
    ADD_EXTERNAL_CONNECTION(state: RootState, { origin, activeWalletId, accountId, chain, }: {
        origin: string;
        activeWalletId: WalletId;
        accountId: AccountId;
        chain: ChainId;
    }): void;
    REMOVE_EXTERNAL_CONNECTIONS(state: RootState, { activeWalletId }: {
        activeWalletId: WalletId;
    }): void;
    SET_ANALYTICS_PREFERENCES(state: RootState, payload: Partial<AnalyticsState>): void;
    UPDATE_NFTS(state: RootState, { network, walletId, accountId, nfts }: {
        network: Network;
        walletId: WalletId;
        accountId: AccountId;
        nfts: NFT[];
    }): void;
    NFT_TOGGLE_STARRED(state: RootState, { network, walletId, accountId, nft }: {
        network: Network;
        walletId: WalletId;
        accountId: AccountId;
        nft: NFT;
    }): void;
    TOGGLE_EXPERIMENT(state: RootState, { name }: {
        name: ExperimentType;
    }): void;
    SET_WHATS_NEW_MODAL_VERSION(state: RootState, { version }: {
        version: string;
    }): void;
    TOGGLE_BLOCKCHAIN(state: RootState, { network, walletId, chainId, enable, }: {
        network: Network;
        walletId: WalletId;
        chainId: ChainId;
        enable: boolean;
    }): void;
    TOGGLE_ACCOUNT(state: RootState, { network, walletId, accountId, enable, }: {
        network: Network;
        walletId: WalletId;
        accountId: AccountId;
        enable: boolean;
    }): void;
    LOG_ERROR(state: RootState, error: LiqualityErrorJSON): void;
    CLEAR_ERROR_LOG(state: RootState): void;
    SET_CUSTOM_CHAIN_SETTINGS(state: RootState, { network, walletId, chainId, chanifyNetwork, }: {
        network: Network;
        walletId: WalletId;
        chainId: ChainId;
        chanifyNetwork: ChainifyNetwork;
    }): void;
    REMOVE_CUSTOM_CHAIN_SETTINGS(state: RootState, { network, walletId, chainId }: {
        network: Network;
        walletId: WalletId;
        chainId: ChainId;
    }): void;
};
export default _default;
