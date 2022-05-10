import { ChainId } from '@liquality/cryptoassets';
import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { Network } from '../types';

test('Should be able create wallet and add custom tokens', async () => {
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
});
