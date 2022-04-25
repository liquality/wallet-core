import {setupWallet} from "../../index";
import defaultWalletOptions from "../../walletOptions/defaultOptions";
import {Network} from "../types";

test('should be able to get marketData', async () => {
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
        network: Network.Mainnet,
    });
    expect(wallet.state.marketData.mainnet?.length).toBeGreaterThan(10);
});


test('should be able to get marketData for testnet', async () => {
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
    // change network to testnet
    await wallet.dispatch.changeActiveNetwork({
        network: Network.Testnet,
    });

    expect(wallet.state.analytics.userId).not.toBe(null);
    await wallet.dispatch.updateMarketData({
        network: Network.Testnet,
    });
    expect(wallet.state.marketData.testnet?.length).toBeGreaterThan(10);
});
