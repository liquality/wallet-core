"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnusedAddresses = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const error_parser_1 = require("@liquality/error-parser");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const cryptoassets_2 = tslib_1.__importDefault(require("../../utils/cryptoassets"));
const __1 = require("..");
const getUnusedAddresses = (context, { network, walletId, assets, accountId, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { state, commit, getters } = (0, __1.rootActionContext)(context);
    return bluebird_1.default.map(assets, (asset) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const accounts = (_a = state.accounts[walletId]) === null || _a === void 0 ? void 0 : _a[network];
        if (!accounts) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Accounts);
        }
        const chainId = cryptoassets_2.default[asset].chain;
        const index = accounts.findIndex((a) => a.id === accountId);
        if (index >= 0 && asset) {
            const account = accounts[index];
            const result = yield getters
                .client({ network, walletId, chainId, accountId: account.id })
                .wallet.getUnusedAddress();
            const address = result.address;
            let updatedAddresses = [];
            if (account.chain === cryptoassets_1.ChainId.Bitcoin) {
                if (!account.addresses.includes(address)) {
                    updatedAddresses = [...account.addresses, address];
                }
                else {
                    updatedAddresses = [...account.addresses];
                }
            }
            else {
                updatedAddresses = [address];
            }
            commit.UPDATE_ACCOUNT_ADDRESSES({
                network,
                accountId: account.id,
                walletId,
                addresses: updatedAddresses,
            });
            return address;
        }
        return '';
    }), { concurrency: 7 });
});
exports.getUnusedAddresses = getUnusedAddresses;
//# sourceMappingURL=getUnusedAddresses.js.map