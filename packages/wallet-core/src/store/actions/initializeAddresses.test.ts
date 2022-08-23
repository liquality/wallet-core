import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { Network } from '../types';

describe('initializeAddresses tests', () => {
  jest.setTimeout(120000);
  it('should be able to validate every asset has addresses', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: 'rough symbol license spirit advance pact catalog vibrant dream great usage empty',
      imported: true,
    });
    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });
    const walletId = wallet.state.activeWalletId;
    let mainnetAccounts = wallet.state.accounts?.[walletId]?.mainnet;
    let testnetAccounts = wallet.state.accounts?.[walletId]?.testnet;
    expect(mainnetAccounts?.length).not.toBe(0);
    expect(testnetAccounts?.length).not.toBe(0);

    for (let i = 0; i < mainnetAccounts!.length; i++) {
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
    for (let i = 0; i < mainnetAccounts!.length; i++) {
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
    for (let i = 0; i < testnetAccounts!.length; i++) {
      if (mainnetAccounts) {
        if (mainnetAccounts[i]?.chain !== 'fuse') {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(mainnetAccounts[i]?.addresses?.length).toEqual(1);
        }
      }
    }
  });
});
