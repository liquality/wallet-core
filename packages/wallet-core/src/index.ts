import { LiqualityErrorJSON, updateErrorReporterConfig } from '@liquality/error-parser';
import buildConfig from './build.config';
import store from './store';
import * as migrations from './store/migrations';
import { WalletOptions } from './types';
import { walletOptionsStore } from './walletOptions';

function setupWallet(options: WalletOptions) {
  walletOptionsStore.setOptions(options);
  if (options.initialState) store.commit.SET_STATE({ newState: options.initialState });
  updateErrorReporterConfig({ callback: (error: LiqualityErrorJSON) => store.dispatch.logError(error) });

  // to update enabled assets with default assets in case that can be updated not need a new migration
  const { enabledAssets, activeWalletId } = store.state;
  store.commit.SET_STATE({
    newState: {
      ...store.state,
      enabledAssets: {
        mainnet: {
          [activeWalletId]: [
            ...(enabledAssets['mainnet']?.[activeWalletId] || []),
            ...buildConfig.defaultAssets.mainnet,
          ].filter((value, index, array) => array.indexOf(value) === index),
        },
        testnet: {
          [activeWalletId]: [
            ...(enabledAssets['testnet']?.[activeWalletId] || []),
            ...buildConfig.defaultAssets.testnet,
          ].filter((value, index, array) => array.indexOf(value) === index),
        },
      },
    },
  });

  return store;
}

export { setupWallet, buildConfig, migrations };
