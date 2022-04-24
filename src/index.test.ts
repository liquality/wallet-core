import {setupWallet} from './index';
import defaultWalletOptions from './walletOptions/defaultOptions';
import buildConfig from "./build.config";
import {ExperimentType, FeeLabel, Network} from "./store/types";
import {ChainId} from "@liquality/cryptoassets";
import BN from "bignumber.js";

test('Initial State of wallet setup', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    expect(wallet.state.rskLegacyDerivation).toBe(false);
    expect(wallet.state.version).toBe(18);
    expect(wallet.state.activeNetwork).toBe('mainnet');
    expect(wallet.state.injectEthereumChain).toBe('ethereum');
    expect(wallet.state.injectEthereum).toBe(true);
});

test('should be able to create wallet and change network', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: false,
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].id).not.toBe(undefined);
    expect(wallet.state.wallets[0].name).toEqual("Account 1")
    expect(wallet.state.wallets[0].mnemonic).toBe('test');
    expect(wallet.state.wallets[0].at).not.toBe(0);
    expect(wallet.state.unlockedAt).toBe(0);
    expect(wallet.state.activeNetwork).toBe('mainnet');
    expect(wallet.state.wallets[0].imported).toBe(false);
    expect(wallet.state.activeWalletId).not.toBe(null);
    const numberOfAccounts = wallet.state.accounts;
    const walletId = wallet.state.activeWalletId;
    expect(numberOfAccounts[walletId]).not.toBe(undefined);
    expect(numberOfAccounts[walletId]).toHaveProperty("mainnet");
    expect(numberOfAccounts[walletId]).toHaveProperty("testnet");
    expect(wallet.state.enabledChains[walletId]).toHaveProperty("mainnet");
    expect(wallet.state.enabledChains[walletId]).toHaveProperty("testnet");
    expect(wallet.state.enabledChains[walletId]).toHaveProperty("testnet");
    expect(wallet.state.enabledChains[walletId]).toHaveProperty("mainnet");

    // change network
    await wallet.dispatch.changeActiveNetwork({
        network: Network.Testnet
    });
    expect(wallet.state.activeNetwork).toBe("testnet");
});

test('should be able to create wallet and validate mainnet accounts', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: false,
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].id).not.toBe(undefined);
    expect(wallet.state.wallets[0].name).toEqual("Account 1")
    expect(wallet.state.wallets[0].mnemonic).toBe('test');
    expect(wallet.state.wallets[0].at).not.toBe(0);
    expect(wallet.state.unlockedAt).toBe(0);
    expect(wallet.state.wallets[0].imported).toBe(false);
    expect(wallet.state.activeWalletId).not.toBe(null);
    const numberOfAccounts = wallet.state.accounts;
    const walletId = wallet.state.activeWalletId;
    expect(numberOfAccounts[walletId]).not.toBe(undefined);
    expect(numberOfAccounts[walletId]).toHaveProperty("mainnet");
    expect(numberOfAccounts[walletId]).toHaveProperty("testnet");
    expect(wallet.state.enabledChains[walletId]).toHaveProperty("mainnet");
    expect(wallet.state.enabledChains[walletId]).toHaveProperty("testnet");
    expect(wallet.state.enabledChains[walletId]).toHaveProperty("testnet");
    expect(wallet.state.enabledChains[walletId]).toHaveProperty("mainnet");
});

test('Should be able to validate enabled chains', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.acceptTermsAndConditions({analyticsAccepted: true});
    await wallet.dispatch.setupWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    await wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    await wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });

    await wallet.dispatch.setWatsNewModalShowed({
        version: "1.0.0",
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);
    expect(wallet.state.termsAcceptedAt).not.toBe(0);

    expect(wallet.state.watsNewModalVersion).toBe("1.0.0");
    expect(wallet.state.keyUpdatedAt).not.toBe(0);
    expect(wallet.state.unlockedAt).not.toBe(0);
    expect(wallet.state.setupAt).not.toBe(0);


    const walletId = wallet.state.activeWalletId;
    const mainnetAccounts = wallet.state.enabledChains[walletId]?.mainnet;
    const testnetAccounts = wallet.state.enabledChains[walletId]?.testnet;
    expect(mainnetAccounts).toEqual(buildConfig.chains);
    expect(testnetAccounts).toEqual(buildConfig.chains);
    expect(mainnetAccounts?.length).toEqual(10);
    expect(testnetAccounts?.length).toEqual(10);
})

