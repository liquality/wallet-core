"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cryptoassets_1 = tslib_1.__importDefault(require("../utils/cryptoassets"));
const cryptoassets_2 = require("@liquality/cryptoassets");
const error_parser_1 = require("@liquality/error-parser");
const bignumber_js_1 = tslib_1.__importStar(require("bignumber.js"));
const lodash_1 = require("lodash");
const settings_1 = require("../factory/settings");
const _1 = require(".");
const factory_1 = require("../factory");
const coinFormatter_1 = require("../utils/coinFormatter");
const derivationPath_1 = require("../utils/derivationPath");
const networks_1 = require("../utils/networks");
const types_1 = require("./types");
const utils_1 = require("./utils");
exports.default = {
    client(...context) {
        const { state, getters } = (0, _1.rootGetterContext)(context);
        return ({ network, walletId, chainId, accountId, useCache = true, accountType = types_1.AccountType.Default, accountIndex = 0, }) => {
            const account = accountId ? getters.accountItem(accountId) : null;
            const _accountType = (account === null || account === void 0 ? void 0 : account.type) || accountType;
            const _accountIndex = (account === null || account === void 0 ? void 0 : account.index) || accountIndex;
            if (account && chainId !== account.chain) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Invalid.AssetChainNotAccountChain(chainId, accountId));
            }
            let derivationPath;
            if (_accountType.includes('ledger') || !account) {
                derivationPath = (0, derivationPath_1.getDerivationPath)(chainId, network, _accountIndex, _accountType);
            }
            else {
                derivationPath = account.derivationPath;
            }
            const cacheKey = [chainId, network, walletId, derivationPath, _accountType].join('-');
            if (useCache) {
                const cachedClient = utils_1.clientCache[cacheKey];
                if (cachedClient)
                    return cachedClient;
            }
            const wallet = state.wallets.find((w) => w.id === walletId);
            if (!wallet) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Wallet);
            }
            const { mnemonic } = wallet;
            const accountInfo = {
                type: _accountType,
                derivationPath,
                chainCode: account === null || account === void 0 ? void 0 : account.chainCode,
                publicKey: account === null || account === void 0 ? void 0 : account.publicKey,
                address: (account === null || account === void 0 ? void 0 : account.addresses.length) || 0 > 0 ? account === null || account === void 0 ? void 0 : account.addresses[0] : undefined,
            };
            const settings = {
                network,
                chainifyNetwork: getters.mergedChainSettings[chainId],
            };
            const client = (0, factory_1.createClient)({ chainId, settings, mnemonic, accountInfo });
            utils_1.clientCache[cacheKey] = client;
            return client;
        };
    },
    historyItemById(...context) {
        const { state } = (0, _1.rootGetterContext)(context);
        return (network, walletId, id) => state.history[network][walletId].find((i) => i.id === id);
    },
    cryptoassets(...context) {
        var _a, _b;
        const { state } = (0, _1.rootGetterContext)(context);
        const { activeNetwork, activeWalletId } = state;
        const baseAssets = (0, cryptoassets_2.getAllAssets)()[activeNetwork];
        const customAssets = (_b = (_a = state.customTokens[activeNetwork]) === null || _a === void 0 ? void 0 : _a[activeWalletId]) === null || _b === void 0 ? void 0 : _b.reduce((assets, token) => {
            return Object.assign(assets, {
                [token.symbol]: Object.assign(Object.assign(Object.assign({}, baseAssets.DAI), token), { code: token.symbol }),
            });
        }, {});
        return Object.assign({}, baseAssets, customAssets);
    },
    networkAccounts(...context) {
        var _a, _b;
        const { state } = (0, _1.rootGetterContext)(context);
        const { activeNetwork, activeWalletId, accounts } = state;
        return ((_b = (_a = accounts[activeWalletId]) === null || _a === void 0 ? void 0 : _a[activeNetwork]) === null || _b === void 0 ? void 0 : _b.filter((a) => a.enabled)) || [];
    },
    networkAssets(...context) {
        const { state } = (0, _1.rootGetterContext)(context);
        const { enabledAssets, activeNetwork, activeWalletId } = state;
        return enabledAssets[activeNetwork][activeWalletId];
    },
    allNetworkAssets(...context) {
        const { state } = (0, _1.rootGetterContext)(context);
        return networks_1.Networks.reduce((result, network) => {
            return (0, lodash_1.uniq)(result.concat(state.enabledAssets[network][state.activeWalletId]));
        }, []);
    },
    activity(...context) {
        const { state } = (0, _1.rootGetterContext)(context);
        const { history, activeNetwork, activeWalletId } = state;
        if (!history[activeNetwork])
            return [];
        if (!history[activeNetwork][activeWalletId])
            return [];
        return history[activeNetwork][activeWalletId].slice().reverse();
    },
    totalFiatBalance(...context) {
        const { state, getters } = (0, _1.rootGetterContext)(context);
        const { activeNetwork, activeWalletId } = state;
        const { accountsData, accountFiatBalance } = getters;
        return accountsData
            .filter((a) => a.type === types_1.AccountType.Default && a.enabled)
            .map((a) => accountFiatBalance(activeWalletId, activeNetwork, a.id))
            .reduce((accum, rawBalance) => {
            const convertedBalance = new bignumber_js_1.BigNumber(rawBalance);
            const balance = convertedBalance.isNaN() ? 0 : convertedBalance;
            return accum.plus(balance || 0);
        }, new bignumber_js_1.BigNumber(0));
    },
    accountItem(...context) {
        const { getters } = (0, _1.rootGetterContext)(context);
        const { accountsData } = getters;
        return (accountId) => {
            const account = accountsData.find((a) => a.id === accountId && a.enabled);
            return account;
        };
    },
    suggestedFeePrices(...context) {
        const { state } = (0, _1.rootGetterContext)(context);
        return (asset) => {
            var _a, _b, _c, _d;
            const assetFees = (_c = (_b = (_a = state.fees) === null || _a === void 0 ? void 0 : _a[state.activeNetwork]) === null || _b === void 0 ? void 0 : _b[state.activeWalletId]) === null || _c === void 0 ? void 0 : _c[asset];
            if (((_d = cryptoassets_1.default[asset]) === null || _d === void 0 ? void 0 : _d.chain) !== cryptoassets_2.ChainId.Polygon) {
                return assetFees;
            }
            const fetchedFees = Object.assign({}, assetFees);
            const incrementMapping = {
                slow: 1,
                average: 2,
                fast: 3,
            };
            Object.keys(fetchedFees).forEach((speed) => {
                const feeSet = fetchedFees[speed].fee.maxPriorityFeePerGas;
                if (feeSet < 30) {
                    fetchedFees[speed].fee.maxPriorityFeePerGas = 30 + incrementMapping[speed];
                }
            });
            return fetchedFees;
        };
    },
    accountsWithBalance(...context) {
        const { getters } = (0, _1.rootGetterContext)(context);
        const { accountsData } = getters;
        return accountsData
            .map((account) => {
            const balances = Object.entries(account.balances)
                .filter(([, balance]) => new bignumber_js_1.BigNumber(balance).gt(0))
                .reduce((accum, [asset, balance]) => {
                return Object.assign(Object.assign({}, accum), { [asset]: balance });
            }, {});
            return Object.assign(Object.assign({}, account), { balances });
        })
            .filter((account) => account.balances && Object.keys(account.balances).length > 0);
    },
    accountsData(...context) {
        var _a;
        const { state, getters } = (0, _1.rootGetterContext)(context);
        const { accounts, activeNetwork, activeWalletId, enabledChains } = state;
        const { accountFiatBalance, assetFiatBalance, assetMarketCap, cryptoassets } = getters;
        const _accounts = ((_a = accounts[activeWalletId]) === null || _a === void 0 ? void 0 : _a[activeNetwork])
            ? accounts[activeWalletId][activeNetwork].filter((account) => {
                var _a, _b;
                return account.assets &&
                    account.enabled &&
                    account.assets.length > 0 &&
                    ((_b = (_a = enabledChains[activeWalletId]) === null || _a === void 0 ? void 0 : _a[activeNetwork]) === null || _b === void 0 ? void 0 : _b.includes(account.chain));
            })
                .map((account) => {
                const totalFiatBalance = accountFiatBalance(activeWalletId, activeNetwork, account.id);
                const assetsWithFiat = [];
                const assetsWithMarketCap = [];
                const assetsWithTokenBalance = [];
                let assetsMarketCap = {};
                let hasFiat = false;
                let hasTokenBalance = false;
                let nativeAssetMarketCap = new bignumber_js_1.BigNumber(0);
                const fiatBalances = Object.entries(account.balances).reduce((accum, [asset, balance]) => {
                    const fiat = assetFiatBalance(asset, new bignumber_js_1.BigNumber(balance));
                    const marketCap = assetMarketCap(asset);
                    const tokenBalance = account.balances[asset];
                    let type = cryptoassets_2.AssetTypes.erc20;
                    let matchingAsset;
                    const assetByCode = cryptoassets[asset];
                    if (assetByCode) {
                        type = assetByCode.type;
                        matchingAsset = assetByCode.matchingAsset;
                    }
                    if (fiat) {
                        hasFiat = true;
                        assetsWithFiat.push({ asset, type, amount: fiat });
                    }
                    else if (marketCap) {
                        if (type === cryptoassets_2.AssetTypes.native && !matchingAsset) {
                            nativeAssetMarketCap = marketCap;
                        }
                        assetsWithMarketCap.push({ asset, type, amount: marketCap || new bignumber_js_1.BigNumber(0) });
                    }
                    else {
                        if (!hasTokenBalance) {
                            hasTokenBalance = new bignumber_js_1.BigNumber(tokenBalance).gt(0);
                        }
                        assetsWithTokenBalance.push({ asset, type, amount: new bignumber_js_1.BigNumber(tokenBalance) });
                    }
                    assetsMarketCap = Object.assign(Object.assign({}, assetsMarketCap), { [asset]: marketCap || new bignumber_js_1.BigNumber(0) });
                    return Object.assign(Object.assign({}, accum), { [asset]: fiat });
                }, {});
                const sortedAssetsByFiat = (0, lodash_1.orderBy)(assetsWithFiat, 'amount', 'desc');
                const sortedAssetsByMarketCap = (0, lodash_1.orderBy)(assetsWithMarketCap, 'amount', 'desc');
                const sortedAssetsByTokenBalance = (0, lodash_1.orderBy)(assetsWithTokenBalance, 'amount', 'desc');
                const orderedAssets = (0, utils_1.orderAssets)(hasFiat, hasTokenBalance, sortedAssetsByFiat, sortedAssetsByMarketCap, sortedAssetsByTokenBalance);
                return Object.assign(Object.assign({}, account), { assets: orderedAssets.length ? orderedAssets : account.assets, nativeAssetMarketCap,
                    assetsMarketCap,
                    fiatBalances,
                    totalFiatBalance });
            })
                .sort(utils_1.orderChains)
                .reduce((acc, account) => {
                var _a;
                const { chain } = account;
                acc[chain] = (_a = acc[chain]) !== null && _a !== void 0 ? _a : [];
                acc[chain].push(account);
                return acc;
            }, {})
            : [];
        return Object.values(_accounts).flat();
    },
    accountFiatBalance(...context) {
        const { state, getters } = (0, _1.rootGetterContext)(context);
        const { accounts } = state;
        const { assetFiatBalance } = getters;
        return (walletId, network, accountId) => {
            var _a;
            const account = (_a = accounts[walletId]) === null || _a === void 0 ? void 0 : _a[network].find((a) => a.id === accountId);
            if (account) {
                return Object.entries(account.balances).reduce((accum, [asset, balance]) => {
                    const fiat = assetFiatBalance(asset, new bignumber_js_1.BigNumber(balance));
                    return accum.plus(fiat || 0);
                }, new bignumber_js_1.default(0));
            }
            return new bignumber_js_1.default(0);
        };
    },
    assetFiatBalance(...context) {
        const { state, getters } = (0, _1.rootGetterContext)(context);
        const { fiatRates } = state;
        const { cryptoassets } = getters;
        return (asset, balance) => {
            if (fiatRates && fiatRates[asset] && (balance === null || balance === void 0 ? void 0 : balance.gt(0))) {
                const amount = (0, cryptoassets_2.unitToCurrency)(cryptoassets[asset], balance);
                return (0, coinFormatter_1.cryptoToFiat)(amount, fiatRates[asset]);
            }
            return null;
        };
    },
    assetMarketCap(...context) {
        const { state } = (0, _1.rootGetterContext)(context);
        const { currenciesInfo } = state;
        return (asset) => {
            if (currenciesInfo && currenciesInfo[asset]) {
                const marketCap = currenciesInfo[asset];
                return new bignumber_js_1.BigNumber(marketCap);
            }
            return null;
        };
    },
    chainAssets(...context) {
        const { getters } = (0, _1.rootGetterContext)(context);
        const { accountsWithBalance, accountsData, cryptoassets } = getters;
        const data = accountsWithBalance.reduce((acc, { chain, assets, balances }) => {
            return Object.assign(Object.assign({}, acc), { [chain]: assets.filter((asset) => Object.keys(balances).includes(asset)) });
        }, {});
        accountsData.forEach(({ assets, chain }) => {
            var _a;
            data[chain] = (_a = data[chain]) !== null && _a !== void 0 ? _a : [];
            assets.reduce((acc, asset) => {
                if (!data[chain].includes(asset)) {
                    return Object.assign(Object.assign({}, acc), { [chain]: data[chain].push(asset) });
                }
                return data;
            }, {});
        });
        Object.entries(cryptoassets).reduce((acc, [asset, { chain }]) => {
            var _a;
            data[chain] = (_a = data[chain]) !== null && _a !== void 0 ? _a : [];
            if (!data[chain].includes(asset)) {
                return Object.assign(Object.assign({}, acc), { [chain]: data[chain].push(asset) });
            }
            return data;
        }, {});
        return data;
    },
    analyticsEnabled(...context) {
        const { state } = (0, _1.rootGetterContext)(context);
        return !!(state.analytics && state.analytics.acceptedDate != null && state.analytics.acceptedDate > 0);
    },
    allNftCollections(...context) {
        const { getters } = (0, _1.rootGetterContext)(context);
        const accounts = getters.accountsData;
        const allNftCollections = accounts.reduce((allCollections, account) => {
            const collections = getters.accountNftCollections(account.id);
            const collectionsWithAccount = (0, lodash_1.mapValues)(collections, (nfts) => {
                return nfts.map((nft) => (Object.assign(Object.assign({}, nft), { accountId: account.id })));
            });
            return Object.assign(Object.assign({}, allCollections), collectionsWithAccount);
        }, {});
        return allNftCollections;
    },
    accountNftCollections(...context) {
        const { getters } = (0, _1.rootGetterContext)(context);
        return (accountId) => {
            const account = getters.accountItem(accountId);
            if (!(account === null || account === void 0 ? void 0 : account.nfts) || !account.nfts.length)
                return {};
            return account.nfts.reduce((collections, nft) => {
                var _a;
                (collections[_a = nft.collection.name] || (collections[_a] = [])).push(nft);
                collections[nft.collection.name].sort((nftA, nftB) => {
                    return nftA.starred === nftB.starred ? 0 : nftA.starred ? -1 : 1;
                });
                return collections;
            }, {});
        };
    },
    mergedChainSettings(...context) {
        var _a;
        const { state } = (0, _1.rootGetterContext)(context);
        const { customChainSeetings, activeNetwork, activeWalletId } = state;
        const _customSettings = ((_a = customChainSeetings[activeNetwork]) === null || _a === void 0 ? void 0 : _a[activeWalletId]) || {};
        const settings = settings_1.defaultChainSettings[activeNetwork] || {};
        return Object.assign(Object.assign({}, settings), _customSettings);
    },
    chainSettings(...context) {
        const { state: { enabledChains, activeNetwork, activeWalletId }, getters: { mergedChainSettings }, } = (0, _1.rootGetterContext)(context);
        return Object.keys(mergedChainSettings)
            .filter((chain) => { var _a, _b; return (_b = (_a = enabledChains[activeWalletId]) === null || _a === void 0 ? void 0 : _a[activeNetwork]) === null || _b === void 0 ? void 0 : _b.includes(chain); })
            .map((c) => {
            const network = mergedChainSettings[c];
            const asset = (0, cryptoassets_2.getNativeAssetCode)(activeNetwork, c);
            return { chain: c, asset, network };
        });
    },
};
//# sourceMappingURL=getters.js.map