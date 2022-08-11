import * as Process from 'process';
import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { Network } from '../types';

describe('getQuotes tests', () => {
  jest.setTimeout(90000);
  const wallet = setupWallet(defaultWalletOptions);
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

    // change network to testnet
    await wallet.dispatch.changeActiveNetwork({
      network: Network.Testnet,
    });
  });

  it('should be able to get quotes for BTC to ETH against testnet', async () => {
    const walletId = wallet.state.activeWalletId;
    expect(walletId).toBeDefined();

    // update market data
    await wallet.dispatch.updateMarketData({
      network: Network.Testnet,
    });

    // get quotes
    const quotes = await wallet.dispatch.getQuotes({
      network: Network.Testnet,
      from: 'BTC',
      to: 'ETH',
      fromAccountId: walletId,
      toAccountId: walletId,
      amount: '1',
    });
    expect(quotes).toBeDefined();
    expect(quotes.length).toBeGreaterThan(0);
    expect(quotes[0].from).toBe('BTC');
    expect(quotes[0].to).toBe('ETH');
    expect(quotes[0].fromAmount).toBe('100000000');
    expect(quotes[0].toAmount).not.toBe(undefined);
    expect(quotes[0].provider).not.toBe(undefined);
  });
  it('should be able to get quotes for ETH to BTC against testnet', async () => {
    const walletId = wallet.state.activeWalletId;
    expect(walletId).toBeDefined();

    // update market data
    await wallet.dispatch.updateMarketData({
      network: Network.Testnet,
    });

    // get quotes
    const quotes = await wallet.dispatch.getQuotes({
      network: Network.Testnet,
      from: 'ETH',
      to: 'BTC',
      fromAccountId: walletId,
      toAccountId: walletId,
      amount: '1',
    });
    expect(quotes).toBeDefined();
    expect(quotes.length).toBeGreaterThan(0);
    expect(quotes[0].from).toBe('ETH');
    expect(quotes[0].to).toBe('BTC');
    expect(quotes[0].fromAmount).toBeDefined();
    expect(quotes[0].toAmount).not.toBe(undefined);
    expect(quotes[0].provider).not.toBe(undefined);
  });
});
