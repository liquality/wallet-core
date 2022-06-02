import * as Process from 'process';
import {setupWallet} from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import {LATEST_VERSION} from "./index";

test('Upgrade migrations from wallet versions-2 test, should be able validate accounts-mainnet', async () => {
    jest.setTimeout(90000);
    let wallet = await setupWallet(defaultWalletOptions);
    // setup wallet with migration version - 2
    wallet = setupWallet({
        ...defaultWalletOptions,
        initialState: {
            ...wallet.state,
            version: LATEST_VERSION - 2,
        },
    });
    let TEST_MNEMONIC = Process.env.TEST_MNEMONIC;
    if (!TEST_MNEMONIC) {
        throw new Error('Please set the TEST_MNEMONIC environment variable');
    }
    TEST_MNEMONIC = TEST_MNEMONIC.replace(/,/g, ' ');

    await wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: TEST_MNEMONIC!,
        imported: true,
    });
    await wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });

    expect(wallet.state.activeNetwork).toBe('mainnet');
    let walletId = wallet.state.activeWalletId;
    expect(wallet.state.version).toBe(LATEST_VERSION - 2)
    // validate accounts object
    let accounts = wallet.state.accounts;
    expect(accounts).not.toBeNull();

    let maninNetAccountsLength = wallet.state.accounts?.[walletId]?.mainnet.length;
    expect(maninNetAccountsLength).toBeGreaterThan(0);
    for (let i = 0; i < maninNetAccountsLength!; i++) {
        expect(wallet.state.accounts?.[walletId]?.mainnet[i].enabled).toBeTruthy();
        expect(wallet.state.accounts?.[walletId]?.mainnet[i].type).toBe('default');
    }

    // upgrade to  latest version
    wallet = setupWallet({
        ...defaultWalletOptions,
        initialState: {
            ...wallet.state,
            version: LATEST_VERSION,
        }
    });
    walletId = wallet.state.activeWalletId;
    expect(wallet.state.version).toBe(LATEST_VERSION)
    // validate accounts object after migration to the latest version
    accounts = wallet.state.accounts;
    expect(accounts).not.toBeNull();
    maninNetAccountsLength = wallet.state.accounts?.[walletId]?.mainnet.length;
    expect(maninNetAccountsLength).toBeGreaterThan(0);
    for (let i = 0; i < maninNetAccountsLength!; i++) {
        expect(wallet.state.accounts?.[walletId]?.mainnet[i].enabled).toBeTruthy();
        expect(wallet.state.accounts?.[walletId]?.mainnet[i].type).toBe('default');
    }
});
test('Upgrade migrations from wallet versions-1 test, should be able validate accounts-mainnet', async () => {
    jest.setTimeout(90000);
    let wallet = await setupWallet(defaultWalletOptions);
    // setup wallet with migration version - 1
    wallet = setupWallet({
        ...defaultWalletOptions,
        initialState: {
            ...wallet.state,
            version: LATEST_VERSION - 1,
        },
    });
    let TEST_MNEMONIC = Process.env.TEST_MNEMONIC;
    if (!TEST_MNEMONIC) {
        throw new Error('Please set the TEST_MNEMONIC environment variable');
    }
    TEST_MNEMONIC = TEST_MNEMONIC.replace(/,/g, ' ');

    await wallet.dispatch.createWallet({
        key: '0x1234567890123456789012345678901234567890',
        mnemonic: TEST_MNEMONIC!,
        imported: true,
    });
    await wallet.dispatch.unlockWallet({
        key: '0x1234567890123456789012345678901234567890',
    });

    expect(wallet.state.activeNetwork).toBe('mainnet');
    let walletId = wallet.state.activeWalletId;
    expect(wallet.state.version).toBe(LATEST_VERSION - 1)
    // validate accounts object
    let accounts = wallet.state.accounts;
    expect(accounts).not.toBeNull();

    let maninNetAccountsLength = wallet.state.accounts?.[walletId]?.mainnet.length;
    expect(maninNetAccountsLength).toBeGreaterThan(0);
    for (let i = 0; i < maninNetAccountsLength!; i++) {
        expect(wallet.state.accounts?.[walletId]?.mainnet[i].enabled).toBeTruthy();
        expect(wallet.state.accounts?.[walletId]?.mainnet[i].type).toBe('default');
    }

    // upgrade to  latest version
    wallet = setupWallet({
        ...defaultWalletOptions,
        initialState: {
            ...wallet.state,
            version: LATEST_VERSION,
        }
    });
    walletId = wallet.state.activeWalletId;
    expect(wallet.state.version).toBe(LATEST_VERSION)
    // validate accounts object after migration to the latest version
    accounts = wallet.state.accounts;
    expect(accounts).not.toBeNull();
    maninNetAccountsLength = wallet.state.accounts?.[walletId]?.mainnet.length;
    expect(maninNetAccountsLength).toBeGreaterThan(0);
    for (let i = 0; i < maninNetAccountsLength!; i++) {
        expect(wallet.state.accounts?.[walletId]?.mainnet[i].enabled).toBeTruthy();
        expect(wallet.state.accounts?.[walletId]?.mainnet[i].type).toBe('default');
    }
});
