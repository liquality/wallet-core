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
    expect(wallet.state.wallets[0].mnemonic).toBe('test');
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
    console.log(JSON.stringify(wallet.state));
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);

    const walletId = wallet.state.activeWalletId;
    const mainnetAccounts = wallet.state.enabledChains[walletId]?.mainnet;
    const testnetAccounts = wallet.state.enabledChains[walletId]?.testnet;
    expect(mainnetAccounts).toEqual(buildConfig.chains);
    expect(testnetAccounts).toEqual(buildConfig.chains);
    expect(mainnetAccounts?.length).toEqual(10);
    expect(testnetAccounts?.length).toEqual(10);
})



