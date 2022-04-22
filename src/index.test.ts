import {setupWallet} from './index';
import defaultWalletOptions from './walletOptions/defaultOptions';
import buildConfig from "./build.config";

test('Initial State with RSK Legacy Derivation', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    expect(wallet.state.rskLegacyDerivation).toBe(false);
    expect(wallet.state.version).toBe(18);
    expect(wallet.state.activeNetwork).toBe('mainnet');
    expect(wallet.state.injectEthereumChain).toBe('ethereum');
    expect(wallet.state.injectEthereum).toBe(true);
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
    console.log(JSON.stringify(wallet.state));
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

test('Should be able to validate analytics true', async () => {
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
    console.log(JSON.stringify(wallet.state));
    expect(wallet.state.analytics.userId).not.toBe(null);
    expect(wallet.state.analytics.acceptedDate).not.toBe(0);
    expect(wallet.state.analytics.askedDate).not.toBe(0);
    expect(wallet.state.analytics.askedTimes).toBe(0);
    expect(wallet.state.analytics.notAskAgain).toBe(false);
})



