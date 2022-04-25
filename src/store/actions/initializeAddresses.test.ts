import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { Network } from '../types';

describe('initializeAddresses tests', () => {
  it('should be able to validate every asset has addresses', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.acceptTermsAndConditions({ analyticsAccepted: true });
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: 'test',
      imported: true,
    });
    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });

    await wallet.dispatch.setWatsNewModalShowed({
      version: '1.0.0',
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);
    expect(wallet.state.termsAcceptedAt).not.toBe(0);

    expect(wallet.state.watsNewModalVersion).toBe('1.0.0');
    expect(wallet.state.keyUpdatedAt).not.toBe(0);
    expect(wallet.state.unlockedAt).not.toBe(0);
    expect(wallet.state.setupAt).not.toBe(0);

    const walletId = wallet.state.activeWalletId;
    let mainnetAccounts = wallet.state.accounts?.[walletId]?.mainnet;
    let testnetAccounts = wallet.state.accounts?.[walletId]?.testnet;
    expect(mainnetAccounts?.length).not.toBe(0);
    expect(testnetAccounts?.length).not.toBe(0);

    // @ts-ignore
    for (let i = 0; i < mainnetAccounts.length; i++) {
      if (mainnetAccounts) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(mainnetAccounts[i]?.addresses?.length).toEqual(0);
      }
    }
    // initialize addresses for mainnet assets
    await wallet.dispatch.initializeAddresses({
      network: Network.Mainnet,
      walletId: walletId,
    });
    mainnetAccounts = wallet.state.accounts?.[walletId]?.mainnet;
    expect(mainnetAccounts?.length).not.toBe(0);
    // @ts-ignore
    for (let i = 0; i < mainnetAccounts.length; i++) {
      if (mainnetAccounts) {
        if (mainnetAccounts[i]?.chain !== 'fuse') {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(mainnetAccounts[i]?.addresses?.length).toEqual(1);
        }
      }
    }

    // initialize addresses for testnet assets
    await wallet.dispatch.initializeAddresses({
      network: Network.Testnet,
      walletId: walletId,
    });
    testnetAccounts = wallet.state.accounts?.[walletId]?.testnet;
    expect(testnetAccounts?.length).not.toBe(0);
    // @ts-ignore
    for (let i = 0; i < testnetAccounts.length; i++) {
      if (mainnetAccounts) {
        if (mainnetAccounts[i]?.chain !== 'fuse') {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(mainnetAccounts[i]?.addresses?.length).toEqual(1);
        }
      }
    }
  });
});
