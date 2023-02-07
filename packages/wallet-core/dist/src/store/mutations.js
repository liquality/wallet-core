"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const error_parser_1 = require("@liquality/error-parser");
const vue_1 = tslib_1.__importDefault(require("vue"));
const _1 = tslib_1.__importDefault(require("."));
const types_1 = require("./types");
const ensureNetworkWalletTree = (ref, network, walletId, initialValue) => {
    if (!ref[network])
        vue_1.default.set(ref, network, {});
    if (!ref[network][walletId])
        vue_1.default.set(ref[network], walletId, initialValue);
};
const ensureOriginWalletTree = (ref, walletId, origin, initialValue) => {
    if (!ref[walletId])
        vue_1.default.set(ref, walletId, {});
    if (!ref[walletId][origin])
        vue_1.default.set(ref[walletId], origin, initialValue);
};
const ensureAccountsWalletTree = (ref, walletId, network, initialValue) => {
    if (!ref[walletId])
        vue_1.default.set(ref, walletId, {});
    if (!ref[walletId][network])
        vue_1.default.set(ref[walletId], network, initialValue);
};
const ensureEnableChainsWalletTree = (ref, walletId, network) => {
    var _a;
    if (!ref.enabledChains) {
        vue_1.default.set(ref, 'enabledChains', {});
    }
    if (!ref.enabledChains[walletId]) {
        vue_1.default.set(ref.enabledChains, walletId, {});
    }
    if (!((_a = ref.enabledChains[walletId]) === null || _a === void 0 ? void 0 : _a[network])) {
        vue_1.default.set(ref.enabledChains[walletId], network, []);
    }
};
exports.default = {
    SET_STATE(state, { newState }) {
        Object.assign(state, newState);
    },
    CREATE_WALLET(state, { key, keySalt, encryptedWallets, wallet, }) {
        state.key = key;
        state.keySalt = keySalt;
        state.keyUpdatedAt = Date.now();
        state.setupAt = Date.now();
        state.encryptedWallets = encryptedWallets;
        state.wallets = [wallet];
        if (!state.accounts[wallet.id]) {
            vue_1.default.set(state.accounts, wallet.id, {
                mainnet: [],
                testnet: [],
            });
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
        state.key = '';
        state.unlockedAt = 0;
        state.wallets = [];
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
    NEW_NFT_TRASACTION(state, { network, walletId, transaction }) {
        ensureNetworkWalletTree(state.history, network, walletId, []);
        state.history[network][walletId].push(transaction);
    },
    UPDATE_HISTORY(state, { network, walletId, id, updates, }) {
        var _a, _b, _c, _d;
        const itemIndex = (_a = state.history[network]) === null || _a === void 0 ? void 0 : _a[walletId].findIndex((i) => i.id === id);
        if (itemIndex != undefined && itemIndex >= 0) {
            const item = (_d = (_c = (_b = state === null || state === void 0 ? void 0 : state.history) === null || _b === void 0 ? void 0 : _b[network]) === null || _c === void 0 ? void 0 : _c[walletId]) === null || _d === void 0 ? void 0 : _d[itemIndex];
            if (item) {
                const updatedItem = Object.assign({}, item, updates);
                vue_1.default.set(state.history[network][walletId], itemIndex, updatedItem);
            }
        }
    },
    REMOVE_ORDER(state, { network, walletId, id }) {
        vue_1.default.set(state.history[network], walletId, state.history[network][walletId].filter((i) => i.id !== id));
    },
    UPDATE_BALANCE(state, { network, accountId, walletId, asset, balance, }) {
        const accounts = state.accounts[walletId][network];
        if (accounts) {
            const index = accounts.findIndex((a) => a.id === accountId);
            if (index >= 0) {
                const _account = accounts[index];
                const balances = Object.assign(Object.assign({}, accounts[index].balances), { [asset]: balance });
                const updatedAccount = Object.assign(Object.assign({}, _account), { balances });
                vue_1.default.set(state.accounts[walletId][network], index, updatedAccount);
            }
        }
    },
    UPDATE_MULTIPLE_BALANCES(state, { network, accountId, walletId, assets, balances, }) {
        const wallet = state.accounts[walletId];
        if (wallet) {
            const accounts = wallet[network];
            if (accounts) {
                const index = accounts.findIndex((a) => a.id === accountId);
                if (index >= 0) {
                    const account = accounts[index];
                    const currentBalances = Object.assign({}, account.balances);
                    const updatedBalances = assets.reduce((result, asset, index) => {
                        if (balances[index]) {
                            result[asset] = String(balances[index]);
                        }
                        return result;
                    }, {});
                    const updatedAccount = Object.assign(Object.assign({}, account), { balances: Object.assign(Object.assign({}, currentBalances), updatedBalances) });
                    vue_1.default.set(wallet[network], index, updatedAccount);
                }
            }
        }
    },
    UPDATE_FEES(state, { network, walletId, asset, fees }) {
        ensureNetworkWalletTree(state.fees, network, walletId, {});
        vue_1.default.set(state.fees[network][walletId], asset, fees);
    },
    UPDATE_FIAT_RATES(state, { fiatRates }) {
        state.fiatRates = Object.assign({}, state.fiatRates, fiatRates);
    },
    UPDATE_CURRENCIES_INFO(state, { currenciesInfo }) {
        state.currenciesInfo = Object.assign({}, state.currenciesInfo, currenciesInfo);
    },
    UPDATE_MARKET_DATA(state, { network, marketData }) {
        vue_1.default.set(state.marketData, network, marketData);
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
        vue_1.default.set(state.enabledAssets[network], walletId, state.enabledAssets[network][walletId].filter((asset) => !assets.includes(asset)));
    },
    DISABLE_ACCOUNT_ASSETS(state, { network, walletId, accountId, assets, }) {
        const accounts = state.accounts[walletId][network];
        if (accounts) {
            const index = accounts.findIndex((a) => a.id === accountId);
            if (index >= 0) {
                const _account = accounts[index];
                const { balances } = _account;
                const balanceAssets = Object.keys(balances).filter((asset) => assets.includes(asset));
                for (const asset of balanceAssets) {
                    delete balances[asset];
                }
                const updatedAccount = Object.assign(Object.assign({}, _account), { balances, assets: _account.assets.filter((asset) => !assets.includes(asset)) });
                vue_1.default.set(state.accounts[walletId][network], index, updatedAccount);
            }
        }
        vue_1.default.set(state.enabledAssets[network], walletId, state.enabledAssets[network][walletId].filter((asset) => !assets.includes(asset)));
    },
    ENABLE_ACCOUNT_ASSETS(state, { network, walletId, accountId, assets, }) {
        const accounts = state.accounts[walletId][network];
        if (accounts) {
            const index = accounts.findIndex((a) => a.id === accountId);
            if (index >= 0) {
                const _account = accounts[index];
                const updatedAccount = Object.assign(Object.assign({}, _account), { assets: [..._account.assets.filter((asset) => !assets.includes(asset)), ...assets] });
                vue_1.default.set(state.accounts[walletId][network], index, updatedAccount);
            }
        }
    },
    ADD_CUSTOM_TOKEN(state, { network, walletId, customToken }) {
        ensureNetworkWalletTree(state.customTokens, network, walletId, []);
        state.customTokens[network][walletId].push(customToken);
    },
    REMOVE_CUSTOM_TOKEN(state, { network, walletId, symbol }) {
        ensureNetworkWalletTree(state.customTokens, network, walletId, []);
        const indexOfToken = state.customTokens[network][walletId].findIndex((token) => token.symbol === symbol);
        if (indexOfToken !== -1) {
            state.customTokens[network][walletId].splice(indexOfToken, 1);
        }
    },
    CREATE_ACCOUNT(state, { network, walletId, account }) {
        if (!state.accounts[walletId]) {
            vue_1.default.set(state.accounts, walletId, {
                [network]: [],
            });
        }
        if (!state.accounts[walletId][network]) {
            vue_1.default.set(state.accounts[walletId], network, []);
        }
        state.accounts[walletId][network].push(account);
    },
    UPDATE_ACCOUNT(state, { network, walletId, account }) {
        const { id, name, alias, addresses, assets, balances, color, updatedAt } = account;
        const accounts = state.accounts[walletId][network];
        if (accounts) {
            const index = accounts.findIndex((a) => a.id === id);
            if (index >= 0) {
                const _account = accounts[index];
                const updatedAccount = Object.assign(Object.assign({}, _account), { name,
                    alias,
                    addresses,
                    balances,
                    assets,
                    updatedAt,
                    color });
                vue_1.default.set(state.accounts[walletId][network], index, updatedAccount);
            }
        }
    },
    REMOVE_ACCOUNT(state, { walletId, id, network }) {
        const accounts = state.accounts[walletId][network];
        if (accounts) {
            const index = accounts.findIndex((account) => account.id === id);
            if (index >= 0) {
                const updatedAccounts = accounts.splice(index, 1);
                vue_1.default.set(state.accounts[walletId], network, [...updatedAccounts]);
            }
        }
    },
    UPDATE_ACCOUNT_ADDRESSES(state, { network, accountId, walletId, addresses, }) {
        const accounts = state.accounts[walletId][network];
        if (accounts) {
            const index = accounts.findIndex((a) => a.id === accountId);
            if (index >= 0) {
                const _account = accounts[index];
                const updatedAccount = Object.assign(Object.assign({}, _account), { addresses: [...new Set(addresses)] });
                vue_1.default.set(state.accounts[walletId][network], index, updatedAccount);
            }
        }
    },
    SET_USB_BRIDGE_WINDOWS_ID(state, { id }) {
        state.usbBridgeWindowsId = id;
    },
    SET_EXTERNAL_CONNECTION_DEFAULT(state, { origin, activeWalletId, accountId }) {
        ensureOriginWalletTree(state.externalConnections, activeWalletId, origin, {});
        vue_1.default.set(state.externalConnections[activeWalletId][origin], 'defaultEthereum', accountId);
    },
    ADD_EXTERNAL_CONNECTION(state, { origin, activeWalletId, accountId, chain, }) {
        var _a, _b;
        ensureOriginWalletTree(state.externalConnections, activeWalletId, origin, {});
        const accounts = ((_b = (_a = state.externalConnections[activeWalletId]) === null || _a === void 0 ? void 0 : _a[origin]) === null || _b === void 0 ? void 0 : _b[chain]) || [];
        vue_1.default.set(state.externalConnections[activeWalletId][origin], chain, [...new Set([accountId, ...accounts])]);
    },
    REMOVE_EXTERNAL_CONNECTIONS(state, { activeWalletId }) {
        vue_1.default.set(state.externalConnections, activeWalletId, {});
    },
    SET_ANALYTICS_PREFERENCES(state, payload) {
        state.analytics = Object.assign(Object.assign({}, state.analytics), payload);
        (0, error_parser_1.updateErrorReporterConfig)({ useReporter: state.analytics.acceptedDate > 0 || state.experiments.reportErrors });
    },
    UPDATE_NFTS(state, { network, walletId, accountId, nfts }) {
        const account = state.accounts[walletId][network].find((a) => a.id === accountId);
        if (!account)
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Account(accountId));
        vue_1.default.set(account, 'nfts', nfts);
    },
    NFT_TOGGLE_STARRED(state, { network, walletId, accountId, nft }) {
        var _a;
        const account = state.accounts[walletId][network].find((a) => a.id === accountId);
        if (!account)
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Account(accountId));
        const stateNFT = (_a = account.nfts) === null || _a === void 0 ? void 0 : _a.find((accountNFT) => {
            return accountNFT.asset_contract.address === nft.asset_contract.address && accountNFT.token_id === nft.token_id;
        });
        if (stateNFT) {
            stateNFT.starred = !stateNFT.starred;
        }
    },
    TOGGLE_EXPERIMENT(state, { name }) {
        const { experiments } = state;
        state.experiments = Object.assign(Object.assign({}, experiments), { [name]: experiments && experiments[name] ? !experiments[name] : true });
        if (name === types_1.ExperimentType.ReportErrors) {
            (0, error_parser_1.updateErrorReporterConfig)({ useReporter: state.analytics.acceptedDate > 0 || state.experiments.reportErrors });
        }
    },
    SET_WHATS_NEW_MODAL_VERSION(state, { version }) {
        state.whatsNewModalVersion = version;
    },
    TOGGLE_BLOCKCHAIN(state, { network, walletId, chainId, enable, }) {
        ensureEnableChainsWalletTree(state, walletId, network);
        const chains = state.enabledChains[walletId][network];
        if (enable) {
            vue_1.default.set(state.enabledChains[walletId], network, [...new Set([...chains, chainId])]);
        }
        else {
            vue_1.default.set(state.enabledChains[walletId], network, [...new Set([...chains.filter((c) => c !== chainId)])]);
        }
    },
    TOGGLE_ACCOUNT(state, { network, walletId, accountId, enable, }) {
        ensureAccountsWalletTree(state.accounts, walletId, network, []);
        const index = state.accounts[walletId][network].findIndex((a) => a.id === accountId);
        if (index >= 0) {
            const _account = state.accounts[walletId][network][index];
            const updatedAccount = Object.assign(Object.assign({}, _account), { enabled: enable });
            vue_1.default.set(state.accounts[walletId][network], index, updatedAccount);
        }
    },
    LOG_ERROR(state, error) {
        if (!state.errorLog) {
            state.errorLog = [];
            (0, error_parser_1.updateErrorReporterConfig)({ callback: (error) => _1.default.dispatch.logError(error) });
        }
        const maxLogSize = Number(process.env.VUE_APP_MAX_ERROR_LOG_SIZE).valueOf();
        if (state.errorLog.length === maxLogSize)
            state.errorLog.shift();
        state.errorLog.push(error);
    },
    CLEAR_ERROR_LOG(state) {
        state.errorLog = [];
    },
    SET_CUSTOM_CHAIN_SETTINGS(state, { network, walletId, chainId, chanifyNetwork, }) {
        ensureNetworkWalletTree(state.customChainSeetings, network, walletId, {});
        vue_1.default.set(state.customChainSeetings[network][walletId], chainId, chanifyNetwork);
    },
    REMOVE_CUSTOM_CHAIN_SETTINGS(state, { network, walletId, chainId }) {
        ensureNetworkWalletTree(state.customChainSeetings, network, walletId, {});
        vue_1.default.delete(state.customChainSeetings[network][walletId], chainId);
    },
};
//# sourceMappingURL=mutations.js.map