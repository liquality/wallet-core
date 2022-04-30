import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';

describe('acceptTermsAndConditions', () => {
  it('should be able to acceptTermsAndConditions', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: 'test',
      imported: true,
    });

    await wallet.dispatch.acceptTermsAndConditions({ analyticsAccepted: true });

    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });
    expect(wallet.state.termsAcceptedAt).not.toBe(0);
    expect(wallet.state.analytics).not.toBe(0);
    expect(wallet.state.analytics.acceptedDate).not.toBe(0);
    expect(wallet.state.analytics.askedDate).not.toBe(0);
  });
});
