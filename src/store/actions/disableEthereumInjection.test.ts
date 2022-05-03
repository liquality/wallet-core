import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';

describe('disableEthereumInjection & enableEthereumInjection', () => {
  jest.useFakeTimers();
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
    console.log(JSON.stringify(wallet.state));
    expect(wallet.state.injectEthereum).toBe(false);
    await wallet.dispatch.enableEthereumInjection();
    expect(wallet.state.injectEthereum).toBe(true);
    console.log(JSON.stringify(wallet.state));
  });
});
