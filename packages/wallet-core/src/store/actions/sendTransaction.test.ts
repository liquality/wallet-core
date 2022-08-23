import { ChainId } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import * as Process from 'process';
import { setupWallet } from '../../index';
import { getStatusLabel, getStep } from '../../utils/history';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { FeeLabel, Network } from '../types';

describe('sendTransaction tests', () => {
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
  });

  it('should be able to do send transaction (AVAX) using testnet', async () => {
    // change network to testnet
    await wallet.dispatch.changeActiveNetwork({
      network: Network.Testnet,
    });
    expect(wallet.state.activeNetwork).toBe('testnet');

    const walletId = wallet.state.activeWalletId;
    let testnetEnabledAssets = wallet?.state?.enabledAssets?.testnet?.[walletId];
    testnetEnabledAssets = testnetEnabledAssets!.filter((asset) => asset !== 'SOL');
    expect(testnetEnabledAssets?.length).not.toBe(0);

    // update asset fee for one asset
    await wallet.dispatch.updateFees({
      asset: 'AVAX',
    });

    const account = wallet.state.accounts?.[walletId]?.testnet?.find((acc) => acc.chain === ChainId.Avalanche);
    expect(account?.chain).toBe(ChainId.Avalanche);
    const avaxAccountId = account?.id;
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
    const createNotification = jest.fn();
    const b = {
      title: 'Transaction sent',
      message: 'Sending 0.00001 AVAX to 0x9d6345f731e160cd90b65a91ab60f4f9e37bdbd2',
    };
    const bound = createNotification.bind(b);
    bound();
    expect(createNotification).toHaveBeenCalled();

    // check if the transaction is in the history
    const historyObject = wallet.state.history.testnet?.[walletId]?.[0];
    expect(getStatusLabel(historyObject!)).toBe('Pending');
    expect(getStep(historyObject!)).toBe(0);
  });
});
