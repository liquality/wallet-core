import { setupWallet } from '../../../index';
import defaultWalletOptions from '../../../walletOptions/defaultOptions';
import { Network } from '../../types';

let wallet: any;

beforeEach(async () => {
  wallet = await setupWallet(defaultWalletOptions);
  await wallet.dispatch.createWallet({
    key: '0x1234567890123456789012345678901234567890',
    mnemonic: 'rough symbol license spirit advance pact catalog vibrant dream great usage empty',
    imported: true,
  });
  await wallet.dispatch.unlockWallet({
    key: '0x1234567890123456789012345678901234567890',
  });

  await wallet.dispatch.setWhatsNewModalVersion({
    version: '1.0.0',
  });
});
test.skip('should be able to toggle account', async () => {
  const walletId = wallet.state.activeWalletId;
  const btcMainnetAccountId = wallet.state.accounts?.[walletId].mainnet[0].id;
  const ethMainnetAccountId = wallet.state.accounts?.[walletId].mainnet[1].id;

  //toggle account enable to false
  await wallet.dispatch.toggleAccount({
    network: Network.Mainnet,
    walletId: walletId,
    accounts: [btcMainnetAccountId, ethMainnetAccountId],
    enable: false,
  });

  expect(wallet.state.accounts?.[walletId].mainnet[0].enabled).toBe(false);
  expect(wallet.state.accounts?.[walletId].mainnet[1].enabled).toBe(false);

  //toggle account enable to true
  await wallet.dispatch.toggleAccount({
    network: Network.Mainnet,
    walletId: walletId,
    accounts: [btcMainnetAccountId, ethMainnetAccountId],
    enable: true,
  });

  expect(wallet.state.accounts?.[walletId].mainnet[0].enabled).toBe(true);
  expect(wallet.state.accounts?.[walletId].mainnet[1].enabled).toBe(true);
});