test('Should be able to validate assets with analytics false', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    await wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    await wallet.dispatch.initializeAnalyticsPreferences({
        accepted: false,
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);

    expect(wallet.state.analytics.userId).not.toBe(null);
    expect(wallet.state.analytics.acceptedDate).toBe(0);
    expect(wallet.state.analytics.askedDate).not.toBe(0);
    expect(wallet.state.analytics.askedTimes).toBe(0);
    expect(wallet.state.analytics.notAskAgain).toBe(false);

    const walletId = wallet.state.activeWalletId;
    const mainnetEnabledAssets = wallet.state.enabledAssets.mainnet?.[walletId];
    const testnetEnabledAssets = wallet.state.enabledAssets.testnet?.[walletId];
    expect(mainnetEnabledAssets?.length).toBeGreaterThan(1);
    expect(testnetEnabledAssets?.length).toBeGreaterThan(1);
})

test('Should be able to create wallet with validate analytics true', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    await wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);

    await wallet.dispatch.initializeAnalyticsPreferences({
        accepted: true,
    });
    expect(wallet.state.analytics.userId).not.toBe(null);
    expect(wallet.state.analytics.acceptedDate).not.toBe(0);
    expect(wallet.state.analytics.askedDate).not.toBe(0);
    expect(wallet.state.analytics.askedTimes).toBe(0);
    expect(wallet.state.analytics.notAskAgain).toBe(false);

    await wallet.dispatch.toggleExperiment({
        name: ExperimentType.ManageAccounts,
    });
    expect(wallet.state.experiments.manageAccounts).toBe(true);

})

test('Should be able create wallet and add custom tokens', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    await wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);

    await wallet.dispatch.initializeAnalyticsPreferences({
        accepted: true,
    });

    expect(wallet.state.analytics.userId).not.toBe(null);
    expect(wallet.state.analytics.acceptedDate).not.toBe(0);
    expect(wallet.state.analytics.askedDate).not.toBe(0);
    expect(wallet.state.analytics.askedTimes).toBe(0);
    expect(wallet.state.analytics.notAskAgain).toBe(false);

    await wallet.dispatch.addCustomToken({
        network: Network.Mainnet,
        walletId: wallet.state.activeWalletId,
        chain: ChainId.Ethereum,
        symbol: 'TST',
        name: 'Test Token',
        contractAddress: '0x1234567890123456789012345678901234567890',
        decimals: 18
    });

    expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId][0].symbol).toBe("TST");
    expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId][0].name).toBe("Test Token");
    expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId][0].contractAddress).toBe("0x1234567890123456789012345678901234567890");
    expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId][0].decimals).toBe(18);
    expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId][0].chain).toBe("ethereum");

    await wallet.dispatch.addCustomToken({
        network: Network.Testnet,
        walletId: wallet.state.activeWalletId,
        chain: ChainId.Bitcoin,
        symbol: 'BCTS',
        name: 'Test Bitcoin',
        contractAddress: '0x1234567890123456789012343333378901234567890',
        decimals: 11
    });
    expect(wallet.state.customTokens.testnet?.[wallet.state.activeWalletId][0].symbol).toBe("BCTS");
    expect(wallet.state.customTokens.testnet?.[wallet.state.activeWalletId][0].name).toBe("Test Bitcoin");
    expect(wallet.state.customTokens.testnet?.[wallet.state.activeWalletId][0].contractAddress).toBe("0x1234567890123456789012343333378901234567890");
    expect(wallet.state.customTokens.testnet?.[wallet.state.activeWalletId][0].decimals).toBe(11);
    expect(wallet.state.customTokens.testnet?.[wallet.state.activeWalletId][0].chain).toBe("bitcoin");

})

