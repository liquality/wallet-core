import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { Network } from '../types';

describe('disableAssets and enableAssets', () => {
  it('should be able to enable assets & disable assets', async () => {
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
    const mainnetEnabledAssets = wallet?.state?.enabledAssets?.mainnet?.[walletId];
    await wallet.dispatch.disableAssets({
      network: Network.Mainnet,
      walletId: walletId,
      assets: mainnetEnabledAssets!,
    });
    let enabledAssets = wallet?.state?.enabledAssets?.mainnet?.[walletId];
    expect(enabledAssets?.length).toEqual(0);
    await wallet.dispatch.enableAssets({
      network: Network.Mainnet,
      walletId: walletId,
      assets: mainnetEnabledAssets!,
    });
    enabledAssets = wallet?.state?.enabledAssets?.mainnet?.[walletId];
    expect(enabledAssets?.length).not.toBe(0);
  });
});
