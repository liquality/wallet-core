"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWallet = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const uuid_1 = require("uuid");
const __1 = require("..");
const build_config_1 = tslib_1.__importDefault(require("../../build.config"));
const accounts_1 = require("../../utils/accounts");
const crypto_1 = require("../../utils/crypto");
const types_1 = require("../types");
const createWallet = (context, { key, mnemonic, imported = false }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    const id = (0, uuid_1.v4)();
    const at = Date.now();
    const name = 'Account 1';
    const wallet = { id, name, mnemonic, at, imported };
    const { networks, defaultAssets } = build_config_1.default;
    const { encrypted: encryptedWallets, keySalt } = yield (0, crypto_1.encrypt)(JSON.stringify([wallet]), key);
    commit.CREATE_WALLET({ key, keySalt, encryptedWallets, wallet });
    commit.CHANGE_ACTIVE_WALLETID({ walletId: id });
    commit.ENABLE_ASSETS({
        network: types_1.Network.Mainnet,
        walletId: id,
        assets: defaultAssets.mainnet,
    });
    commit.ENABLE_ASSETS({
        network: types_1.Network.Testnet,
        walletId: id,
        assets: defaultAssets.testnet,
    });
    networks.forEach((network) => {
        const assetKeys = defaultAssets[network];
        build_config_1.default.chains.forEach((chainId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            commit.TOGGLE_BLOCKCHAIN({
                network,
                walletId: id,
                chainId,
                enable: true,
            });
            const assets = assetKeys.filter((asset) => {
                var _a;
                return ((_a = (0, cryptoassets_1.getAsset)(network, asset)) === null || _a === void 0 ? void 0 : _a.chain) === chainId;
            });
            const chain = (0, cryptoassets_1.getChain)(network, chainId);
            const _account = (0, accounts_1.accountCreator)({
                walletId: id,
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
            commit.CREATE_ACCOUNT({ network, walletId: id, account: _account });
            if (imported && chainId === cryptoassets_1.ChainId.Rootstock) {
                const coinType = network === 'mainnet' ? '137' : '37310';
                const chain = (0, cryptoassets_1.getChain)(network, cryptoassets_1.ChainId.Rootstock);
                const _account = (0, accounts_1.accountCreator)({
                    walletId: id,
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
                commit.CREATE_ACCOUNT({ network, walletId: id, account: _account });
            }
        }));
    });
    return wallet;
});
exports.createWallet = createWallet;
//# sourceMappingURL=createWallet.js.map