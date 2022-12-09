import { LiqualityErrorJSON, updateErrorReporterConfig } from '@liquality/error-parser';
import buildConfig from './build.config';
import store from './store';
import * as migrations from './store/migrations';
import { WalletOptions } from './types';
import { walletOptionsStore } from './walletOptions';

function setupWallet(options: WalletOptions) {
  walletOptionsStore.setOptions(options);
  if (options.initialState) store.commit.SET_STATE({ newState: options.initialState });
  updateErrorReporterConfig({
    callback: (error: LiqualityErrorJSON) => store.dispatch.logError(error),
    release: process.env.VUE_APP_NPM_PACKAGE_VERSION || '',
    sentryDSN: process.env.VUE_APP_SENTRY_DSN || '',
  });

  return store;
}

export { setupWallet, buildConfig, migrations };
