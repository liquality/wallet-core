import { FeeDetails, Nullable } from '@chainify/types';
import { ChainId } from '@liquality/cryptoassets';
import {
  CUSTOM_ERRORS,
  createInternalError,
  updateErrorReporterConfig,
  LiqualityErrorJSON,
} from '@liquality/error-parser';
import Vue from 'vue';
import {
  Account,
  AccountId,
  AnalyticsState,
  Asset,
  CurrenciesInfo,
  CustomToken,
  ExperimentType,
  FiatRates,
  HistoryItem,
  MarketData,
  Network,
  NFT,
  NFTSendHistoryItem,
  RootState,
  SendHistoryItem,
  SwapHistoryItem,
  Wallet,
  WalletId,
} from './types';

const ensureNetworkWalletTree = (ref: any, network: Network, walletId: WalletId, initialValue: any) => {
  if (!ref[network]) Vue.set(ref, network, {});
  if (!ref[network][walletId]) Vue.set(ref[network], walletId, initialValue);
};

const ensureOriginWalletTree = (ref: any, walletId: WalletId, origin: string, initialValue: any) => {
  if (!ref[walletId]) Vue.set(ref, walletId, {});
  if (!ref[walletId][origin]) Vue.set(ref[walletId], origin, initialValue);
};

const ensureAccountsWalletTree = (ref: any, walletId: WalletId, network: Network, initialValue: any) => {
  if (!ref[walletId]) Vue.set(ref, walletId, {});
  if (!ref[walletId][network]) Vue.set(ref[walletId], network, initialValue);
};

const ensureEnableChainsWalletTree = (ref: RootState, walletId: WalletId, network: Network) => {
  if (!ref.enabledChains) {
    Vue.set(ref, 'enabledChains', {});
  }
  if (!ref.enabledChains[walletId]) {
    Vue.set(ref.enabledChains, walletId, {});
  }
  if (!ref.enabledChains[walletId]?.[network]) {
    Vue.set(ref.enabledChains[walletId]!, network, []);
  }
};

