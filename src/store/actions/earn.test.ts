import * as Process from 'process';
import { EarnProvider } from '../../earn/EarnProvider';
import { getEarnProvider } from '../../factory/earnProvider';
import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { Network } from '../types';

describe('disableAssets and enableAssets', () => {
  jest.setTimeout(90000);
  const wallet = setupWallet(defaultWalletOptions);
  const amount = '0.0001';

  let TEST_MNEMONIC = Process.env.TEST_MNEMONIC;
  if (!TEST_MNEMONIC) {
    throw new Error('Please set the TEST_MNEMONIC environment variable');
  }
  TEST_MNEMONIC = TEST_MNEMONIC.replace(/,/g, ' ');

  let provider: EarnProvider;

  beforeEach(async () => {
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: TEST_MNEMONIC!,
      imported: true,
    });
    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });
    await wallet.dispatch.changeActiveNetwork({
      network: Network.Testnet,
    });

    provider = getEarnProvider(Network.Testnet, 'UST');
  });

  it('should return APY', async () => {
    const apy = await provider.getApy();
    expect(Number(apy)).toBeGreaterThan(0);
  });

  it('should return Deposited amount', async () => {
    const depositedAmount = await provider.getDepositedAmount();
    expect(depositedAmount).toBeGreaterThan(0);
  });

  it('should make a deposit', async () => {
    const tx = await provider.deposit(amount);

    expect(tx.status).toBe('successful');
  });

  it('should make a withdraw', async () => {
    const tx = await provider.withdraw(amount);

    expect(tx.status).toBe('successful');
  });
});
