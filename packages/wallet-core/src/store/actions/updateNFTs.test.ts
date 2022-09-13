import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';

describe('updateNFTs tests', () => {
  it('should getNFT assets for ETH', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: 'rough symbol license spirit advance pact catalog vibrant dream great usage empty',
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
    const accountIds = [wallet.getters.accountsData.find((a) => a.chain === 'ethereum')!.id];
    const assets = await wallet.dispatch.updateNFTs({
      walletId: wallet.state.activeWalletId,
      network: wallet.state.activeNetwork,
    });
    expect(assets).toEqual(Array(accountIds.length).fill([]));
  });
});
