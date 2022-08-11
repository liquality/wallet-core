import * as Process from 'process';
import { setupWallet } from '../index';
import { Network } from '../store/types';
import defaultWalletOptions from '../walletOptions/defaultOptions';
import { calculateQuoteRate, sortQuotes } from './quotes';

describe('quotes utils tests', () => {
  jest.setTimeout(90000);
  const createNotification = jest.fn();
  const wallet = setupWallet({ ...defaultWalletOptions, createNotification });

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

  it('should be able test calculateQuoteRate against testnet', async () => {
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

    // sort quotes
    const result = calculateQuoteRate(quotes[0]);
    expect(result).toBeDefined();
    expect(result).not.toBeNaN();
  });
  it('should be able test sortQuotes against testnet', async () => {
    const walletId = wallet.state.activeWalletId;
    expect(walletId).toBeDefined();

    // update market data
    await wallet.dispatch.updateMarketData({
      network: Network.Testnet,
    });

    // get quotes
    let quotes = await wallet.dispatch.getQuotes({
      network: Network.Testnet,
      from: 'BTC',
      to: 'ETH',
      fromAccountId: walletId,
      toAccountId: walletId,
      amount: '1',
    });
    expect(quotes).toBeDefined();
    expect(quotes.length).toBeGreaterThan(0);

    // sort quotes
    let result = sortQuotes(quotes, Network.Testnet);
    console.log(result);
    expect(result).toBeDefined();
    expect(result).not.toBeNaN();

    quotes = await wallet.dispatch.getQuotes({
      network: Network.Testnet,
      from: 'ETH',
      to: 'DAI',
      fromAccountId: walletId,
      toAccountId: walletId,
      amount: '1',
    });
    expect(quotes).toBeDefined();
    expect(quotes.length).toBeGreaterThan(0);

    // sort quotes
    result = sortQuotes(quotes, Network.Testnet);
    expect(result).toBeDefined();
    expect(result).not.toBeNaN();
  });
});
