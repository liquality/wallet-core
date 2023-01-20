"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipleAccountSupport = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const build_config_1 = tslib_1.__importDefault(require("../../build.config"));
const accounts_1 = require("../../utils/accounts");
const types_1 = require("../types");
exports.multipleAccountSupport = {
    version: 5,
    migrate: (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const { enabledAssets } = state;
        const walletId = state.activeWalletId;
        const accounts = {
            [walletId]: {
                mainnet: [],
                testnet: [],
            },
        };
        build_config_1.default.networks.forEach((network) => {
            var _a;
            const assetKeys = ((_a = enabledAssets[network]) === null || _a === void 0 ? void 0 : _a[walletId]) || [];
            build_config_1.default.chains.forEach((chainId) => {
                var _a, _b, _c, _d, _e, _f;
                const assets = assetKeys.filter((asset) => {
                    return (0, cryptoassets_1.getAsset)(network, asset).chain === chainId;
                });
                const chain = (0, cryptoassets_1.getChain)(network, chainId);
                const addresses = [];
                if (state.addresses &&
                    ((_a = state.addresses) === null || _a === void 0 ? void 0 : _a[network]) &&
                    ((_c = (_b = state.addresses) === null || _b === void 0 ? void 0 : _b[network]) === null || _c === void 0 ? void 0 : _c[walletId]) &&
                    ((_f = (_e = (_d = state.addresses) === null || _d === void 0 ? void 0 : _d[network]) === null || _e === void 0 ? void 0 : _e[walletId]) === null || _f === void 0 ? void 0 : _f[chain.nativeAsset[0].code])) {
                    addresses.push(state.addresses[network][walletId][chain.nativeAsset[0].code]);
                }
                const _account = (0, accounts_1.accountCreator)({
                    walletId,
                    network,
                    account: {
                        name: `${chain.name} 1`,
                        chain: chainId,
                        addresses,
                        assets,
                        balances: {},
                        type: types_1.AccountType.Default,
                        index: 0,
                        color: (0, accounts_1.getNextAccountColor)(chainId, 0),
                    },
                });
                accounts[walletId][network].push(_account);
            });
        });
        delete state.addresses;
        delete state.balances;
        const customTokens = {
            mainnet: {
                [walletId]: (_b = (_a = state.customTokens.mainnet) === null || _a === void 0 ? void 0 : _a[walletId]) === null || _b === void 0 ? void 0 : _b.map((token) => {
                    const newCustomToken = Object.assign(Object.assign({}, token), { chain: token.network });
                    delete newCustomToken.network;
                    return newCustomToken;
                }),
            },
            testnet: {
                [walletId]: (_d = (_c = state.customTokens.testnet) === null || _c === void 0 ? void 0 : _c[walletId]) === null || _d === void 0 ? void 0 : _d.map((token) => {
                    const newCustomToken = Object.assign(Object.assign({}, token), { chain: token.network });
                    delete newCustomToken.network;
                    return newCustomToken;
                }),
            },
        };
        const migrateHistory = (state, network, walletId) => {
            var _a, _b;
            return ((_b = (_a = state.history[network]) === null || _a === void 0 ? void 0 : _a[walletId]) === null || _b === void 0 ? void 0 : _b.filter((item) => !['QUOTE', 'SECRET_READY'].includes(item.status)).map((item) => ['INITIATION_REPORTED', 'INITIATION_CONFIRMED'].includes(item.status) ? Object.assign(Object.assign({}, item), { status: 'FUNDED' }) : item).map((item) => {
                if (item.type !== 'SWAP')
                    return item;
                const allAssets = (0, cryptoassets_1.getAllAssets)();
                const fromChain = allAssets[network][item.from].chain;
                const toChain = allAssets[network][item.to].chain;
                const fromAccountId = accounts[walletId][network].find((account) => account.chain === fromChain).id;
                const toAccountId = accounts[walletId][network].find((account) => account.chain === toChain).id;
                return Object.assign(Object.assign({}, item), { fromAccountId, toAccountId });
            }));
        };
        const history = {
            mainnet: {
                [walletId]: migrateHistory(state, types_1.Network.Mainnet, walletId),
            },
            testnet: {
                [walletId]: migrateHistory(state, types_1.Network.Testnet, walletId),
            },
        };
        return Object.assign(Object.assign({}, state), { accounts, customTokens, history });
    }),
};
//# sourceMappingURL=5_multiple_account_support.js.map