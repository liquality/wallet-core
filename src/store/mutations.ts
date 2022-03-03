const ensureNetworkWalletTree = (ref, network, walletId, initialValue) => {
  if (!ref[network]) ref[network] = {};
  if (!ref[network][walletId]) ref[network][walletId] = initialValue;
};

const ensureOriginWalletTree = (ref, walletId, origin, initialValue) => {
  if (!ref[walletId]) ref[walletId] = {};
  if (!ref[walletId][origin]) ref[walletId][origin] = initialValue;
};

const ensureAccountsWalletTree = (ref, walletId, network, initialValue) => {
  if (!ref[walletId]) ref[walletId] = {};
  if (!ref[walletId][network]) ref[walletId][network] = initialValue;
};

const ensureEnableChainsWalletTree = (ref, walletId, network) => {
  if (!ref.enabledChains) {
    ref.enabledChains = {};
  }
  if (!ref.enabledChains[walletId]) {
    ref.enabledChains[walletId] = {};
  }
  if (!ref.enabledChains[walletId]?.[network]) {
    ref.enabledChains[walletId][network] = [];
  }
};

export default {
  SETUP_WALLET(state, { key }) {
    state.key = key;
    state.keyUpdatedAt = Date.now();
    state.setupAt = Date.now();
  },
  CREATE_WALLET(state, { keySalt, encryptedWallets, wallet }) {
    state.encryptedWallets = encryptedWallets;
    state.keySalt = keySalt;
    state.wallets = [wallet];
    if (!state.accounts[wallet.id]) {
      state.accounts[wallet.id] = {
        mainnet: [],
        testnet: [],
      };
    }
  },
  ACCEPT_TNC(state) {
    state.termsAcceptedAt = Date.now();
  },
  CHANGE_ACTIVE_WALLETID(state, { walletId }) {
    state.activeWalletId = walletId;
  },
  CHANGE_ACTIVE_NETWORK(state, { network }) {
    state.activeNetwork = network;
  },
  CHANGE_PASSWORD(state, { key, keySalt, encryptedWallets }) {
    state.key = key;
    state.keySalt = keySalt;
    state.encryptedWallets = encryptedWallets;
    state.keyUpdatedAt = Date.now();
  },
  LOCK_WALLET(state) {
    state.key = null;
    state.unlockedAt = null;
    state.wallets = null;
  },
  UNLOCK_WALLET(state, { key, wallets, unlockedAt }) {
    state.key = key;
    state.wallets = wallets;
    state.unlockedAt = unlockedAt;
  },
  NEW_SWAP(state, { network, walletId, swap }) {
    ensureNetworkWalletTree(state.history, network, walletId, []);

    state.history[network][walletId].push(swap);
  },
  NEW_TRASACTION(state, { network, walletId, transaction }) {
    ensureNetworkWalletTree(state.history, network, walletId, []);

    state.history[network][walletId].push(transaction);
  },
  UPDATE_HISTORY(state, { network, walletId, id, updates }) {
    const item = state.history[network][walletId].find((i) => i.id === id);
    Object.assign(item, updates);
  },
  REMOVE_ORDER(state, { network, walletId, id }) {
    state.history[network][walletId] = state.history[network][walletId].filter(
      (i) => i.id !== id
    );
  },
  UPDATE_BALANCE(state, { network, accountId, walletId, asset, balance }) {
    const accounts = state.accounts[walletId][network];
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
          loadingInitialBalance: false,
        };

        state.accounts[walletId][network][index] = updatedAccount;
      }
    }
  },
  UPDATE_FEES(state, { network, walletId, asset, fees }) {
    ensureNetworkWalletTree(state.fees, network, walletId, {});

    state.fees[network][walletId][asset] = fees;
  },
  UPDATE_FIAT_RATES(state, { fiatRates }) {
    state.fiatRates = Object.assign({}, state.fiatRates, fiatRates);
  },
  UPDATE_MARKET_DATA(state, { network, marketData }) {
    state.marketData[network] = marketData;
  },
  SET_ETHEREUM_INJECTION_CHAIN(state, { chain }) {
    state.injectEthereumChain = chain;
  },
  ENABLE_ETHEREUM_INJECTION(state) {
    state.injectEthereum = true;
  },
  DISABLE_ETHEREUM_INJECTION(state) {
    state.injectEthereum = false;
  },
  ENABLE_ASSETS(state, { network, walletId, assets }) {
    ensureNetworkWalletTree(state.enabledAssets, network, walletId, []);
    state.enabledAssets[network][walletId].push(...assets);
  },
  DISABLE_ASSETS(state, { network, walletId, assets }) {
    ensureNetworkWalletTree(state.enabledAssets, network, walletId, []);

    state.enabledAssets[network][walletId] = state.enabledAssets[network][
      walletId
    ].filter((asset) => !assets.includes(asset));
  },
  DISABLE_ACCOUNT_ASSETS(state, { network, walletId, accountId, assets }) {
    const accounts = state.accounts[walletId][network];
    if (accounts) {
      const index = accounts.findIndex((a) => a.id === accountId);

      if (index >= 0) {
        const _account = accounts[index];
        const { balances } = _account;
        const balanceAssets = Object.keys(balances).filter((asset) =>
          assets.includes(asset)
        );
        for (const asset of balanceAssets) {
          delete balances[asset];
        }
        const updatedAccount = {
          ..._account,
          balances,
          assets: _account.assets.filter((asset) => !assets.includes(asset)),
        };

        state.accounts[walletId][network][index] = updatedAccount;
      }
    }

    state.enabledAssets[network][walletId] = state.enabledAssets[network][
      walletId
    ].filter((asset) => !assets.includes(asset));
  },
  ENABLE_ACCOUNT_ASSETS(state, { network, walletId, accountId, assets }) {
    const accounts = state.accounts[walletId][network];
    if (accounts) {
      const index = accounts.findIndex((a) => a.id === accountId);

      if (index >= 0) {
        const _account = accounts[index];
        const updatedAccount = {
          ..._account,
          assets: [
            ..._account.assets.filter((asset) => !assets.includes(asset)),
            ...assets,
          ],
        };

        state.accounts[walletId][network][index] = updatedAccount;
      }
    }
  },
  ADD_CUSTOM_TOKEN(state, { network, walletId, customToken }) {
    ensureNetworkWalletTree(state.customTokens, network, walletId, []);
    state.customTokens[network][walletId].push(customToken);
  },
  REMOVE_CUSTOM_TOKEN(state, { network, walletId, customToken }) {
    ensureNetworkWalletTree(state.customTokens, network, walletId, []);
    const indexOfToken = state.customTokens[network][walletId].findIndex(
      (token) => token.symbol === customToken.symbol
    );
    if (indexOfToken !== -1) {
      state.customTokens[network][walletId].splice(indexOfToken, 1);
    }
  },

  // ACCOUNTS
  CREATE_ACCOUNT(state, { network, walletId, account }) {
    if (!state.accounts[walletId]) {
      state.accounts[walletId] = {
        [network]: [],
      };
    }
    if (!state.accounts[walletId][network]) {
      state.accounts[walletId][network] = [];
    }

    state.accounts[walletId][network].push(account);
  },
  UPDATE_ACCOUNT(state, { network, walletId, account }) {
    const { id, name, addresses, assets, balances, updatedAt } = account;
    const accounts = state.accounts[walletId][network];
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

        state.accounts[walletId][network][index] = updatedAccount;
      }
    }
  },
  REMOVE_ACCOUNT(state, { walletId, id, network }) {
    const accounts = state.accounts[walletId][network];

    if (accounts) {
      const index = accounts.findIndex((account) => account.id === id);
      if (index >= 0) {
        const updatedAccounts = accounts.splice(index, 1);
        state.accounts[walletId][network] = [...updatedAccounts];
      }
    }
  },
  UPDATE_ACCOUNT_ADDRESSES(state, { network, accountId, walletId, addresses }) {
    const accounts = state.accounts[walletId][network];
    if (accounts) {
      const index = accounts.findIndex((a) => a.id === accountId);

      if (index >= 0) {
        const _account = accounts[index];
        const updatedAccount = {
          ..._account,
          addresses: [...new Set(addresses)],
        };

        state.accounts[walletId][network][index] = updatedAccount;
      }
    }
  },
  SAVE_PASSWORD(state, { password }) {
    state.tempPassword = password;
  },
  SET_USE_LEDGER_LIVE(state, { use }) {
    state.useLedgerLive = use;
  },
  SET_USB_BRIDGE_WINDOWS_ID(state, { id }) {
    state.usbBridgeWindowsId = id;
  },
  SET_EXTERNAL_CONNECTION_DEFAULT(
    state,
    { origin, activeWalletId, accountId }
  ) {
    ensureOriginWalletTree(
      state.externalConnections,
      activeWalletId,
      origin,
      {}
    );

    state.externalConnections[activeWalletId][origin].defaultEthereum =
      accountId;
  },
  ADD_EXTERNAL_CONNECTION(state, { origin, activeWalletId, accountId, chain }) {
    ensureOriginWalletTree(
      state.externalConnections,
      activeWalletId,
      origin,
      {}
    );

    const accounts =
      state.externalConnections[activeWalletId]?.[origin]?.[chain] || [];
    state.externalConnections[activeWalletId][origin][chain] = [
      ...new Set([accountId, ...accounts]),
    ];
  },
  REMOVE_EXTERNAL_CONNECTIONS(state, { activeWalletId }) {
    state.externalConnections[activeWalletId] = {};
  },
  SET_ANALYTICS_PREFERENCES(state, payload) {
    state.analytics = {
      ...state.analytics,
      ...payload,
    };
  },
  TOGGLE_EXPERIMENT(state, { name }) {
    const { experiments } = state;
    state.experiments = {
      ...experiments,
      [name]: experiments ? !experiments[name] : true,
    };
  },
  SET_WATS_NEW_MODAL_VERSION(state, { version }) {
    state.watsNewModalVersion = version;
  },
  TOGGLE_BLOCKCHAIN(state, { network, walletId, chainId, enable }) {
    ensureEnableChainsWalletTree(state, walletId, network);

    const chains = state.enabledChains[walletId][network];
    if (enable) {
      state.enabledChains[walletId][network] = [
        ...new Set([...chains, chainId]),
      ];
    } else {
      state.enabledChains[walletId][network] = [
        ...new Set([...chains.filter((c) => c !== chainId)]),
      ];
    }
  },
  TOGGLE_ACCOUNT(state, { network, walletId, accountId, enable }) {
    ensureAccountsWalletTree(state.accounts, walletId, network, []);

    const index = state.accounts[walletId][network].findIndex(
      (a) => a.id === accountId
    );

    if (index >= 0) {
      const _account = state.accounts[walletId][network][index];
      const updatedAccount = {
        ..._account,
        enabled: enable,
      };

      state.accounts[walletId][network][index] = updatedAccount;
    }
  },
};
