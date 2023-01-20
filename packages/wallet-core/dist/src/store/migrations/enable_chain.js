"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableChain = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const accounts_1 = require("../../utils/accounts");
const derivationPath_1 = require("../../utils/derivationPath");
const networks_1 = require("../../utils/networks");
const types_1 = require("../types");
function enableChain(state, chainId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const accounts = {};
        const enabledChains = {};
        for (const walletId in state.accounts) {
            accounts[walletId] = {};
            enabledChains[walletId] = {};
            for (const network of networks_1.Networks) {
                const accountExists = state.accounts[walletId][network].find((account) => account.chain === chainId);
                if (accountExists) {
                    accounts[walletId][network] = [...state.accounts[walletId][network]];
                }
                else {
                    const chain = (0, cryptoassets_1.getChain)(network, chainId);
                    const derivationPath = (0, derivationPath_1.getDerivationPath)(chainId, network, 0, types_1.AccountType.Default);
                    const account = (0, accounts_1.accountCreator)({
                        walletId,
                        network,
                        account: {
                            name: `${chain.name} 1`,
                            alias: '',
                            chain: chainId,
                            addresses: [],
                            assets: chain.nativeAsset.map((nativeAsset) => nativeAsset.code),
                            balances: {},
                            type: types_1.AccountType.Default,
                            index: 0,
                            derivationPath,
                            color: (0, accounts_1.getNextAccountColor)(chainId, 0),
                        },
                    });
                    accounts[walletId][network] = [...state.accounts[walletId][network], account];
                }
                const chainEnabled = state.enabledChains[walletId][network].includes(chainId);
                if (chainEnabled) {
                    enabledChains[walletId][network] = [...state.enabledChains[walletId][network]];
                }
                else {
                    enabledChains[walletId][network] = [...state.enabledChains[walletId][network], chainId];
                }
            }
        }
        const enabledAssets = {};
        for (const network of networks_1.Networks) {
            enabledAssets[network] = {};
            for (const walletId in state.enabledAssets[network]) {
                enabledAssets[network][walletId] = [...state.enabledAssets[network][walletId]];
                const chain = (0, cryptoassets_1.getChain)(network, chainId);
                const nativeAssetsCodes = chain.nativeAsset.map((nativeAsset) => nativeAsset.code);
                for (const nativeAssetCode of nativeAssetsCodes) {
                    if (!enabledAssets[network][walletId].includes(nativeAssetCode))
                        enabledAssets[network][walletId].push(nativeAssetCode);
                }
            }
        }
        return Object.assign(Object.assign({}, state), { enabledChains,
            enabledAssets,
            accounts });
    });
}
exports.enableChain = enableChain;
//# sourceMappingURL=enable_chain.js.map