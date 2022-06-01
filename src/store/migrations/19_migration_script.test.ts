import * as Process from 'process';
import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';

test('migrations 19 scripts test, should be able validate accounts-mainnet', async () => {
  jest.setTimeout(90000);
  let wallet = await setupWallet(defaultWalletOptions);
  wallet = wallet = setupWallet({
    ...defaultWalletOptions,
    initialState: {
      ...wallet.state,
      version: 19,
    },
  });
  let TEST_MNEMONIC = Process.env.TEST_MNEMONIC;
  if (!TEST_MNEMONIC) {
    throw new Error('Please set the TEST_MNEMONIC environment variable');
  }
  TEST_MNEMONIC = TEST_MNEMONIC.replace(/,/g, ' ');

    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: TEST_MNEMONIC!,
      imported: true,
    });
    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });

    expect(wallet.state.activeNetwork).toBe('mainnet');
    const walletId = wallet.state.activeWalletId;
    expect(wallet.state.version).toBe(19)
    console.log(JSON.stringify(wallet.state))
    // validate accounts object
    const accounts = wallet.state.accounts;
    expect(accounts).not.toBeNull();

    const maninNetAccountsLength = wallet.state.accounts?.[walletId]?.mainnet.length;
    expect(maninNetAccountsLength).toBeGreaterThan(0);
    for(let i = 0; i < maninNetAccountsLength!; i++){
      expect(wallet.state.accounts?.[walletId]?.mainnet[i].enabled).toBeTruthy();
      expect(wallet.state.accounts?.[walletId]?.mainnet[i].type).toBe('default');
    }
  });
