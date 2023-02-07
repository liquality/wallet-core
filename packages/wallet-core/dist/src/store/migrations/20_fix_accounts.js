"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMissingAccounts = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const __1 = require("../..");
const accounts_1 = require("../../utils/accounts");
const types_1 = require("../types");
exports.addMissingAccounts = {
    version: 20,
    migrate: (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const walletId = state.activeWalletId;
        const accounts = { [walletId]: { mainnet: [], testnet: [] } };
        const { networks, defaultAssets } = __1.buildConfig;
        networks.forEach((network) => {
            const assetKeys = defaultAssets[network];
            __1.buildConfig.chains.forEach((chainId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const assets = assetKeys.filter((asset) => {
                    var _a;
                    return ((_a = (0, cryptoassets_1.getAsset)(network, asset)) === null || _a === void 0 ? void 0 : _a.chain) === chainId;
                });
                const chain = (0, cryptoassets_1.getChain)(network, chainId);
                const _account = (0, accounts_1.accountCreator)({
                    walletId: walletId,
                    network,
                    account: {
                        name: `${chain.name} 1`,
                        alias: '',
                        chain: chainId,
                        addresses: [],
                        assets,
                        balances: {},
                        type: types_1.AccountType.Default,
                        index: 0,
                        color: (0, accounts_1.getNextAccountColor)(chainId, 0),
                        enabled: true,
                    },
                });
                accounts[walletId][network].push(_account);
                if (chainId === cryptoassets_1.ChainId.Rootstock) {
                    const coinType = network === 'mainnet' ? '137' : '37310';
                    const chain = (0, cryptoassets_1.getChain)(network, cryptoassets_1.ChainId.Rootstock);
                    const _account = (0, accounts_1.accountCreator)({
                        walletId: walletId,
                        network,
                        account: {
                            name: `Legacy ${chain.name} 1`,
                            alias: '',
                            chain: cryptoassets_1.ChainId.Rootstock,
                            addresses: [],
                            assets,
                            balances: {},
                            type: types_1.AccountType.Default,
                            index: 0,
                            derivationPath: `m/44'/${coinType}'/0'/0/0`,
                            color: (0, accounts_1.getNextAccountColor)(cryptoassets_1.ChainId.Rootstock, 1),
                            enabled: true,
                        },
                    });
                    accounts[walletId][network].push(_account);
                }
            }));
        });
        const newState = Object.assign(Object.assign({}, state), { accounts });
        return newState;
    }),
};
//# sourceMappingURL=20_fix_accounts.js.map