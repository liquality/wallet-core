import { ChainId, getChainByChainId } from '@liquality/cryptoassets';
import { ActionContext, rootActionContext } from '..';
import { accountCreator, getNextAccountColor } from '../../utils/accounts';
import { AccountType, Asset, Network, WalletId } from '../types';

export const enableAssets = async (
  context: ActionContext,
  { network, walletId, assets }: { network: Network; walletId: WalletId; assets: Asset[] }
) => {
  const { state, commit, dispatch, getters } = rootActionContext(context);
  commit.ENABLE_ASSETS({ network, walletId, assets });
  const accounts = state.accounts[walletId]?.[network] || [];

  // try to find if we need to create a new account
  const accountsChains = accounts.map((a) => a.chain);
  const accountsToCreate = assets
    .filter((asset) => !!getters.cryptoassets[asset]?.chain)
    .map((asset) => getters.cryptoassets[asset]?.chain)
    .filter((chainId) => !accountsChains.includes(chainId))
    .map(async (chainId: ChainId) => {
      const chain = getChainByChainId(network, chainId);
      const _assets = assets.filter((asset) => getters.cryptoassets[asset]?.chain === chainId);
      const _account = accountCreator({
        walletId,
        network,
        account: {
          name: `${chain.name} 1`,
          chain: chainId,
          addresses: [],
          assets: _assets,
          balances: {},
          type: AccountType.Default,
          index: 0,
          color: getNextAccountColor(chainId, 0),
        },
      });
      commit.CREATE_ACCOUNT({ network, walletId, account: _account });
      await dispatch.getUnusedAddresses({
        network,
        walletId,
        assets: _account.assets,
        accountId: _account.id,
      });
    });

  if (accountsToCreate.length > 0) {
    await Promise.all(accountsToCreate);
  }

  accounts.forEach(async (account) => {
    const accountId = account.id;
    const _assets = assets.filter((asset) => getters.cryptoassets[asset]?.chain === account.chain);
    if (_assets && _assets.length > 0) {
      commit.ENABLE_ACCOUNT_ASSETS({
        network,
        walletId,
        assets: _assets,
        accountId,
      });
      await dispatch.updateAccountBalance({ network, walletId, accountId });
    }
  });
  dispatch.updateCurrenciesInfo({ assets: [...getters.allNetworkAssets] });
  dispatch.updateFiatRates({ assets: [...getters.allNetworkAssets] });
  dispatch.updateMarketData({ network });
};
