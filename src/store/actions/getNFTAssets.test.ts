import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { Network } from '../types';

describe('getNFTAssets tests', () => {
  it('should getNFT assets for ETH', async () => {
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

    const walletId = wallet.state.activeWalletId;
    await wallet.dispatch.initializeAnalyticsPreferences({
      accepted: true,
    });
    const assets = await wallet.dispatch.getNFTAssets({
      network: Network.Testnet,
      walletId: walletId,
      asset: 'ETH',
    });
    expect(assets).toEqual([]);
  });
});
