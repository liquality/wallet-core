import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';

describe('lock', () => {
  test('should be able to lock a wallet', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: 'test',
      imported: true,
    });
    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });
    expect(wallet.state.unlockedAt).not.toBe(0);
    expect(wallet.state.wallets.length).not.toBe(0);
    await wallet.dispatch.lockWallet();
    expect(wallet.state.unlockedAt).toBe(0);
    expect(wallet.state.wallets.length).toBe(0);
  });
});
