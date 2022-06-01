import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';

describe('setWhatsNewModalVersion tests', () => {
  it('should be able to validate set whatsNewModalShowed', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: 'test',
      imported: true,
    });
    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });

    const version = '1.61.0';

    await wallet.dispatch.setWhatsNewModalVersion({
      version: version,
    });

    expect(wallet.state.whatsNewModalVersion).toBe(version);
  });
});
