"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBalances = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const __1 = require("..");
const chainify_1 = require("../../utils/chainify");
const updateBalances = (context, request) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { walletId, network } = request;
    const { state, commit, getters } = (0, __1.rootActionContext)(context);
    const wallet = state.accounts[walletId];
    if (wallet) {
        const accountIds = request.accountIds ||
            wallet[network].reduce((filtered, account) => {
                if (account.enabled) {
                    filtered.push(account.id);
                }
                return filtered;
            }, []);
        const evmAccounts = getEvmAccountsWithMulticalEnabled(context, accountIds, network, walletId);
        updateEVMBalances(context, evmAccounts, network, walletId);
        yield bluebird_1.default.map(accountIds, (accountId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const account = getters.accountItem(accountId);
            if (account && !evmAccounts[account.chain]) {
                const { assets, chain } = account;
                const client = getters.client({ network, walletId, chainId: chain, accountId: account.id });
                const addresses = yield client.wallet.getUsedAddresses();
                updateAccountAddresses(context, account, addresses, network, walletId);
                if (addresses.length === 0) {
                    assets.forEach((a) => commit.UPDATE_BALANCE({ network, accountId: account.id, walletId, asset: a, balance: '0' }));
                }
                else {
                    try {
                        const chainifyAssets = (0, chainify_1.assetsAdapter)(assets);
                        const assetsChunks = (0, lodash_1.chunk)(chainifyAssets, 25);
                        const balances = yield Promise.all(assetsChunks.map((chunk) => client.chain.getBalance(addresses, chunk)));
                        assetsChunks.forEach((_assets, index) => _assets.forEach((asset, innerIndex) => {
                            const balance = balances[index][innerIndex];
                            if (balance) {
                                commit.UPDATE_BALANCE({
                                    network,
                                    accountId: account.id,
                                    walletId,
                                    asset: assets[innerIndex],
                                    balance: balance.toString(),
                                });
                            }
                            else {
                                console.debug(`Balance not fetched: ${asset.code}`);
                            }
                        }));
                    }
                    catch (err) {
                        console.debug('Connected network ', client.chain.getNetwork());
                        console.debug(`Chain: ${chain} Balance update error:  `, err.message);
                    }
                }
            }
        }), { concurrency: 5 }).catch((error) => {
            console.debug(`Bluebird failed: ${JSON.stringify(error)}`);
        });
    }
});
exports.updateBalances = updateBalances;
const updateAccountAddresses = (context, account, addresses, network, walletId) => {
    const { commit } = (0, __1.rootActionContext)(context);
    let updatedAddresses = [];
    if (account.chain === cryptoassets_1.ChainId.Bitcoin) {
        const addressExists = addresses.some((a) => account.addresses.includes(a.toString()));
        if (!addressExists) {
            updatedAddresses = [...account.addresses, ...addresses.map((a) => a.toString())];
        }
        else {
            updatedAddresses = [...account.addresses];
        }
    }
    else {
        updatedAddresses = [...addresses.map((a) => a.toString())];
    }
    commit.UPDATE_ACCOUNT_ADDRESSES({
        network,
        accountId: account.id,
        walletId,
        addresses: updatedAddresses,
    });
};
const getEvmAccountsWithMulticalEnabled = (context, accountIds, network, walletId) => {
    const { getters } = (0, __1.rootActionContext)(context);
    return accountIds.reduce((result, a) => {
        const acc = getters.accountItem(a);
        if (acc) {
            const chain = (0, cryptoassets_1.getChain)(network, acc.chain);
            if (chain.isEVM) {
                const client = getters.client({
                    network,
                    walletId,
                    chainId: acc.chain,
                    accountId: a,
                });
                if (client.chain.multicall) {
                    if (!result[acc.chain]) {
                        result[acc.chain] = [];
                    }
                    result[acc.chain].push(acc);
                }
            }
        }
        return result;
    }, {});
};
const updateEVMBalances = (context, evmAccounts, network, walletId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { getters, commit } = (0, __1.rootActionContext)(context);
    yield bluebird_1.default.map(Object.entries(evmAccounts), ([chain, accounts]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const evmAccount = accounts[0];
        const client = getters.client({
            network,
            walletId,
            chainId: chain,
            accountId: evmAccount.id,
        });
        const addressesForAllAccounts = yield Promise.all(accounts.map((a) => {
            return getters
                .client({
                network,
                walletId,
                chainId: a.chain,
                accountId: a.id,
            })
                .wallet.getUsedAddresses();
        }));
        accounts.map((acc, index) => {
            updateAccountAddresses(context, acc, addressesForAllAccounts[index], network, walletId);
        });
        const multicallCallData = accounts.reduce((result, a, index) => {
            const user = addressesForAllAccounts[index][0].toString();
            a.assets.forEach((asset) => {
                const chainifyAsset = (0, chainify_1.assetsAdapter)(asset)[0];
                const callData = client.chain.multicall.buildBalanceCallData(chainifyAsset, user);
                result.push(callData);
            });
            return result;
        }, []);
        const result = yield client.chain.multicall.multicall(multicallCallData);
        accounts.forEach((acc) => {
            const balances = result.splice(0, acc.assets.length).map((balance, index) => {
                if (balance) {
                    return balance.toString();
                }
                else {
                    console.debug(`Balance not fetched: ${acc.assets[index]}`);
                    return null;
                }
            });
            commit.UPDATE_MULTIPLE_BALANCES({
                network,
                accountId: acc.id,
                walletId,
                assets: acc.assets,
                balances,
            });
        });
    }), { concurrency: 5 }).catch((error) => {
        console.debug(`Bluebird EVM Balances failed: ${JSON.stringify(error)}`);
    });
});
//# sourceMappingURL=updateBalances.js.map