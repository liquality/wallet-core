import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { Network } from '../types';

describe('disableAssets and enableAssets', () => {
  it('should be able to enable assets & disable assets', async () => {
    jest.setTimeout(90000);
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
    await wallet.dispatch.disableAssets({
      network: Network.Mainnet,
      walletId: walletId,
      assets: ['BTC'],
    });
    let enabledAssets = wallet?.state?.enabledAssets?.mainnet?.[walletId];
    expect(enabledAssets).not.toContain('BTC');
    await wallet.dispatch.enableAssets({
      network: Network.Mainnet,
      walletId: walletId,
      assets: ['BTC'],
    });
    enabledAssets = wallet?.state?.enabledAssets?.mainnet?.[walletId];
    expect(enabledAssets).toContain('BTC');
  });
});
