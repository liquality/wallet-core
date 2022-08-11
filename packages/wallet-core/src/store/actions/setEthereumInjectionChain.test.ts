import { ChainId } from '@liquality/cryptoassets';
import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';

it('should be able to enable Rootstock injection', async () => {
  const wallet = await setupWallet(defaultWalletOptions);
  await wallet.dispatch.createWallet({
    key: '0x1234567890123456789012345678901234567890',
    mnemonic: 'test',
    imported: true,
  });
  await wallet.dispatch.unlockWallet({
    key: '0x1234567890123456789012345678901234567890',
  });
  await wallet.dispatch.setEthereumInjectionChain({ chain: ChainId.Rootstock });
  expect(wallet.state.injectEthereumChain).toEqual(ChainId.Rootstock);
});
