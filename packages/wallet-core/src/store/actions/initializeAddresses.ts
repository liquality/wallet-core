import { CUSTOM_ERRORS, InternalError } from '@liquality/error-parser';
import { ActionContext, rootActionContext } from '..';
import { Network, WalletId } from '../types';

export const initializeAddresses = async (
  context: ActionContext,
  { network, walletId }: { network: Network; walletId: WalletId }
) => {
  const { state, dispatch } = rootActionContext(context);
  const accounts = state.accounts[walletId]?.[network];
  if (!accounts) {
    throw new InternalError(CUSTOM_ERRORS.NotFound.Accounts);
  }
  for (const account of accounts) {
    if (!account.addresses.length) {
      await dispatch.getUnusedAddresses({
        network,
        walletId,
        assets: account.assets,
        accountId: account.id,
      });
    }
  }
};
