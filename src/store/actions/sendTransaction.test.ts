import { ChainId } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import * as Process from 'process';
import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { FeeLabel, Network } from '../types';

describe('sendTransaction tests', () => {
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
  });

  it('should be able to do send transaction (AVAX) using testnet', async () => {
    // change network to testnet
    await wallet.dispatch.changeActiveNetwork({
      network: Network.Testnet,
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);
    expect(wallet.state.activeNetwork).toBe('testnet');

    const walletId = wallet.state.activeWalletId;
    let testnetEnabledAssets = wallet?.state?.enabledAssets?.testnet?.[walletId];
    testnetEnabledAssets = testnetEnabledAssets!.filter((asset) => asset !== 'SOL');
    expect(testnetEnabledAssets?.length).not.toBe(0);

    // initialize addresses for all assets
    await wallet.dispatch.initializeAddresses({
      network: Network.Testnet,
      walletId: walletId,
    });

    // update balances for each asset
    await wallet.dispatch.updateBalances({
      network: Network.Testnet,
      walletId: walletId,
      assets: testnetEnabledAssets!,
    });

    const account = wallet.state.accounts?.[walletId]?.testnet?.find((acc) => acc.chain === ChainId.Avalanche);
    expect(account?.chain).toBe(ChainId.Avalanche);
    const avaxAccountId = account?.id;
    const avaxAddress = account?.addresses[0];
    expect(avaxAddress).not.toBeNull();
    expect(testnetEnabledAssets?.length).toBeGreaterThan(10);

    // update fiat rates for all assets
    await wallet.dispatch.updateFiatRates({
      assets: testnetEnabledAssets!,
    });

    // update asset fee
    await wallet.dispatch.updateFees({
      asset: ChainId.Avalanche,
    });
    // console.log(JSON.stringify(wallet.state));

    const maintainElement = wallet.state.fees.testnet?.[walletId];
    // AVAX fee object checks
    expect(maintainElement?.AVAX).toHaveProperty('fast');
    const avaxFeeObject = maintainElement?.AVAX.fast;

    await wallet.dispatch.sendTransaction({
      network: Network.Testnet,
      walletId: wallet.state.activeWalletId,
      accountId: avaxAccountId!,
      asset: 'AVAX',
      to: '0x9d6345f731e160cd90b65a91ab60f4f9e37bdbd2',
      amount: new BN(10000000000000), //0.00001
      data: '',
      // @ts-ignore
      fee: avaxFeeObject.fee,
      gas: 21000,
      feeLabel: FeeLabel.Fast,
      fiatRate: 72,
    });
    expect(wallet.state.history.testnet).toHaveProperty(walletId);
    expect(wallet.state.history.testnet?.[walletId].length).toBe(1);
    expect(wallet.state.history.testnet?.[walletId][0].type).toBe('SEND');
    expect(wallet.state.history.testnet?.[walletId][0].network).toBe('testnet');
    expect(wallet.state.history.testnet?.[walletId][0]).toHaveProperty('txHash');
    //TODO: add pooling for transactions to check status is completed
  });
  it.skip('should be able to do send transaction using mainnet', async () => {
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);
    expect(wallet.state.analytics.userId).not.toBe(null);
    expect(wallet.state.analytics.acceptedDate).not.toBe(0);
    expect(wallet.state.analytics.askedDate).not.toBe(0);
    expect(wallet.state.analytics.askedTimes).toBe(0);
    expect(wallet.state.analytics.notAskAgain).toBe(false);

    const walletId = wallet.state.activeWalletId;
    let mainnetEnabledAssets = wallet?.state?.enabledAssets?.mainnet?.[walletId];
    const testnetEnabledAssets = wallet?.state?.enabledAssets?.testnet?.[walletId];
    expect(mainnetEnabledAssets?.length).not.toBe(0);
    expect(testnetEnabledAssets?.length).not.toBe(0);
    mainnetEnabledAssets = mainnetEnabledAssets!.filter((asset) => asset !== 'SOL');

    // initialize addresses for all assets
    await wallet.dispatch.initializeAddresses({
      network: Network.Mainnet,
      walletId: walletId,
    });
    // update balance this will generate addresses for each asset
    await wallet.dispatch.updateBalances({
      network: Network.Mainnet,
      walletId: walletId,
      assets: mainnetEnabledAssets!,
    });

    const account = wallet.state.accounts?.[walletId]?.mainnet?.[1];
    expect(account?.chain).toBe(ChainId.Ethereum);
    const ethAccountId = account?.id;
    const ethereumAddress = account?.addresses[0];
    expect(ethereumAddress).not.toBeNull();
    expect(mainnetEnabledAssets?.length).toBeGreaterThan(10);

    // update fiat rates for all assets
    await wallet.dispatch.updateFiatRates({
      assets: mainnetEnabledAssets!,
    });
    // update asset fee for all assets
    for (const mainnnetAsset of mainnetEnabledAssets!) {
      await wallet.dispatch.updateFees({
        asset: mainnnetAsset,
      });
    }
    console.log(JSON.stringify(wallet.state));
    const maintainElement = wallet.state.fees.mainnet?.[walletId];
    // ETH fee object checks
    expect(maintainElement?.ETH).toHaveProperty('fast');
    // const ethFeeObject = maintainElement?.ETH.fast;

    await wallet.dispatch.sendTransaction({
      network: Network.Mainnet,
      walletId: wallet.state.activeWalletId,
      accountId: ethAccountId!,
      asset: 'ETH',
      to: '0x1234567890123456789012345678901234567890',
      amount: new BN(10000),
      data: '',
      // @ts-ignore
      fee: 55,
      gas: 0,
      feeLabel: FeeLabel.Fast,
      fiatRate: 10,
    });
  });
});
