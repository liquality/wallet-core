import * as Process from 'process';
import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import {isMigrationNeeded, LATEST_VERSION} from "./index";
import {Network} from "../types";

describe('migrations scripts tests', () => {
  const wallet = setupWallet({...defaultWalletOptions });
  let TEST_MNEMONIC = Process.env.TEST_MNEMONIC;
  if (!TEST_MNEMONIC) {
    throw new Error('Please set the TEST_MNEMONIC environment variable');
  }
  TEST_MNEMONIC = TEST_MNEMONIC.replace(/,/g, ' ');

  beforeEach(async () => {
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: TEST_MNEMONIC!,
      imported: true,
    });
    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });
  });

  it('should be able validate accounts-mainnet', async () => {
    expect(wallet.state.activeNetwork).toBe('mainnet');
    const walletId = wallet.state.activeWalletId;
    expect(wallet.state.version).toBe(LATEST_VERSION)
    // validate accounts object
    const accounts = wallet.state.accounts;
    expect(accounts).not.toBeNull();
    expect(isMigrationNeeded(wallet.state)).toBeFalsy();

    const maninNetAccountsLength = wallet.state.accounts?.[walletId]?.mainnet.length;
    expect(maninNetAccountsLength).toBeGreaterThan(0);
    for(let i = 0; i < maninNetAccountsLength!; i++){
      expect(wallet.state.accounts?.[walletId]?.mainnet[i].enabled).toBeTruthy();
      expect(wallet.state.accounts?.[walletId]?.mainnet[i].type).toBe('default');
    }
  });
  it('should be able validate accounts-testnet', async () => {
    // change network to testnet
    await wallet.dispatch.changeActiveNetwork({
      network: Network.Testnet,
    });
    expect(wallet.state.activeNetwork).toBe('testnet');
    const walletId = wallet.state.activeWalletId;
    expect(wallet.state.version).toBe(LATEST_VERSION)
    const testnetAccountsLength = wallet.state.accounts?.[walletId]?.testnet.length;
    expect(testnetAccountsLength).not.toBeNull();
    expect(isMigrationNeeded(wallet.state)).toBeFalsy();
    expect(testnetAccountsLength).toBeGreaterThan(0);
    for(let i = 0; i < testnetAccountsLength!; i++){
      expect(wallet.state.accounts?.[walletId]?.testnet[i].enabled).toBeTruthy();
      expect(wallet.state.accounts?.[walletId]?.testnet[i].type).toBe('default');
    }
  });
});
