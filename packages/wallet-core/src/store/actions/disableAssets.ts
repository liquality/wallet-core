import { CUSTOM_ERRORS, createInternalError } from '@liquality/error-parser';
import { ActionContext, rootActionContext } from '..';
import { Asset, Network, WalletId } from '../types';

export const disableAssets = async (
  context: ActionContext,
  { network, walletId, assets }: { network: Network; walletId: WalletId; assets: Asset[] }
) => {
  const { state, commit, getters } = rootActionContext(context);
  commit.DISABLE_ASSETS({ network, walletId, assets });
  const accounts = state.accounts[walletId]?.[network];
  if (!accounts) {
    throw createInternalError(CUSTOM_ERRORS.NotFound.Accounts);
  }
  accounts
    .filter((a) => a.assets.some((s) => assets.includes(s)))
    .forEach((account) => {
      const _assets = assets.filter((asset) => getters.cryptoassets[asset]?.chain === account.chain);
      commit.DISABLE_ACCOUNT_ASSETS({
        network,
        walletId,
        assets: _assets,
        accountId: account.id,
      });
    });
};
