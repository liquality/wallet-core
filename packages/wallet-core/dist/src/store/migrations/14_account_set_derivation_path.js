"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountSetDerivationPath = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const accounts_1 = require("../../utils/accounts");
const derivationPath_1 = require("../../utils/derivationPath");
const networks_1 = require("../../utils/networks");
const types_1 = require("../types");
exports.accountSetDerivationPath = {
    version: 14,
    migrate: (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const hasAccounts = Object.keys(state.accounts || {}).length > 0;
        if (!hasAccounts) {
            return Object.assign({}, state);
        }
        const _accounts = {};
        for (const walletId in state.accounts) {
            _accounts[walletId] = { mainnet: [], testnet: [] };
            for (const network of networks_1.Networks) {
                const accounts = state.accounts[walletId][network];
                const updatedAccounts = [];
                for (const account of accounts) {
                    const derivationPath = (0, derivationPath_1.getDerivationPath)(account.chain, network, account.index, account.type);
                    const updatedAccount = Object.assign(Object.assign({}, account), { alias: '', addresses: [], balances: {}, derivationPath });
                    updatedAccounts.push(updatedAccount);
                    if (account.chain === cryptoassets_1.ChainId.Rootstock && !account.type.includes('ledger')) {
                        const coinType = network === 'mainnet' ? '137' : '37310';
                        const chain = (0, cryptoassets_1.getChain)(network, cryptoassets_1.ChainId.Rootstock);
                        const _account = (0, accounts_1.accountCreator)({
                            walletId,
                            network,
                            account: {
                                name: `Legacy ${chain.name} 1`,
                                alias: '',
                                chain: cryptoassets_1.ChainId.Rootstock,
                                addresses: [],
                                assets: [...account.assets],
                                balances: {},
                                type: types_1.AccountType.Default,
                                index: 0,
                                derivationPath: `m/44'/${coinType}'/0'/0/0`,
                                color: (0, accounts_1.getNextAccountColor)(cryptoassets_1.ChainId.Rootstock, 1),
                            },
                        });
                        updatedAccounts.push(_account);
                    }
                }
                _accounts[walletId][network] = updatedAccounts;
            }
        }
        delete state.rskLegacyDerivation;
        return Object.assign(Object.assign({}, state), { accounts: _accounts });
    }),
};
//# sourceMappingURL=14_account_set_derivation_path.js.map