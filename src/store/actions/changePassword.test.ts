import {setupWallet} from "../../index";
import defaultWalletOptions from "../../walletOptions/defaultOptions";

describe('should be able to change password', () => {
  test('change password test',async () => {
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
    expect(wallet.state.key).toBe("0x1234567890123456789012345678901234567890");
    expect(wallet.state.analytics.userId).not.toBe(null);
    expect(wallet.state.analytics.acceptedDate).not.toBe(0);
    expect(wallet.state.analytics.askedDate).not.toBe(0);
    expect(wallet.state.analytics.askedTimes).toBe(0);
    expect(wallet.state.analytics.notAskAgain).toBe(false);

    const walletIdBefore = wallet.state.activeWalletId;
    const mainnetAccounts = wallet?.state?.enabledAssets?.mainnet?.[walletIdBefore];
    expect(mainnetAccounts).not.toBeNull();
    // change password
    await wallet.dispatch.changePassword({
      key: '0x3334567890123456789012345678901234567890',
    });
    expect(wallet.state.key).toBe("0x3334567890123456789012345678901234567890");
  })
})
