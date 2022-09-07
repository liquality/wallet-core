import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';

describe('disableEthereumInjection & enableEthereumInjection', () => {
  it('should be able to disable injectEthereumChain', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: 'test',
      imported: true,
    });
    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });
    expect(wallet.state.injectEthereum).toBe(true);
    await wallet.dispatch.disableEthereumInjection();
    expect(wallet.state.injectEthereum).toBe(false);
    await wallet.dispatch.enableEthereumInjection();
    expect(wallet.state.injectEthereum).toBe(true);
  });
});
