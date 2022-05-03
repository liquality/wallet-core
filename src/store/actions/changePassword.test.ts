import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';

test('change password test', async () => {
  const wallet = await setupWallet(defaultWalletOptions);
  await wallet.dispatch.createWallet({
    key: '0x1234567890123456789012345678901234567890',
    mnemonic: 'test',
    imported: true,
  });
  await wallet.dispatch.unlockWallet({
    key: '0x1234567890123456789012345678901234567890',
  });
  expect(wallet.state.key).toBe('0x1234567890123456789012345678901234567890');
  // change password
  await wallet.dispatch.changePassword({
    key: '0x3334567890123456789012345678901234567890',
  });
  expect(wallet.state.key).toBe('0x3334567890123456789012345678901234567890');
});
