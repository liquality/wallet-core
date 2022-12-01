import { createInternalError } from '@liquality/error-parser';
import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';

test('should log error to state when analytics is disabled', async () => {
  const ERROR = 'anyError';
  const wallet = await setupWallet(defaultWalletOptions);
  await wallet.dispatch.createWallet({
    key: '0x1234567890123456789012345678901234567890',
    mnemonic: 'test',
    imported: true,
  });
  await wallet.dispatch.unlockWallet({
    key: '0x1234567890123456789012345678901234567890',
  });

  await wallet.dispatch.initializeAnalyticsPreferences({ accepted: false });
  expect(wallet.state.errorLog.length).toBe(0);
  createInternalError(ERROR);
  expect(wallet.state.errorLog.length).toBe(1);
  expect(wallet.state.errorLog[0].rawError).toBe(ERROR);

  await wallet.dispatch.initializeAnalyticsPreferences({ accepted: true });

  createInternalError(ERROR);
  expect(wallet.state.errorLog.length).toBe(2);
});
