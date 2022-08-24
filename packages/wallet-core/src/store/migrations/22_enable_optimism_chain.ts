import { ChainId, chains } from '@liquality/cryptoassets';
import { accountCreator, getNextAccountColor } from '../../utils/accounts';
import { getDerivationPath } from '../../utils/derivationPath';
import { Networks } from '../../utils/networks';
import { AccountType } from '../types';

export const enableOptimismChain = {
  version: 22,
  migrate: async (state: any) => {
    const accounts: any = {};
    const enabledChains: any = {};
    for (const walletId in state.accounts) {
      accounts[walletId] = {};
      enabledChains[walletId] = {};

      for (const network of Networks) {
        const accountExistsAndProperlyInitialized = state.accounts[walletId][network].find(
          (account: any) => account.chain === ChainId.Optimism && account.assets?.length > 0
        );
        if (accountExistsAndProperlyInitialized) {
          accounts[walletId][network] = [...state.accounts[walletId][network]];
        } else {
          const chain = chains[ChainId.Optimism];
          const derivationPath = getDerivationPath(ChainId.Optimism, network, 0, AccountType.Default);
          const optimismAccount = accountCreator({
            walletId,
            network,
            account: {
              name: `${chain.name} 1`,
              alias: '',
              chain: ChainId.Optimism,
              addresses: [],
              assets: ['OPTETH'],
              balances: {},
              type: AccountType.Default,
              index: 0,
              derivationPath,
              color: getNextAccountColor(ChainId.Optimism, 0),
            },
          });
          accounts[walletId][network] = [...state.accounts[walletId][network], optimismAccount];
        }

        const chainEnabled = state.enabledChains[walletId][network].includes(ChainId.Optimism);
        if (chainEnabled) {
          enabledChains[walletId][network] = [...state.enabledChains[walletId][network]];
        } else {
          enabledChains[walletId][network] = [...state.enabledChains[walletId][network], ChainId.Optimism];
        }
      }
    }

    const enabledAssets: any = {};
    for (const network of Networks) {
      enabledAssets[network] = {};
      for (const walletId in state.enabledAssets[network]) {
        enabledAssets[network][walletId] = [...state.enabledAssets[network][walletId]];
        if (!enabledAssets[network][walletId].includes('OPTETH')) enabledAssets[network][walletId].push('OPTETH');
      }
    }

    return {
      ...state,
      enabledChains,
      enabledAssets,
      accounts,
    };
  },
};
