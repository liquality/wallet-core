import { ChainId } from '@liquality/cryptoassets';
import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { Network } from '../types';

describe('updateBalances tests', () => {
  jest.setTimeout(90000);
  const wallet = setupWallet(defaultWalletOptions);
  beforeEach(async () => {
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: 'inflict direct label mask release cargo also before ask future holiday device',
      imported: true,
    });
    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });
  });

  it('should be able to validate updateBalances against testnet', async () => {
    // change network to testnet
    await wallet.dispatch.changeActiveNetwork({
      network: Network.Testnet,
    });
    expect(wallet.state.activeNetwork).toBe('testnet');

    const walletId = wallet.state.activeWalletId;
    let testnetEnabledAssets = wallet?.state?.enabledAssets?.testnet?.[walletId];
    testnetEnabledAssets = testnetEnabledAssets!.filter((asset) => asset !== 'SOL');
    expect(testnetEnabledAssets?.length).not.toBe(0);

    // update balance this will generate addresses for each asset
    await wallet.dispatch.updateBalances({
      network: Network.Testnet,
      walletId: walletId,
      assets: testnetEnabledAssets!,
    });
    console.log(JSON.stringify(wallet.state));

    const account = wallet.state.accounts?.[walletId]?.testnet?.find((acc) => acc.chain === ChainId.Bitcoin);
    expect(account?.chain).toBe(ChainId.Bitcoin);
    expect(account?.balances.BTC).toBe('0');
  });
});
