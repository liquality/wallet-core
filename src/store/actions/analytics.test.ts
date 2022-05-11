import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';

test('should be able to enable analytics', async () => {
  const wallet = await setupWallet(defaultWalletOptions);
  await wallet.dispatch.createWallet({
    key: '0x1234567890123456789012345678901234567890',
    mnemonic: 'test',
    imported: true,
  });
  await wallet.dispatch.unlockWallet({
    key: '0x1234567890123456789012345678901234567890',
  });

  const walletId = wallet.state.activeWalletId;
  expect(walletId).not.toBeNull();

  await wallet.dispatch.initializeAnalyticsPreferences({ accepted: true });
  expect(wallet.state.analytics).not.toBe({});

  await wallet.dispatch.updateAnalyticsPreferences({
    ...wallet.state.analytics,
    notAskAgain: true,
  });

  expect(wallet.state.analytics.notAskAgain).toBe(true);

  await wallet.dispatch.setAnalyticsResponse({ accepted: true });
  expect(wallet.state.analytics.acceptedDate).not.toBe(0);
  await wallet.dispatch.setAnalyticsResponse({ accepted: false });
  expect(wallet.state.analytics.acceptedDate).toBe(0);

  await wallet.dispatch.trackAnalytics({
    event: 'test',
    properties: {
      test: 'test',
    },
  });
});
