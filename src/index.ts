import buildConfig from './build.config';
import store from './store';
import * as migrations from './store/migrations';
import { WalletOptions } from './types';
import { walletOptionsStore } from './walletOptions';

function setupWallet(options: WalletOptions) {
  walletOptionsStore.setOptions(options);
  if (options.initialState) store.commit.SET_STATE({ newState: options.initialState });

  return store;
}

export { setupWallet, buildConfig, migrations };
