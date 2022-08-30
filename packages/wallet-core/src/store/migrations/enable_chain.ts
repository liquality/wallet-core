import { ChainId, getChain } from '@liquality/cryptoassets';
import { accountCreator, getNextAccountColor } from '../../utils/accounts';
import { getDerivationPath } from '../../utils/derivationPath';
import { Networks } from '../../utils/networks';
import { AccountType } from '../types';

async function enableChain(state: any, chainId: ChainId) {
  const accounts: any = {};
  const enabledChains: any = {};

  for (const walletId in state.accounts) {
    accounts[walletId] = {};
    enabledChains[walletId] = {};

    for (const network of Networks) {
      const accountExists = state.accounts[walletId][network].find((account: any) => account.chain === chainId);

      if (accountExists) {
        accounts[walletId][network] = [...state.accounts[walletId][network]];
      } else {
        const chain = getChain(network, chainId);
        const derivationPath = getDerivationPath(chainId, network, 0, AccountType.Default);
        const account = accountCreator({
          walletId,
          network,
          account: {
            name: `${chain.name} 1`,
            alias: '',
            chain: chainId,
            addresses: [],
            assets: chain.nativeAsset.map((nativeAsset) => nativeAsset.code),
            balances: {},
            type: AccountType.Default,
            index: 0,
            derivationPath,
            color: getNextAccountColor(chainId, 0),
          },
        });
        accounts[walletId][network] = [...state.accounts[walletId][network], account];
      }

      const chainEnabled = state.enabledChains[walletId][network].includes(chainId);
      if (chainEnabled) {
        enabledChains[walletId][network] = [...state.enabledChains[walletId][network]];
      } else {
        enabledChains[walletId][network] = [...state.enabledChains[walletId][network], chainId];
      }
    }
  }

  const enabledAssets: any = {};
  for (const network of Networks) {
    enabledAssets[network] = {};
    for (const walletId in state.enabledAssets[network]) {
      enabledAssets[network][walletId] = [...state.enabledAssets[network][walletId]];

      const chain = getChain(network, chainId);
      const nativeAssetsCodes = chain.nativeAsset.map((nativeAsset) => nativeAsset.code);
      for (const nativeAssetCode of nativeAssetsCodes) {
        if (!enabledAssets[network][walletId].includes(nativeAssetCode))
          enabledAssets[network][walletId].push(nativeAssetCode);
      }
    }
  }

  return {
    ...state,
    enabledChains,
    enabledAssets,
    accounts,
  };
}

export { enableChain };
