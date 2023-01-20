"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rskFishToken = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
exports.rskFishToken = {
    version: 13,
    migrate: (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { activeWalletId, enabledAssets } = state;
        const mainnetAccounts = state.accounts[activeWalletId].mainnet.map((account) => {
            if (account.chain === cryptoassets_1.ChainId.Rootstock) {
                return Object.assign(Object.assign({}, account), { assets: [...account.assets, 'FISH'] });
            }
            return account;
        });
        return Object.assign(Object.assign({}, state), { accounts: Object.assign(Object.assign({}, state.accounts), { [activeWalletId]: Object.assign(Object.assign({}, state.accounts[activeWalletId]), { mainnet: mainnetAccounts }) }), enabledAssets: Object.assign(Object.assign({}, enabledAssets), { mainnet: Object.assign(Object.assign({}, enabledAssets.mainnet), { activeWalletId: [...enabledAssets.mainnet[activeWalletId], 'FISH'] }) }) });
    }),
};
//# sourceMappingURL=13_rsk_fish_token.js.map