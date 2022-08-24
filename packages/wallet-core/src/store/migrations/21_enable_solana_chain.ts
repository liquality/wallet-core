import { ChainId, getChainByChainId } from '@liquality/cryptoassets';
import { accountCreator, getNextAccountColor } from '../../utils/accounts';
import { getDerivationPath } from '../../utils/derivationPath';
import { Networks } from '../../utils/networks';
import { AccountType } from '../types';

export const enableSolanaChain = {
  version: 21,
  migrate: async (state: any) => {
    const accounts: any = {};
    const enabledChains: any = {};
    for (const walletId in state.accounts) {
      accounts[walletId] = {};
      enabledChains[walletId] = {};

      for (const network of Networks) {
        const chain = getChainByChainId(network, ChainId.Solana);
        const derivationPath = getDerivationPath(ChainId.Solana, network, 0, AccountType.Default);
        const solanaAccount = accountCreator({
          walletId,
          network,
          account: {
            name: `${chain.name} 1`,
            alias: '',
            chain: ChainId.Solana,
            addresses: [],
            assets: ['SOL'],
            balances: {},
            type: AccountType.Default,
            index: 0,
            derivationPath,
            color: getNextAccountColor(ChainId.Solana, 0),
          },
        });
        accounts[walletId][network] = [...state.accounts[walletId][network], solanaAccount];

        enabledChains[walletId][network] = [...state.enabledChains[walletId][network], ChainId.Solana];
      }
    }

    const enabledAssets: any = {};
    for (const network of Networks) {
      enabledAssets[network] = {};
      for (const walletId in state.enabledAssets[network]) {
        enabledAssets[network][walletId] = [...state.enabledAssets[network][walletId]];
        enabledAssets[network][walletId].push('SOL');
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
