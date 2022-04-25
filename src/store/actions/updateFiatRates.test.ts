import {setupWallet} from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';

test('should be able validate fiatRates for all mainnet assets', async () => {

    jest.setTimeout(60000);

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
    let mainnetEnabledAssets = wallet?.state?.enabledAssets?.mainnet?.[walletId];
    expect(mainnetEnabledAssets?.length).not.toBe(0);
    mainnetEnabledAssets = mainnetEnabledAssets!.filter((asset) => asset !== 'SOL');

    await wallet.dispatch.updateFiatRates({
        assets: mainnetEnabledAssets!,
    });
    // validate fiat rates & validate balances
    console.log(JSON.stringify(wallet.state.fiatRates));
    expect(Object.keys(wallet.state.fiatRates).length).toBeGreaterThan(0);
    // const fiatRatesKeys = Object.keys(wallet.state.fiatRates);
    const fiatRatesValues = Object.values(wallet.state.fiatRates);
    for (let i = 0; i < fiatRatesValues.length; i++) {
        const fiatRate = fiatRatesValues[i];
        // console.log(`${fiatRatesKeys[i]}: ${fiatRate}`);
        expect(fiatRate).toBeGreaterThan(0);
    }
});
