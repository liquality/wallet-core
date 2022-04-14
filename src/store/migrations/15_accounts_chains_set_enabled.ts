import buildConfig from '../../build.config';
import { Networks } from '../../utils/networks';

export const accountsChainsSetEnabled = {
  version: 15,
  migrate: async (state: any) => {
    const accounts: any = {};
    const enabledChains: any = {};

    for (const walletId in state.accounts) {
      accounts[walletId] = {};
      enabledChains[walletId] = {};

      for (const network of Networks) {
        const updatedAccounts = state.accounts[walletId][network].map((a: any) => ({
          ...a,
          enabled: true,
        }));
        accounts[walletId][network] = updatedAccounts;
        enabledChains[walletId][network] = [...buildConfig.chains];
      }
    }

    return {
      ...state,
      enabledChains,
      accounts,
    };
  },
};
