import { ChainId } from '@liquality/cryptoassets';
import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { Network } from '../types';

test('should be able to export private key', async () => {
  const wallet = await setupWallet(defaultWalletOptions);
  await wallet.dispatch.createWallet({
    key: '0x1234567890123456789012345678901234567890',
    mnemonic: 'piece effort bind that embrace enrich remind powder sudden patient legend group',
    imported: true,
  });
  await wallet.dispatch.unlockWallet({
    key: '0x1234567890123456789012345678901234567890',
  });
  const walletId = wallet.state.activeWalletId;
  expect(walletId).not.toBeNull();
  const mainnetAccounts = wallet?.state?.enabledAssets?.mainnet?.[walletId];
  expect(mainnetAccounts).not.toBeNull();

  const account = wallet.state.accounts?.[walletId]?.mainnet?.[1];
  expect(account?.chain).toBe(ChainId.Ethereum);
  const ethAccountId = account?.id;

  const privateKey = await wallet.dispatch.exportPrivateKey({
    network: Network.Mainnet,
    walletId: walletId,
    accountId: ethAccountId!,
    chainId: ChainId.Ethereum,
  });
  expect(privateKey).not.toBeNull();
  expect(privateKey).not.toBe(undefined);
  expect(privateKey).not.toBe('N/A');
});
