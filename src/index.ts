import { store } from './store';
import { WalletOptions } from './types';
import { walletOptionsStore } from './walletOptions';

async function setupWallet(options: WalletOptions) {
  walletOptionsStore.setOptions(options);
  if (options.initialState)
    await store.commit.SET_STATE({ newState: options.initialState });

  return store;
}

export { setupWallet };
