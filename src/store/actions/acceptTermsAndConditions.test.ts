import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';

// TODO: Add tests for acceptTermsAndConditions
describe('acceptTermsAndConditions', () => {
  it('should be able to acceptTermsAndConditions', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: 'test',
      imported: true,
    });
    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });
    expect(wallet.state.termsAcceptedAt).toBe(0);
    await wallet.dispatch.acceptTermsAndConditions({ analyticsAccepted: true });
    expect(wallet.state.termsAcceptedAt).not.toBe(0);
  });
});
