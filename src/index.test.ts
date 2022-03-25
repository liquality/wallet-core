import { setupWallet } from './index';
import defaultWalletOptions from './walletOptions/defaultOptions';

it('Initial State', async () => {
  const wallet = await setupWallet(defaultWalletOptions);
  expect(wallet.state.rskLegacyDerivation).toBe(false);
});
