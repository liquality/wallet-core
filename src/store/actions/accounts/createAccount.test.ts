import { setupWallet } from '../../../index';
import defaultWalletOptions from '../../../walletOptions/defaultOptions';
import { Network } from '../../types';

test('accounts createAccount', async () => {
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
  expect(wallet.state.accounts[walletId!]?.mainnet.length).toBe(11);
  const account = wallet!.state.accounts?.[walletId];
  const btcMainnetAccountDetails = account?.mainnet[0];
  await wallet.dispatch.createAccount({
    walletId: walletId,
    network: Network.Mainnet,
    account: {
      ...btcMainnetAccountDetails!,
      name: 'Bitcoin account 2',
    },
  });
  expect(wallet.state.accounts[walletId!]?.mainnet.length).toBe(12);
});
