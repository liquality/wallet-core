"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccountBalance = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const __1 = require("..");
const chainify_1 = require("../../utils/chainify");
const updateAccountBalance = (context, { network, walletId, accountId }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { state, commit, getters } = (0, __1.rootActionContext)(context);
    const accounts = ((_a = state.accounts[walletId]) === null || _a === void 0 ? void 0 : _a[network].filter((a) => a.assets && a.assets.length > 0 && a.enabled)) || [];
    const index = accounts === null || accounts === void 0 ? void 0 : accounts.findIndex((a) => a.id === accountId);
    if (index >= 0) {
        const account = accounts[index];
        const { assets } = account;
        yield bluebird_1.default.map(assets, (asset) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const chainId = getters.cryptoassets[asset].chain;
            const _client = getters.client({ network, walletId, chainId, accountId });
            const addresses = yield _client.wallet.getUsedAddresses();
            const _assets = (0, chainify_1.assetsAdapter)(asset);
            const balance = addresses.length === 0 ? '0' : (yield _client.chain.getBalance(addresses, _assets)).toString();
            commit.UPDATE_BALANCE({ network, accountId, walletId, asset, balance });
        }));
    }
});
exports.updateAccountBalance = updateAccountBalance;
//# sourceMappingURL=updateAccountBalance.js.map