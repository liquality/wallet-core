import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';

test('should be able to create wallet with imported false', async () => {
  const wallet = await setupWallet(defaultWalletOptions);
  await wallet.dispatch.createWallet({
    key: '0x1234567890123456789012345678901234567890',
    mnemonic: 'test',
    imported: false,
  });
  expect(wallet.state.wallets.length).toBe(1);
  expect(wallet.state.wallets[0].id).not.toBe(undefined);
  expect(wallet.state.wallets[0].name).toEqual('Account 1');
  expect(wallet.state.wallets[0].mnemonic).toBe('test');
  expect(wallet.state.wallets[0].at).not.toBe(0);
  expect(wallet.state.unlockedAt).toBe(0);
  expect(wallet.state.activeNetwork).toBe('mainnet');
  expect(wallet.state.wallets[0].imported).toBe(false);
  expect(wallet.state.activeWalletId).not.toBe(null);
  const numberOfAccounts = wallet.state.accounts;
  const walletId = wallet.state.activeWalletId;
  expect(numberOfAccounts[walletId]).not.toBe(undefined);
  expect(numberOfAccounts[walletId]).toHaveProperty('mainnet');
  expect(numberOfAccounts[walletId]).toHaveProperty('testnet');
  expect(wallet.state.enabledChains[walletId]).toHaveProperty('mainnet');
  expect(wallet.state.enabledChains[walletId]).toHaveProperty('testnet');
  expect(wallet.state.enabledChains[walletId]).toHaveProperty('testnet');
  expect(wallet.state.enabledChains[walletId]).toHaveProperty('mainnet');
});
test('should be able to create wallet with imported true', async () => {
  const wallet = await setupWallet(defaultWalletOptions);
  await wallet.dispatch.createWallet({
    key: '0x1234567890123456789012345678901234567890',
    mnemonic: 'test',
    imported: true,
  });
  expect(wallet.state.wallets[0].imported).toBe(true);
});
