import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { Network } from '../types';

let wallet: any;
describe('disable and enable assets', () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: 'rough symbol license spirit advance pact catalog vibrant dream great usage empty',
      imported: true,
    });
    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });

    await wallet.dispatch.setWatsNewModalShowed({
      version: '1.0.0',
    });
  });

  test('should be able to disable and enable mainnet assets', async () => {
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);

    expect(wallet.state.watsNewModalVersion).toBe('1.0.0');
    expect(wallet.state.keyUpdatedAt).not.toBe(0);
    expect(wallet.state.unlockedAt).not.toBe(0);
    expect(wallet.state.setupAt).not.toBe(0);

    const walletId = wallet.state.activeWalletId;
    const mainnetEnabledAssets = wallet.state.enabledAssets.mainnet?.[walletId];
    expect(mainnetEnabledAssets?.length).toBeGreaterThan(1);

    // disable all mainnet assets
    if (typeof mainnetEnabledAssets != 'undefined') {
      await wallet.dispatch.disableAssets({
        network: Network.Mainnet,
        walletId: walletId,
        assets: mainnetEnabledAssets,
      });
    }
    expect(wallet.state.enabledAssets.mainnet?.[walletId].length).toBe(0);

    // enable all mainnet assets
    if (typeof mainnetEnabledAssets != 'undefined') {
      await wallet.dispatch.enableAssets({
        network: Network.Mainnet,
        walletId: walletId,
        assets: mainnetEnabledAssets,
      });
    }

    expect(mainnetEnabledAssets?.length).toBeGreaterThan(1);
  });
  test('should be able to disable and enable testnet assets', async () => {
    // change network
    await wallet.dispatch.changeActiveNetwork({
      network: Network.Testnet,
    });
    expect(wallet.state.activeNetwork).toBe('testnet');

    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);

    expect(wallet.state.watsNewModalVersion).toBe('1.0.0');
    expect(wallet.state.keyUpdatedAt).not.toBe(0);
    expect(wallet.state.unlockedAt).not.toBe(0);
    expect(wallet.state.setupAt).not.toBe(0);

    const walletId = wallet.state.activeWalletId;
    const testnetEnabledAssets = wallet.state.enabledAssets.testnet?.[walletId];
    expect(testnetEnabledAssets?.length).toBeGreaterThan(1);

    // disable all testnet assets
    if (typeof testnetEnabledAssets != 'undefined') {
      await wallet.dispatch.disableAssets({
        network: Network.Testnet,
        walletId: walletId,
        assets: testnetEnabledAssets,
      });
    }
    expect(wallet.state.enabledAssets.testnet?.[walletId].length).toBe(0);

    // enable all testnet assets
    if (typeof testnetEnabledAssets != 'undefined') {
      await wallet.dispatch.enableAssets({
        network: Network.Testnet,
        walletId: walletId,
        assets: testnetEnabledAssets,
      });
    }
    expect(wallet.state.enabledAssets.testnet?.[walletId]?.length).toBeGreaterThan(1);
  });
});
