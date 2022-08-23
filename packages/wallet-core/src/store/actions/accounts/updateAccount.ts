import { ActionContext, rootActionContext } from '../..';
import { Account, Network, WalletId } from '../../types';

export const updateAccount = async (
  context: ActionContext,
  { network, walletId, account }: { network: Network; walletId: WalletId; account: Account }
) => {
  const { commit } = rootActionContext(context);
  const updatedAt = Date.now();
  const updatedAccount = {
    ...account,
    updatedAt,
  };
  commit.UPDATE_ACCOUNT({ network, walletId, account: updatedAccount });
  return updatedAccount;
};
