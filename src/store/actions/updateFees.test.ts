import { chains } from '@liquality/cryptoassets';
import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { Network } from '../types';

describe('updateFees tests', () => {
  jest.setTimeout(90000);
  const wallet = setupWallet(defaultWalletOptions);
  beforeEach(async () => {
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: 'rough symbol license spirit advance pact catalog vibrant dream great usage empty',
      imported: true,
    });
    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });
  });

  it('should be able to update mainnet assets fees', async () => {
    expect(wallet.state.wallets.length).toBe(1);

    const walletId = wallet.state.activeWalletId;
    const enabledChains = wallet.state.enabledChains[wallet.state.activeWalletId]![wallet.state.activeNetwork];
    const assets = enabledChains.map((chain) => chains[chain].nativeAsset);
    expect(assets).not.toBeNull();
    // mainnet asset fee update
    for (const mainnetAsset of assets) {
      await wallet.dispatch.updateFees({
        asset: mainnetAsset,
      });
    }
    const maintainElement = wallet.state.fees.mainnet?.[walletId];
    // BTC fee object checks
    expect(maintainElement?.BTC).toHaveProperty('slow');
    expect(maintainElement?.BTC.slow.fee).not.toBe(0);
    expect(maintainElement?.BTC.slow.wait).toBe(3600);
    expect(maintainElement?.BTC).toHaveProperty('average');
    expect(maintainElement?.BTC.average.fee).not.toBe(0);
    expect(maintainElement?.BTC.average.wait).toBe(1800);
    expect(maintainElement?.BTC).toHaveProperty('fast');
    expect(maintainElement?.BTC.fast.fee).not.toBe(0);
    expect(maintainElement?.BTC.fast.wait).toBe(600);
    // AVAX fee object checks
    expect(maintainElement?.AVAX).toHaveProperty('slow');
    expect(maintainElement?.AVAX).toHaveProperty('average');
    expect(maintainElement?.AVAX).toHaveProperty('fast');
    expect(maintainElement?.AVAX.slow.fee).not.toBe(0);
    expect(maintainElement?.AVAX.average.fee).not.toBe(0);
    expect(maintainElement?.AVAX.fast.fee).not.toBe(0);
  });
  it('should be able to update testnet assets fees', async () => {
    expect(wallet.state.wallets.length).toBe(1);

    await wallet.dispatch.changeActiveNetwork({ network: Network.Testnet });
    const walletId = wallet.state.activeWalletId;
    const enabledChains = wallet.state.enabledChains[wallet.state.activeWalletId]![wallet.state.activeNetwork];
    const assets = enabledChains.map((chain) => chains[chain].nativeAsset);
    expect(assets).not.toBeNull();
    for (const testnetAsset of assets) {
      // Luna testnet is broken
      if (testnetAsset === 'LUNA') {
        continue;
      }
      await wallet.dispatch.updateFees({
        asset: testnetAsset,
      });
    }
    const testnetFeeElement = wallet.state.fees.testnet?.[walletId];
    // BTC fee object checks
    expect(testnetFeeElement?.BTC).toHaveProperty('slow');
    expect(testnetFeeElement?.BTC.slow.fee).not.toBe(0);
    expect(testnetFeeElement?.BTC.slow.wait).toBe(3600);
    expect(testnetFeeElement?.BTC).toHaveProperty('average');
    expect(testnetFeeElement?.BTC.average.fee).not.toBe(0);
    expect(testnetFeeElement?.BTC.average.wait).toBe(1800);
    expect(testnetFeeElement?.BTC).toHaveProperty('fast');
    expect(testnetFeeElement?.BTC.fast.fee).not.toBe(0);
    expect(testnetFeeElement?.BTC.fast.wait).toBe(600);
    // Avax fee object checks
    expect(testnetFeeElement?.AVAX).toHaveProperty('slow');
    expect(testnetFeeElement?.AVAX).toHaveProperty('average');
    expect(testnetFeeElement?.AVAX).toHaveProperty('fast');
    expect(testnetFeeElement?.AVAX.slow.fee).not.toBe(0);
    expect(testnetFeeElement?.AVAX.average.fee).not.toBe(0);
    expect(testnetFeeElement?.AVAX.fast.fee).not.toBe(0);
  });
});
