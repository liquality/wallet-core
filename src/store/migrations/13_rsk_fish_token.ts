import { ChainId } from '@liquality/cryptoassets';
import { Account } from '../types';

export const rskFishToken = {
  version: 13,
  migrate: async (state: any) => {
    const { activeWalletId, enabledAssets } = state;
    const mainnetAccounts = state.accounts[activeWalletId].mainnet.map(
      (account: Account) => {
        if (account.chain === ChainId.Rootstock) {
          return {
            ...account,
            assets: [...account.assets, 'FISH'],
          };
        }
        return account;
      }
    );

    return {
      ...state,
      accounts: {
        ...state.accounts,
        [activeWalletId]: {
          ...state.accounts[activeWalletId],
          mainnet: mainnetAccounts,
        },
      },
      enabledAssets: {
        ...enabledAssets,
        mainnet: {
          ...enabledAssets.mainnet,
          activeWalletId: [...enabledAssets.mainnet[activeWalletId], 'FISH'],
        },
      },
    };
  },
};
