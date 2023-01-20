"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableAssets = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const __1 = require("..");
const accounts_1 = require("../../utils/accounts");
const types_1 = require("../types");
const enableAssets = (context, { network, walletId, assets }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { state, commit, dispatch, getters } = (0, __1.rootActionContext)(context);
    commit.ENABLE_ASSETS({ network, walletId, assets });
    const accounts = ((_a = state.accounts[walletId]) === null || _a === void 0 ? void 0 : _a[network]) || [];
    const accountsChains = accounts.map((a) => a.chain);
    const accountsToCreate = assets
        .filter((asset) => { var _a; return !!((_a = getters.cryptoassets[asset]) === null || _a === void 0 ? void 0 : _a.chain); })
        .map((asset) => { var _a; return (_a = getters.cryptoassets[asset]) === null || _a === void 0 ? void 0 : _a.chain; })
        .filter((chainId) => !accountsChains.includes(chainId))
        .map((chainId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const chain = (0, cryptoassets_1.getChain)(network, chainId);
        const _assets = assets.filter((asset) => { var _a; return ((_a = getters.cryptoassets[asset]) === null || _a === void 0 ? void 0 : _a.chain) === chainId; });
        const _account = (0, accounts_1.accountCreator)({
            walletId,
            network,
            account: {
                name: `${chain.name} 1`,
                chain: chainId,
                addresses: [],
                assets: _assets,
                balances: {},
                type: types_1.AccountType.Default,
                index: 0,
                color: (0, accounts_1.getNextAccountColor)(chainId, 0),
            },
        });
        commit.CREATE_ACCOUNT({ network, walletId, account: _account });
        yield dispatch.getUnusedAddresses({
            network,
            walletId,
            assets: _account.assets,
            accountId: _account.id,
        });
    }));
    if (accountsToCreate.length > 0) {
        yield Promise.all(accountsToCreate);
    }
    accounts.forEach((account) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const accountId = account.id;
        const _assets = assets.filter((asset) => { var _a; return ((_a = getters.cryptoassets[asset]) === null || _a === void 0 ? void 0 : _a.chain) === account.chain; });
        if (_assets && _assets.length > 0) {
            commit.ENABLE_ACCOUNT_ASSETS({
                network,
                walletId,
                assets: _assets,
                accountId,
            });
            yield dispatch.updateAccountBalance({ network, walletId, accountId });
        }
    }));
    dispatch.updateCurrenciesInfo({ assets: [...getters.allNetworkAssets] });
    dispatch.updateFiatRates({ assets: [...getters.allNetworkAssets] });
    dispatch.updateMarketData({ network });
});
exports.enableAssets = enableAssets;
//# sourceMappingURL=enableAssets.js.map