import { ChainId } from '@liquality/cryptoassets';
import buildConfig from './build.config';
import { setupWallet } from './index';
import { LATEST_VERSION } from './store/migrations';
import { ExperimentType, Network } from './store/types';
import defaultWalletOptions from './walletOptions/defaultOptions';

test('Initial State of wallet setup', async () => {
  let wallet = await setupWallet(defaultWalletOptions);
  expect(wallet.state.rskLegacyDerivation).toBe(false);
  expect(wallet.state.version).toBe(LATEST_VERSION);
  expect(wallet.state.activeNetwork).toBe('mainnet');
  expect(wallet.state.injectEthereumChain).toBe('ethereum');
  expect(wallet.state.injectEthereum).toBe(true);
  wallet = setupWallet({
    ...defaultWalletOptions,
    initialState: {
      ...wallet.state,
      version: 18,
    },
  });
  expect(wallet.state.version).toBe(18);
});

test('should be able to create wallet and validate mainnet accounts', async () => {
  const wallet = await setupWallet(defaultWalletOptions);
  await wallet.dispatch.createWallet({
    key: '0x1234567890123456789012345678901234567890',
    mnemonic: 'test',
    imported: false,
  });
  expect(wallet.state.wallets.length).toBe(1);
  expect(wallet.state.wallets[0].id).not.toBe(undefined);
  expect(wallet.state.wallets[0].name).toEqual('Account 1');
  expect(wallet.state.wallets[0].mnemonic).toBe('test');
  expect(wallet.state.wallets[0].at).not.toBe(0);
  expect(wallet.state.unlockedAt).toBe(0);
  expect(wallet.state.wallets[0].imported).toBe(false);
  expect(wallet.state.activeWalletId).not.toBe(null);
  const numberOfAccounts = wallet.state.accounts;
  const walletId = wallet.state.activeWalletId;
  expect(numberOfAccounts[walletId]).not.toBe(undefined);
  expect(numberOfAccounts[walletId]).toHaveProperty('mainnet');
  expect(numberOfAccounts[walletId]).toHaveProperty('testnet');
  expect(wallet.state.enabledChains[walletId]).toHaveProperty('mainnet');
  expect(wallet.state.enabledChains[walletId]).toHaveProperty('testnet');
  expect(wallet.state.enabledChains[walletId]).toHaveProperty('testnet');
  expect(wallet.state.enabledChains[walletId]).toHaveProperty('mainnet');
});

test('Should be able to validate enabled chains', async () => {
  const wallet = await setupWallet(defaultWalletOptions);
  await wallet.dispatch.acceptTermsAndConditions({ analyticsAccepted: true });
  await wallet.dispatch.createWallet({
    key: '0x1234567890123456789012345678901234567890',
    mnemonic: 'test',
    imported: true,
  });
  await wallet.dispatch.unlockWallet({
    key: '0x1234567890123456789012345678901234567890',
  });

  await wallet.dispatch.setWhatsNewModalVersion({
    version: '1.0.0',
  });
  expect(wallet.state.wallets.length).toBe(1);
  expect(wallet.state.wallets[0].imported).toBe(true);
  expect(wallet.state.unlockedAt).not.toBe(0);
  expect(wallet.state.termsAcceptedAt).not.toBe(0);

  expect(wallet.state.whatsNewModalVersion).toBe('1.0.0');
  expect(wallet.state.keyUpdatedAt).not.toBe(0);
  expect(wallet.state.unlockedAt).not.toBe(0);
  expect(wallet.state.setupAt).not.toBe(0);

  const walletId = wallet.state.activeWalletId;
  const mainnetAccounts = wallet.state.enabledChains[walletId]?.mainnet;
  const testnetAccounts = wallet.state.enabledChains[walletId]?.testnet;
  expect(mainnetAccounts).toEqual(buildConfig.chains);
  expect(testnetAccounts).toEqual(buildConfig.chains);
  expect(mainnetAccounts?.length).toEqual(12);
  expect(testnetAccounts?.length).toEqual(12);
});

test('Should be able to validate assets with analytics false', async () => {
  const wallet = await setupWallet(defaultWalletOptions);
  await wallet.dispatch.createWallet({
    key: '0x1234567890123456789012345678901234567890',
    mnemonic: 'test',
    imported: true,
  });
  await wallet.dispatch.unlockWallet({
    key: '0x1234567890123456789012345678901234567890',
  });
  await wallet.dispatch.initializeAnalyticsPreferences({
    accepted: false,
  });
  expect(wallet.state.wallets.length).toBe(1);
  expect(wallet.state.wallets[0].imported).toBe(true);
  expect(wallet.state.unlockedAt).not.toBe(0);

  expect(wallet.state.analytics.userId).not.toBe(null);
  expect(wallet.state.analytics.acceptedDate).toBe(0);
  expect(wallet.state.analytics.askedDate).not.toBe(0);
  expect(wallet.state.analytics.askedTimes).toBe(0);
  expect(wallet.state.analytics.notAskAgain).toBe(false);

  const walletId = wallet.state.activeWalletId;
  const mainnetEnabledAssets = wallet.state.enabledAssets.mainnet?.[walletId];
  const testnetEnabledAssets = wallet.state.enabledAssets.testnet?.[walletId];
  expect(mainnetEnabledAssets?.length).toBeGreaterThan(1);
  expect(testnetEnabledAssets?.length).toBeGreaterThan(1);
});

test('Should be able to create wallet with validate analytics true', async () => {
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

  await wallet.dispatch.toggleExperiment({
    name: ExperimentType.ManageAccounts,
  });
  expect(wallet.state.experiments.manageAccounts).toBe(true);
});

test('Should be able create wallet and add custom token and remove token', async () => {
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

  await wallet.dispatch.addCustomToken({
    network: Network.Mainnet,
    walletId: wallet.state.activeWalletId,
    chain: ChainId.Ethereum,
    symbol: 'TST',
    name: 'Test Token',
    contractAddress: '0x1234567890123456789012345678901234567890',
    decimals: 18,
  });

  expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId][0].symbol).toBe('TST');
  expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId][0].name).toBe('Test Token');
  expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId][0].contractAddress).toBe(
    '0x1234567890123456789012345678901234567890'
  );
  expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId][0].decimals).toBe(18);
  expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId][0].chain).toBe('ethereum');

  await wallet.dispatch.addCustomToken({
    network: Network.Testnet,
    walletId: wallet.state.activeWalletId,
    chain: ChainId.Bitcoin,
    symbol: 'BCTS',
    name: 'Test Bitcoin',
    contractAddress: '0x1234567890123456789012343333378901234567890',
    decimals: 11,
  });
  expect(wallet.state.customTokens.testnet?.[wallet.state.activeWalletId][0].symbol).toBe('BCTS');
  expect(wallet.state.customTokens.testnet?.[wallet.state.activeWalletId][0].name).toBe('Test Bitcoin');
  expect(wallet.state.customTokens.testnet?.[wallet.state.activeWalletId][0].contractAddress).toBe(
    '0x1234567890123456789012343333378901234567890'
  );
  expect(wallet.state.customTokens.testnet?.[wallet.state.activeWalletId][0].decimals).toBe(11);
  expect(wallet.state.customTokens.testnet?.[wallet.state.activeWalletId][0].chain).toBe('bitcoin');

  await wallet.dispatch.removeCustomToken({
    network: Network.Mainnet,
    walletId: wallet.state.activeWalletId,
    symbol: 'TST',
  });
  expect(wallet.state.customTokens.mainnet?.[wallet.state.activeWalletId].length).toBe(0);
});