export default {
  SET_STATE(state: RootState, { newState }: { newState: RootState }) {
    Object.assign(state, newState);
  },
  CREATE_WALLET(
    state: RootState,
    {
      key,
      keySalt,
      encryptedWallets,
      wallet,
    }: { key: string; keySalt: string; encryptedWallets: string; wallet: Wallet }
  ) {
    state.key = key;
    state.keySalt = keySalt;
    state.keyUpdatedAt = Date.now();

    state.setupAt = Date.now();
    state.encryptedWallets = encryptedWallets;
    state.wallets = [wallet];
    if (!state.accounts[wallet.id]) {
      Vue.set(state.accounts, wallet.id, {
        mainnet: [],
        testnet: [],
      });
    }
  },
  ACCEPT_TNC(state: RootState) {
    state.termsAcceptedAt = Date.now();
  },
  CHANGE_ACTIVE_WALLETID(state: RootState, { walletId }: { walletId: WalletId }) {
    state.activeWalletId = walletId;
  },
  CHANGE_ACTIVE_NETWORK(state: RootState, { network }: { network: Network }) {
    state.activeNetwork = network;
  },
  CHANGE_PASSWORD(
    state: RootState,
    { key, keySalt, encryptedWallets }: { key: string; keySalt: string; encryptedWallets: string }
  ) {
    state.key = key;
    state.keySalt = keySalt;
    state.encryptedWallets = encryptedWallets;
    state.keyUpdatedAt = Date.now();
  },
  LOCK_WALLET(state: RootState) {
    state.key = '';
    state.unlockedAt = 0;
    state.wallets = [];
  },
  UNLOCK_WALLET(
    state: RootState,
    { key, wallets, unlockedAt }: { key: string; wallets: Wallet[]; unlockedAt: number }
  ) {
    state.key = key;
    state.wallets = wallets;
    state.unlockedAt = unlockedAt;
  },
  NEW_SWAP(
    state: RootState,
    { network, walletId, swap }: { network: Network; walletId: WalletId; swap: SwapHistoryItem }
  ) {
    ensureNetworkWalletTree(state.history, network, walletId, []);

    state.history[network]![walletId].push(swap);
  },
  NEW_TRASACTION(
    state: RootState,
    { network, walletId, transaction }: { network: Network; walletId: WalletId; transaction: SendHistoryItem }
  ) {
    ensureNetworkWalletTree(state.history, network, walletId, []);

    state.history[network]![walletId].push(transaction);
  },
  NEW_NFT_TRASACTION(
    state: RootState,
    { network, walletId, transaction }: { network: Network; walletId: WalletId; transaction: NFTSendHistoryItem }
  ) {
    ensureNetworkWalletTree(state.history, network, walletId, []);

    state.history[network]![walletId].push(transaction);
  },
  UPDATE_HISTORY(
    state: RootState,
    {
      network,
      walletId,
      id,
      updates,
    }: {
      network: Network;
      walletId: WalletId;
      id: string;
      updates: Partial<HistoryItem>;
    }
  ) {
    const itemIndex = state.history[network]?.[walletId].findIndex((i) => i.id === id);
    if (itemIndex != undefined && itemIndex >= 0) {
      const item = state?.history?.[network]?.[walletId]?.[itemIndex];

      if (item) {
        const updatedItem = Object.assign({}, item, updates);
        Vue.set(state.history[network]![walletId], itemIndex, updatedItem);
      }
    }
  },
  REMOVE_ORDER(state: RootState, { network, walletId, id }: { network: Network; walletId: WalletId; id: string }) {
    Vue.set(
      state.history[network]!,
      walletId,
      state.history[network]![walletId].filter((i) => i.id !== id)
    );
  },
  UPDATE_BALANCE(
    state: RootState,
    {
      network,
      accountId,
      walletId,
      asset,
      balance,
    }: {
      network: Network;
      accountId: AccountId;
      walletId: WalletId;
      asset: Asset;
      balance: string;
    }
  ) {
    const accounts = state.accounts[walletId]![network];
    if (accounts) {
      const index = accounts.findIndex((a) => a.id === accountId);

      if (index >= 0) {
        const _account = accounts[index];
        const balances = {
          ...accounts[index].balances,
          [asset]: balance,
        };
        const updatedAccount = {
          ..._account,
          balances,
        };

        Vue.set(state.accounts[walletId]![network], index, updatedAccount);
      }
    }
  },
  UPDATE_MULTIPLE_BALANCES(
    state: RootState,
    {
      network,
      accountId,
      walletId,
      assets,
      balances,
    }: {
      network: Network;
      accountId: AccountId;
      walletId: WalletId;
      assets: Asset[];
      balances: Nullable<string>[];
    }
  ) {
    const wallet = state.accounts[walletId];

    if (wallet) {
      const accounts = wallet[network];

      if (accounts) {
        const index = accounts.findIndex((a) => a.id === accountId);

        if (index >= 0) {
          const account = accounts[index];
          const currentBalances = { ...account.balances };

          const updatedBalances = assets.reduce((result, asset, index) => {
            if (balances[index]) {
              result[asset] = String(balances[index]);
            }
            return result;
          }, {} as Record<string, string>);

          const updatedAccount = {
            ...account,
            balances: { ...currentBalances, ...updatedBalances },
          };

          Vue.set(wallet[network], index, updatedAccount);
        }
      }
    }
  },
  UPDATE_FEES(
    state: RootState,
    { network, walletId, asset, fees }: { network: Network; walletId: WalletId; asset: Asset; fees: FeeDetails }
  ) {
    ensureNetworkWalletTree(state.fees, network, walletId, {});

    Vue.set(state.fees[network]![walletId], asset, fees);
  },
  UPDATE_FIAT_RATES(state: RootState, { fiatRates }: { fiatRates: FiatRates }) {
    state.fiatRates = Object.assign({}, state.fiatRates, fiatRates);
  },
  UPDATE_CURRENCIES_INFO(state: RootState, { currenciesInfo }: { currenciesInfo: CurrenciesInfo }) {
    state.currenciesInfo = Object.assign({}, state.currenciesInfo, currenciesInfo);
  },
  UPDATE_MARKET_DATA(state: RootState, { network, marketData }: { network: Network; marketData: MarketData[] }) {
    Vue.set(state.marketData, network, marketData);
  },
  SET_ETHEREUM_INJECTION_CHAIN(state: RootState, { chain }: { chain: ChainId }) {
    state.injectEthereumChain = chain;
  },
  ENABLE_ETHEREUM_INJECTION(state: RootState) {
    state.injectEthereum = true;
  },
  DISABLE_ETHEREUM_INJECTION(state: RootState) {
    state.injectEthereum = false;
  },
  ENABLE_ASSETS(
    state: RootState,
    { network, walletId, assets }: { network: Network; walletId: WalletId; assets: Asset[] }
  ) {
    ensureNetworkWalletTree(state.enabledAssets, network, walletId, []);
    state.enabledAssets[network]![walletId].push(...assets);
  },
  DISABLE_ASSETS(
    state: RootState,
    { network, walletId, assets }: { network: Network; walletId: WalletId; assets: Asset[] }
  ) {
    ensureNetworkWalletTree(state.enabledAssets, network, walletId, []);
    Vue.set(
      state.enabledAssets[network]!,
      walletId,
      state.enabledAssets[network]![walletId].filter((asset) => !assets.includes(asset))
    );
  },
  DISABLE_ACCOUNT_ASSETS(
    state: RootState,
    {
      network,
      walletId,
      accountId,
      assets,
    }: {
      network: Network;
      walletId: WalletId;
      accountId: AccountId;
      assets: Asset[];
    }
  ) {
    const accounts = state.accounts[walletId]![network];
    if (accounts) {
      const index = accounts.findIndex((a) => a.id === accountId);

      if (index >= 0) {
        const _account = accounts[index];
        const { balances } = _account;
        const balanceAssets = Object.keys(balances).filter((asset) => assets.includes(asset));
        for (const asset of balanceAssets) {
          delete balances[asset];
        }
        const updatedAccount = {
          ..._account,
          balances,
          assets: _account.assets.filter((asset) => !assets.includes(asset)),
        };

        Vue.set(state.accounts[walletId]![network], index, updatedAccount);
      }
    }
    Vue.set(
      state.enabledAssets[network]!,
      walletId,
      state.enabledAssets[network]![walletId].filter((asset) => !assets.includes(asset))
    );
  },
  ENABLE_ACCOUNT_ASSETS(
    state: RootState,
    {
      network,
      walletId,
      accountId,
      assets,
    }: {
      network: Network;
      walletId: WalletId;
      accountId: AccountId;
      assets: Asset[];
    }
  ) {
    const accounts = state.accounts[walletId]![network];
    if (accounts) {
      const index = accounts.findIndex((a) => a.id === accountId);

      if (index >= 0) {
        const _account = accounts[index];
        const updatedAccount = {
          ..._account,
          assets: [..._account.assets.filter((asset) => !assets.includes(asset)), ...assets],
        };

        Vue.set(state.accounts[walletId]![network], index, updatedAccount);
      }
    }
  },
  ADD_CUSTOM_TOKEN(
    state: RootState,
    { network, walletId, customToken }: { network: Network; walletId: WalletId; customToken: CustomToken }
  ) {
    ensureNetworkWalletTree(state.customTokens, network, walletId, []);
    state.customTokens[network]![walletId].push(customToken);
  },
  REMOVE_CUSTOM_TOKEN(
    state: RootState,
    { network, walletId, symbol }: { network: Network; walletId: WalletId; symbol: string }
  ) {
    ensureNetworkWalletTree(state.customTokens, network, walletId, []);
    const indexOfToken = state.customTokens[network]![walletId].findIndex((token) => token.symbol === symbol);
    if (indexOfToken !== -1) {
      state.customTokens[network]![walletId].splice(indexOfToken, 1);
    }
  },

  // ACCOUNTS
  CREATE_ACCOUNT(
    state: RootState,
    { network, walletId, account }: { network: Network; walletId: WalletId; account: Account }
  ) {
    if (!state.accounts[walletId]) {
      Vue.set(state.accounts, walletId, {
        [network]: [],
      });
    }
    if (!state.accounts[walletId]![network]) {
      Vue.set(state.accounts[walletId]!, network, []);
    }

    state.accounts[walletId]![network].push(account);
  },
  UPDATE_ACCOUNT(
    state: RootState,
    { network, walletId, account }: { network: Network; walletId: WalletId; account: Account }
  ) {
    const { id, name, addresses, assets, balances, updatedAt } = account;
    const accounts = state.accounts[walletId]![network];
    if (accounts) {
      const index = accounts.findIndex((a) => a.id === id);

      if (index >= 0) {
        const _account = accounts[index];
        const updatedAccount = {
          ..._account,
          name,
          addresses,
          balances,
          assets,
          updatedAt,
        };

        Vue.set(state.accounts[walletId]![network], index, updatedAccount);
      }
    }
  },
  REMOVE_ACCOUNT(state: RootState, { walletId, id, network }: { walletId: WalletId; id: AccountId; network: Network }) {
    const accounts = state.accounts[walletId]![network];

    if (accounts) {
      const index = accounts.findIndex((account) => account.id === id);
      if (index >= 0) {
        const updatedAccounts = accounts.splice(index, 1);
        Vue.set(state.accounts[walletId]!, network, [...updatedAccounts]);
      }
    }
  },
  UPDATE_ACCOUNT_ADDRESSES(
    state: RootState,
    {
      network,
      accountId,
      walletId,
      addresses,
    }: {
      network: Network;
      accountId: AccountId;
      walletId: WalletId;
      addresses: string[];
    }
  ) {
    const accounts = state.accounts[walletId]![network];
    if (accounts) {
      const index = accounts.findIndex((a) => a.id === accountId);

      if (index >= 0) {
        const _account = accounts[index];
        const updatedAccount = {
          ..._account,
          addresses: [...new Set(addresses)],
        };

        Vue.set(state.accounts[walletId]![network], index, updatedAccount);
      }
    }
  },
  SET_USB_BRIDGE_WINDOWS_ID(state: RootState, { id }: { id: number }) {
    state.usbBridgeWindowsId = id;
  },
  SET_EXTERNAL_CONNECTION_DEFAULT(
    state: RootState,
    { origin, activeWalletId, accountId }: { origin: string; activeWalletId: WalletId; accountId: AccountId }
  ) {
    ensureOriginWalletTree(state.externalConnections, activeWalletId, origin, {});

    Vue.set(state.externalConnections[activeWalletId][origin], 'defaultEthereum', accountId);
  },
  ADD_EXTERNAL_CONNECTION(
    state: RootState,
    {
      origin,
      activeWalletId,
      accountId,
      chain,
    }: {
      origin: string;
      activeWalletId: WalletId;
      accountId: AccountId;
      chain: ChainId;
    }
  ) {
    ensureOriginWalletTree(state.externalConnections, activeWalletId, origin, {});

    const accounts = state.externalConnections[activeWalletId]?.[origin]?.[chain] || [];
    Vue.set(state.externalConnections[activeWalletId][origin], chain, [...new Set([accountId, ...accounts])]);
  },
  REMOVE_EXTERNAL_CONNECTIONS(state: RootState, { activeWalletId }: { activeWalletId: WalletId }) {
    Vue.set(state.externalConnections, activeWalletId, {});
  },
  SET_ANALYTICS_PREFERENCES(state: RootState, payload: Partial<AnalyticsState>) {
    state.analytics = {
      ...state.analytics,
      ...payload,
    };

    updateErrorReporterConfig({ useReporter: state.analytics.acceptedDate > 0 || state.experiments.reportErrors });
  },
  UPDATE_NFTS(
    state: RootState,
    { network, walletId, accountId, nfts }: { network: Network; walletId: WalletId; accountId: AccountId; nfts: NFT[] }
  ) {
    const account = state.accounts[walletId]![network].find((a) => a.id === accountId);
    if (!account) throw createInternalError(CUSTOM_ERRORS.NotFound.Account(accountId));

    Vue.set(account, 'nfts', nfts);
  },
  NFT_TOGGLE_STARRED(
    state: RootState,
    { network, walletId, accountId, nft }: { network: Network; walletId: WalletId; accountId: AccountId; nft: NFT }
  ) {
    const account = state.accounts[walletId]![network].find((a) => a.id === accountId);
    if (!account) throw createInternalError(CUSTOM_ERRORS.NotFound.Account(accountId));

    const stateNFT = account.nfts?.find((accountNFT) => {
      return accountNFT.asset_contract!.address === nft.asset_contract!.address && accountNFT.token_id === nft.token_id;
    });
    if (stateNFT) {
      stateNFT.starred = !stateNFT.starred;
    }
  },
  TOGGLE_EXPERIMENT(state: RootState, { name }: { name: ExperimentType }) {
    const { experiments } = state;
    state.experiments = {
      ...experiments,
      [name]: experiments && experiments[name] ? !experiments[name] : true,
    };

    if (name === ExperimentType.ReportErrors) {
      updateErrorReporterConfig({ useReporter: state.analytics.acceptedDate > 0 || state.experiments.reportErrors });
    }
  },
  SET_WHATS_NEW_MODAL_VERSION(state: RootState, { version }: { version: string }) {
    state.whatsNewModalVersion = version;
  },
  TOGGLE_BLOCKCHAIN(
    state: RootState,
    {
      network,
      walletId,
      chainId,
      enable,
    }: {
      network: Network;
      walletId: WalletId;
      chainId: ChainId;
      enable: boolean;
    }
  ) {
    ensureEnableChainsWalletTree(state, walletId, network);

    const chains = state.enabledChains[walletId]![network];
    if (enable) {
      Vue.set(state.enabledChains[walletId]!, network, [...new Set([...chains, chainId])]);
    } else {
      Vue.set(state.enabledChains[walletId]!, network, [...new Set([...chains.filter((c) => c !== chainId)])]);
    }
  },
  TOGGLE_ACCOUNT(
    state: RootState,
    {
      network,
      walletId,
      accountId,
      enable,
    }: {
      network: Network;
      walletId: WalletId;
      accountId: AccountId;
      enable: boolean;
    }
  ) {
    ensureAccountsWalletTree(state.accounts, walletId, network, []);

    const index = state.accounts[walletId]![network].findIndex((a) => a.id === accountId);

    if (index >= 0) {
      const _account = state.accounts[walletId]![network][index];
      const updatedAccount = {
        ..._account,
        enabled: enable,
      };

      Vue.set(state.accounts[walletId]![network], index, updatedAccount);
    }
  },
  LOG_ERROR(state: RootState, error: LiqualityErrorJSON) {
    const maxLogSize = Number(process.env.VUE_APP_MAX_ERROR_LOG_SIZE).valueOf();
    if (state.errorLog.length === maxLogSize) state.errorLog.shift();
    state.errorLog.push(error);
  },
  CLEAR_ERROR_LOG(state: RootState) {
    state.errorLog = [];
  },
};
