"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLedgerAccounts = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const __1 = require("../..");
const derivationPath_1 = require("../../../utils/derivationPath");
const getLedgerAccounts = (context, { network, walletId, asset, accountType, startingIndex, numAccounts, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { getters } = (0, __1.rootActionContext)(context);
    const { client, networkAccounts, assetFiatBalance } = getters;
    const allAssets = (0, cryptoassets_1.getAllAssets)();
    const { chain } = allAssets[network][asset];
    const chainifyAsset = Object.assign(Object.assign({}, allAssets[network][asset]), { isNative: allAssets[network][asset].type === cryptoassets_1.AssetTypes.native });
    const results = [];
    const existingAccounts = networkAccounts.filter((account) => {
        return account.chain === chain;
    });
    const pageIndexes = [...Array(numAccounts || 5).keys()].map((i) => i + startingIndex);
    for (const index of pageIndexes) {
        const derivationPath = (0, derivationPath_1.getDerivationPath)(chain, network, index, accountType);
        let _chainCode = null;
        let _publicKey = null;
        const _client = client({ network, walletId, chainId: chain, accountType, accountIndex: index, useCache: false });
        if (chain === cryptoassets_1.ChainId.Bitcoin) {
            const btcAccount = yield _client.wallet.getWalletPublicKey(derivationPath);
            _chainCode = btcAccount.chainCode;
            _publicKey = btcAccount.publicKey;
        }
        const addresses = yield _client.wallet.getAddresses();
        if (addresses && addresses.length > 0) {
            const [account] = addresses;
            const normalizedAddress = (0, cryptoassets_1.getChain)(network, chain).formatAddress(account.address);
            const existingIndex = existingAccounts.findIndex((a) => {
                const addresses = a.addresses.map((a) => (0, cryptoassets_1.getChain)(network, chain).formatAddress(a));
                return addresses.includes(normalizedAddress);
            });
            const exists = existingIndex >= 0;
            const balance = addresses.length === 0 ? 0 : (yield _client.chain.getBalance(addresses, [chainifyAsset]))[0];
            const fiatBalance = assetFiatBalance(asset, balance) || new bignumber_js_1.default(0);
            const result = {
                account: normalizedAddress,
                balance,
                fiatBalance,
                index,
                exists,
                chainCode: _chainCode,
                publicKey: _publicKey || account.publicKey,
                derivationPath,
            };
            results.push(result);
        }
    }
    return results;
});
exports.getLedgerAccounts = getLedgerAccounts;
//# sourceMappingURL=getLedgerAccounts.js.map