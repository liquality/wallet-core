import { createInternalError } from '@liquality/error-parser';
import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';

let wallet: ReturnType<typeof setupWallet>;
const ERROR = 'anyError';

beforeAll(async () => {
  wallet = await setupWallet(defaultWalletOptions);
  await wallet.dispatch.createWallet({
    key: '0x1234567890123456789012345678901234567890',
    mnemonic: 'test',
    imported: true,
  });
  await wallet.dispatch.unlockWallet({
    key: '0x1234567890123456789012345678901234567890',
  });
});

beforeEach(async () => {
  await wallet.dispatch.clearErrorLog();
});

test('should log error to state when analytics is disabled', async () => {
  await wallet.dispatch.initializeAnalyticsPreferences({ accepted: false });
  expect(wallet.state.errorLog.length).toBe(0);
  createInternalError(ERROR);
  expect(wallet.state.errorLog.length).toBe(1);
  expect(wallet.state.errorLog[0].rawError).toBe(ERROR);

  createInternalError(ERROR);
  expect(wallet.state.errorLog.length).toBe(2);
});

test('should not log error to state when analytics is enabled', async () => {
  await wallet.dispatch.initializeAnalyticsPreferences({ accepted: true });
  createInternalError(ERROR);
  expect(wallet.state.errorLog.length).toBe(0);
});