test('Should be able create wallet and add custom token and remove token', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    await wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);

    await wallet.dispatch.initializeAnalyticsPreferences({
        accepted: true,
    });

    expect(wallet.state.analytics.userId).not.toBe(null);
    expect(wallet.state.analytics.acceptedDate).not.toBe(0);
    expect(wallet.state.analytics.askedDate).not.toBe(0);
    expect(wallet.state.analytics.askedTimes).toBe(0);
    expect(wallet.state.analytics.notAskAgain).toBe(false);

    await wallet.dispatch.addCustomToken({
        network: Network.Mainnet,
        walletId: wallet.state.activeWalletId,
        chain: ChainId.Ethereum,
        symbol: 'TST',
        name: 'Test Token',
        contractAddress: '0x1234567890123456789012345678901234567890',
        decimals: 18
    });

    expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId][0].symbol).toBe("TST");
    expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId][0].name).toBe("Test Token");
    expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId][0].contractAddress).toBe("0x1234567890123456789012345678901234567890");
    expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId][0].decimals).toBe(18);
    expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId][0].chain).toBe("ethereum");

    await wallet.dispatch.addCustomToken({
        network: Network.Testnet,
        walletId: wallet.state.activeWalletId,
        chain: ChainId.Bitcoin,
        symbol: 'BCTS',
        name: 'Test Bitcoin',
        contractAddress: '0x1234567890123456789012343333378901234567890',
        decimals: 11
    });
    expect(wallet.state.customTokens.testnet?.[wallet.state.activeWalletId][0].symbol).toBe("BCTS");
    expect(wallet.state.customTokens.testnet?.[wallet.state.activeWalletId][0].name).toBe("Test Bitcoin");
    expect(wallet.state.customTokens.testnet?.[wallet.state.activeWalletId][0].contractAddress).toBe("0x1234567890123456789012343333378901234567890");
    expect(wallet.state.customTokens.testnet?.[wallet.state.activeWalletId][0].decimals).toBe(11);
    expect(wallet.state.customTokens.testnet?.[wallet.state.activeWalletId][0].chain).toBe("bitcoin");

    await wallet.dispatch.removeCustomToken({
        network: Network.Mainnet,
        walletId: wallet.state.activeWalletId,
        symbol: 'TST',
    });
    expect((wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId].length)).toBe(0);
})

test('should be ble to export private key', async () => {

    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    await wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);

    await wallet.dispatch.initializeAnalyticsPreferences({
        accepted: true,
    });

    expect(wallet.state.analytics.userId).not.toBe(null);
    expect(wallet.state.analytics.acceptedDate).not.toBe(0);
    expect(wallet.state.analytics.askedDate).not.toBe(0);
    expect(wallet.state.analytics.askedTimes).toBe(0);
    expect(wallet.state.analytics.notAskAgain).toBe(false);

    const privateKey = await wallet.dispatch.exportPrivateKey({
        network: Network.Mainnet,
        walletId: wallet.state.activeWalletId,
        accountId: "0",
        chainId: ChainId.Ethereum,
    });
    expect(privateKey).not.toBeNull();
    expect(privateKey).not.toBe(undefined)
});

test('should be ble to get marketData', async () => {

    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    await wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);

    await wallet.dispatch.initializeAnalyticsPreferences({
        accepted: true,
    });

    expect(wallet.state.analytics.userId).not.toBe(null);
    await wallet.dispatch.updateMarketData({
        network: Network.Mainnet
    });
    expect(wallet.state.marketData.mainnet?.length).toBeGreaterThan(10);
});

test('should be able to do send transaction', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    await wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);

    await wallet.dispatch.initializeAnalyticsPreferences({
        accepted: true,
    });

    expect(wallet.state.analytics.userId).not.toBe(null);
    expect(wallet.state.analytics.acceptedDate).not.toBe(0);
    expect(wallet.state.analytics.askedDate).not.toBe(0);
    expect(wallet.state.analytics.askedTimes).toBe(0);
    expect(wallet.state.analytics.notAskAgain).toBe(false);

    const walletId = wallet.state.activeWalletId;
    const mainnetAccounts = wallet?.state?.enabledAssets?.mainnet?.[walletId];
    expect(mainnetAccounts).not.toBeNull();

    // update balance this will generate address
    if (mainnetAccounts) {
        await wallet.dispatch.updateBalances({
            network: Network.Mainnet,
            walletId: walletId,
            assets: mainnetAccounts,
        });
    }

    const account = wallet.state.accounts?.[walletId]?.mainnet?.[1];
    expect(account?.chain).toBe(ChainId.Ethereum);
    const ethAccountId = account?.id;
    const ethereumAddress = account?.addresses[0];
    expect(ethereumAddress).not.toBeNull();

    // update account balances eth
    if (ethAccountId && ethereumAddress) {
        await wallet.dispatch.updateAccountBalance({
            network: Network.Mainnet,
            walletId: wallet.state.activeWalletId,
            accountId: ethAccountId,
        });

        if (mainnetAccounts) {
            await wallet.dispatch.updateBalances({
                network: Network.Mainnet,
                walletId: wallet.state.activeWalletId,
                assets: mainnetAccounts,
            });

            // update fiat rates for all assets
            await wallet.dispatch.updateFiatRates({
                assets: mainnetAccounts
            });
        }
        // update fees for specific asset
        await wallet.dispatch.updateFees({
            asset: "ETH"
        });
        await wallet.dispatch.sendTransaction({
            network: Network.Mainnet,
            walletId: wallet.state.activeWalletId,
            accountId: ethAccountId,
            asset: "ETH",
            to: "0x1234567890123456789012345678901234567890",
            amount: new BN(10000),
            data: "0x1234567890123456789012345678901234567890",
            fee: 0,
            gas: 0,
            feeLabel: FeeLabel.Fast,
            fiatRate: 10,
        });
    }


})

