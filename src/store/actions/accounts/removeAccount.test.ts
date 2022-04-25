import { setupWallet } from '../../../index';
import defaultWalletOptions from '../../../walletOptions/defaultOptions';
import { Network } from '../../types';

describe('Remove account', () => {
  test('should be able to remove account', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.setupWallet({
      key: '0x1234567890123456789012345678901234567890',
    });
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

    const walletId = wallet.state.activeWalletId;
    const account = wallet!.state.accounts?.[walletId];
    const btcMainnetAccountId = account?.mainnet[0].id;
    const ethMainnetAccountId = account?.mainnet[1].id;
    const btcTestnetAccountId = account?.testnet[0].id;
    const ethTestnetAccountId = account?.testnet[1].id;

    //remove btc mainnet account
    await wallet.dispatch.removeAccount({
      network: Network.Mainnet,
      walletId: walletId,
      id: btcMainnetAccountId!,
    });

    await wallet.dispatch.removeAccount({
      network: Network.Mainnet,
      walletId: walletId,
      id: ethMainnetAccountId!,
    });

    await wallet.dispatch.removeAccount({
      network: Network.Testnet,
      walletId: walletId,
      id: ethTestnetAccountId!,
    });
    await wallet.dispatch.removeAccount({
      network: Network.Testnet,
      walletId: walletId,
      id: btcTestnetAccountId!,
    });
    console.log(JSON.stringify(wallet.state));
    //TODO: check if account is removed at the moment its removing other accounts, @bradly check if this is the case
    expect(account?.mainnet[0].id).not.toBe(btcMainnetAccountId);
    expect(account?.mainnet.length).toBe(5);
    expect(account?.testnet.length).toBe(5);
  });
});
