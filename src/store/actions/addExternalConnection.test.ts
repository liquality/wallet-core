import { ChainId } from '@liquality/cryptoassets';
import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { Network } from '../types';

describe('add external connection', () => {
  test('should be able validate externalConnections & forgetDappConnections', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: 'test',
      imported: true,
    });
    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);

    await wallet.dispatch.initializeAnalyticsPreferences({
      accepted: true,
    });

    expect(wallet.state.analytics.userId).not.toBe(null);
    expect(wallet.state.analytics.acceptedDate).not.toBe(0);
    expect(wallet.state.analytics.askedDate).not.toBe(0);
    expect(wallet.state.analytics.askedTimes).toBe(0);
    expect(wallet.state.analytics.notAskAgain).toBe(false);

    const walletId = wallet.state.activeWalletId;
    const mainnetAccounts = wallet?.state?.enabledAssets?.mainnet?.[walletId];
    expect(mainnetAccounts).not.toBeNull();

    // update balance this will generate address
    if (mainnetAccounts) {
      await wallet.dispatch.updateBalances({
        network: Network.Mainnet,
        walletId: walletId,
        assets: mainnetAccounts,
      });
    }

    const account = wallet.state.accounts?.[walletId]?.mainnet?.[1];
    expect(account?.chain).toBe(ChainId.Ethereum);
    const ethAccountId = account?.id;
    const ethereumAddress = account?.addresses[0];
    expect(ethereumAddress).not.toBeNull();

    const originName = 'https://uniswap.org/';
    if (typeof ethAccountId !== 'undefined' && typeof ethereumAddress !== 'undefined') {
      // external connection
      const externalConnection = {
        origin: originName,
        chain: ChainId.Ethereum,
        accountId: ethAccountId,
        setDefaultEthereum: true,
      };
      await wallet.dispatch.addExternalConnection(externalConnection);
    }

    expect(Object.keys(wallet.state.externalConnections[walletId]).length).toEqual(1);
    expect(wallet.state.externalConnections[walletId]?.[originName]?.defaultEthereum).toEqual(ethAccountId);
    expect(Object.keys(wallet.state.externalConnections[walletId]?.[originName]?.ethereum).length).toBeGreaterThan(0);
    expect(wallet.state.externalConnections[walletId]?.[originName]?.ethereum[0]).toEqual(ethAccountId);

    // forgot dapp connections
    await wallet.dispatch.forgetDappConnections();
    expect(Object.keys(wallet.state.externalConnections[walletId]).length).toEqual(0);
  });
  test('should be able validate externalConnections for multiple origins', async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: 'test',
      imported: true,
    });
    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });
    expect(wallet.state.wallets.length).toBe(1);
    expect(wallet.state.wallets[0].imported).toBe(true);
    expect(wallet.state.unlockedAt).not.toBe(0);

    await wallet.dispatch.initializeAnalyticsPreferences({
      accepted: true,
    });

    expect(wallet.state.analytics.userId).not.toBe(null);
    expect(wallet.state.analytics.acceptedDate).not.toBe(0);
    expect(wallet.state.analytics.askedDate).not.toBe(0);
    expect(wallet.state.analytics.askedTimes).toBe(0);
    expect(wallet.state.analytics.notAskAgain).toBe(false);

    const walletId = wallet.state.activeWalletId;
    const mainnetAccounts = wallet?.state?.enabledAssets?.mainnet?.[walletId];
    expect(mainnetAccounts).not.toBeNull();

    // update balance this will generate address
    if (mainnetAccounts) {
      await wallet.dispatch.updateBalances({
        network: Network.Mainnet,
        walletId: walletId,
        assets: mainnetAccounts,
      });
    }

    const account = wallet.state.accounts?.[walletId]?.mainnet;
    const ethAccountId = account?.[1].id;
    const btcAccountId = account?.[0].id;
    const ethereumAddress = account?.[1].addresses[0];
    const bitcoinAddress = account?.[0].addresses[0];
    expect(account?.[1].chain).toBe(ChainId.Ethereum);
    expect(account?.[0].chain).toBe(ChainId.Bitcoin);
    expect(ethereumAddress).not.toBeNull();
    expect(bitcoinAddress).not.toBeNull();

    const originNameOne = 'https://app.uniswap.org';
    const originNameTwo = 'https://app.aave.com';
    if (typeof ethAccountId !== 'undefined' && typeof ethereumAddress !== 'undefined') {
      // external connection 1
      const externalConnection = {
        origin: originNameOne,
        chain: ChainId.Ethereum,
        accountId: ethAccountId,
        setDefaultEthereum: true,
      };
      await wallet.dispatch.addExternalConnection(externalConnection);

      await wallet.dispatch.addExternalConnection({
        origin: originNameTwo,
        chain: ChainId.Ethereum,
        accountId: ethAccountId,
        setDefaultEthereum: true,
      });
    }
    expect(Object.keys(wallet.state.externalConnections[walletId]).length).toEqual(2);
    expect(wallet.state.externalConnections[walletId]?.[originNameOne]?.defaultEthereum).toEqual(ethAccountId);
    expect(wallet.state.externalConnections[walletId]?.[originNameTwo]?.defaultEthereum).toEqual(ethAccountId);
    expect(Object.keys(wallet.state.externalConnections[walletId]?.[originNameOne]?.ethereum).length).toBeGreaterThan(
      0
    );
    expect(Object.keys(wallet.state.externalConnections[walletId]?.[originNameTwo]?.ethereum).length).toBeGreaterThan(
      0
    );
    expect(wallet.state.externalConnections[walletId]?.[originNameOne]?.ethereum[0]).toEqual(ethAccountId);
    expect(wallet.state.externalConnections[walletId]?.[originNameTwo]?.ethereum[0]).toEqual(ethAccountId);

    // 3rd origin
    if (typeof btcAccountId !== 'undefined') {
      await wallet.dispatch.addExternalConnection({
        origin: originNameTwo,
        chain: ChainId.Bitcoin,
        accountId: btcAccountId,
        setDefaultEthereum: false,
      });
    }
    expect(Object.keys(wallet.state.externalConnections[walletId]).length).toEqual(2);
    expect(wallet.state.externalConnections[walletId]?.[originNameTwo]?.ethereum[0]).toEqual(ethAccountId);
    expect(wallet.state.externalConnections[walletId]?.[originNameTwo]?.bitcoin[0]).toEqual(btcAccountId);
  });
});