test('should be able validate fiatRates for all mainnet assets', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    await wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);

    await wallet.dispatch.initializeAnalyticsPreferences({
        accepted: true,
    });

    expect(wallet.state.analytics.userId).not.toBe(null);
    expect(wallet.state.analytics.acceptedDate).not.toBe(0);
    expect(wallet.state.analytics.askedDate).not.toBe(0);
    expect(wallet.state.analytics.askedTimes).toBe(0);
    expect(wallet.state.analytics.notAskAgain).toBe(false);

    const walletId = wallet.state.activeWalletId;
    const mainnetAccounts = wallet?.state?.enabledAssets?.mainnet?.[walletId];
    expect(mainnetAccounts).not.toBeNull();

    // update balance this will generate address
    if (mainnetAccounts) {
        await wallet.dispatch.updateBalances({
            network: Network.Mainnet,
            walletId: walletId,
            assets: mainnetAccounts,
        });
    }

    const account = wallet.state.accounts?.[walletId]?.mainnet?.[1];
    expect(account?.chain).toBe(ChainId.Ethereum);
    const ethAccountId = account?.id;
    const ethereumAddress = account?.addresses[0];
    expect(ethereumAddress).not.toBeNull();

    // update account balances eth
    if (ethAccountId && ethereumAddress) {
        await wallet.dispatch.updateAccountBalance({
            network: Network.Mainnet,
            walletId: wallet.state.activeWalletId,
            accountId: ethAccountId,
        });

        if (mainnetAccounts) {
            await wallet.dispatch.updateBalances({
                network: Network.Mainnet,
                walletId: wallet.state.activeWalletId,
                assets: mainnetAccounts,
            });

            // update fiat rates for all assets
            await wallet.dispatch.updateFiatRates({
                assets: mainnetAccounts
            });
        }
    }
    // validate fiat rates & validate balances
    expect((Object.keys(wallet.state.fiatRates)).length).toBeGreaterThan(0)
    const fiatRatesObject = Object.values(wallet.state.fiatRates);
    for (let i = 0; i < fiatRatesObject.length; i++) {
        const fiatRate = fiatRatesObject[i];
        expect(fiatRate).toBeGreaterThan(0);
    }
})

test('should be able validate externalConnections & forgetDappConnections', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: 'test',
        imported: true,
    });
    await wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);

    await wallet.dispatch.initializeAnalyticsPreferences({
        accepted: true,
    });

    expect(wallet.state.analytics.userId).not.toBe(null);
    expect(wallet.state.analytics.acceptedDate).not.toBe(0);
    expect(wallet.state.analytics.askedDate).not.toBe(0);
    expect(wallet.state.analytics.askedTimes).toBe(0);
    expect(wallet.state.analytics.notAskAgain).toBe(false);

    const walletId = wallet.state.activeWalletId;
    const mainnetAccounts = wallet?.state?.enabledAssets?.mainnet?.[walletId];
    expect(mainnetAccounts).not.toBeNull();

    // update balance this will generate address
    if (mainnetAccounts) {
        await wallet.dispatch.updateBalances({
            network: Network.Mainnet,
            walletId: walletId,
            assets: mainnetAccounts,
        });
    }

    const account = wallet.state.accounts?.[walletId]?.mainnet?.[1];
    expect(account?.chain).toBe(ChainId.Ethereum);
    const ethAccountId = account?.id;
    const ethereumAddress = account?.addresses[0];
    expect(ethereumAddress).not.toBeNull();

    const originName = 'https://uniswap.org/'
    if (typeof ethAccountId !== 'undefined' && typeof ethereumAddress !== 'undefined') {
        // external connection
        const externalConnection = {
            origin: originName,
            chain: ChainId.Ethereum,
            accountId: ethAccountId,
            setDefaultEthereum: true,
        }
        await wallet.dispatch.addExternalConnection(externalConnection);
    }

    expect(Object.keys(wallet.state.externalConnections[walletId]).length).toEqual(1);
    expect(wallet.state.externalConnections[walletId]?.[originName]?.defaultEthereum).toEqual(ethAccountId)
    expect(Object.keys(wallet.state.externalConnections[walletId]?.[originName]?.ethereum).length)
        .toBeGreaterThan(0);
    expect(wallet.state.externalConnections[walletId]?.[originName]?.ethereum[0]).toEqual(ethAccountId);

    // forgot dapp connections
    await wallet.dispatch.forgetDappConnections()
    expect(Object.keys(wallet.state.externalConnections[walletId]).length).toEqual(0);
})
