import { ActionContext, rootActionContext } from '../..';
import { AccountId, Network, WalletId } from '../../types';

export const toggleAccount = (
  context: ActionContext,
  {
    network,
    walletId,
    accounts,
    enable,
  }: { network: Network; walletId: WalletId; accounts: AccountId[]; enable: boolean }
) => {
  const { commit, dispatch } = rootActionContext(context);
  accounts.forEach((accountId) => {
    commit.TOGGLE_ACCOUNT({ network, walletId, accountId, enable });
    if (enable) {
      dispatch.updateAccountBalance({
        network,
        walletId,
        accountId,
      });
    }
  });
};
